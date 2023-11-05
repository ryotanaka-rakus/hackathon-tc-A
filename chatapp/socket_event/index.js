import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// メッセージをデータベースに保存する関数
async function saveMessage(content, userId, roomId) {
  try {
    return await prisma.message.create({
      data: {
        content,
        senderId: userId,
        roomId: roomId,
      },
    });
  } catch (error) {
    console.error('Error saving message:', error);
    throw new Error('Message saving failed');
  }
}

// ユーザー一覧を取得する関数
async function getUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        // パスワードなど、クライアントに送信すべきではない情報は含めない
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Getting users failed');
  }
}

export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    console.log("入室: " + data)
    socket.broadcast.emit("enterEvent", data)
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    console.log("退室: " + data)
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", async (data) => {
    try {
      console.log(data);

      // メッセージをデータベースに保存する
      const message = await saveMessage(data.messageContent, data.userId, data.roomId);

      // 保存したメッセージを全クライアントに送信する
      io.sockets.emit("publishEvent", message);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "メッセージの保存に失敗しました。");
    }
  })

  // ユーザー一覧のイベントハンドラ
  socket.on("getUsersEvent", async () => {
    try {
      const users = await getUsers();
      console.log(users)

      // ユーザー一覧をリクエストしたクライアントに送信する
      socket.emit("usersListEvent", users);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "ユーザー情報の取得に失敗しました。");
    }
  });
}