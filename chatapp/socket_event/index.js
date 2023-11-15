import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 特定のルームに関連するピン留めされたメッセージを取得する関数
async function getPinnedMessages(roomId) {
  return await prisma.pinnedMessage.findMany({
    where: {
      roomId: roomId,
    },
  });
}

// メッセージをピン留めする関数
async function pinMessage(roomId, messageId) {
  return await prisma.pinnedMessage.create({
    data: {
      room: {
        connect: { id: roomId },
      },
      message: {
        connect: { id: messageId },
      },
    },
  });
}

// ブックマークをデータベースに保存する関数
async function saveBookmark(userId, messageId) {
  try {
    return await prisma.bookmark.create({
      data: {
        userId,
        messageId,
      },
    });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    throw new Error('Bookmark saving failed');
  }
}

// ユーザーのブックマークを取得する関数
async function getUserBookmarks(userId) {
  try {
    return await prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
      include: {
        message: true, // メッセージの内容も取得する
      },
    });
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw new Error('Getting bookmarks failed');
  }
}

// ルームのチャット履歴を取得する
async function getRoomChatList(roomId) {
  try {
    return await prisma.message.findMany({
      where: {
        roomId: roomId,
      },
    });
  } catch (error) {
    console.error('Error getting room chat list:', error);
    throw new Error('Getting room chat list failed');
  }
}

// メモをデータベースに保存する関数
async function saveMemo(content, userId) {
  try {
    return await prisma.note.create({
      data: {
        content,
        userId,
      },
    });
  } catch (error) {
    console.error('Error saving memo:', error);
    throw new Error('Memo saving failed');
  }
}

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

// メッセージをデータベースから取得する関数
async function getMessage(message_id) 
{
  try 
  {
    return await prisma.message.findUnique({
      where: {
        id : message_id, // 特定のメッセージのみ取得
      },
      select : {
        id       : true,
        roomId   : true,
        senderId : true,
        content  : true,
        createdAt: true
      }
    });
  } 
  catch (error) 
  {
    console.error('Error getting message:', error);
    throw new Error('Message getting failed');
  }
}

// データベースに登録されているメッセージを編集後のメッセージに更新する関数
async function updateMessage(message_id, edit_content) 
{
  try 
  {
    return await prisma.message.update({
      where: {
        id : message_id, // 特定のメッセージの編集履歴のみを取得
      },
      data: {
        content : edit_content, // 元のメッセージを編集後のメッセージに更新
      },
    });
  } 
  catch (error) 
  {
    console.error('Error updating message:', error);
    throw new Error('Message updating failed');
  }
}

// 編集前のメッセージをデータベースに登録する関数
async function saveEditMessage(message_id, previous_content) 
{
  try 
  {
    await prisma.messageEditHistory.create({
      data: {
        messageId       : message_id,       // 対となる Message データの id
        previousContent : previous_content, // 編集履歴
      },
    });
  } 
  catch (error) 
  {
    console.error('Error saving message:', error);
    throw new Error('Message saving failed');
  }
}

// 編集履歴情報を追加したメッセージをデータベースから取得する関数
async function getEditMessage(message_id) 
{
  try 
  {
    // messageEditHistoryフィールドのリストを返却する
    return await prisma.messageEditHistory.findMany({
      where: {
        messageId : message_id // messageIdカラムがmessage_idと一致するデータのみ取得
      },
      select : {
        id              : true, // 編集履歴のid
        messageId       : true, // 対となる Message データの id
        previousContent : true, // 編集履歴
        createdAt       : true  // 更新日時
      }
    });
  } 
  catch (error) 
  {
    console.error('Error edit message:', error);
    throw new Error('Message edit failed');
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


//ルーム一覧を返す関数
async function getRooms() {
  try {
    return await prisma.Room.findMany({
      select: {
        name: true,
      }
    });
  } catch (error) {
    console.error('Error getting rooms:', error);
    throw new Error('Getting rooms failed');
  }
}


//ルーム選択を受け取り、UserRoomテーブルにUserIDとRoomIDを送信する
async function addForUsersRooms(userName, roomId) {
  console.log(userName, roomId)
  try {
    // UserテーブルからuserNameに対応するユーザーのIDを取得
    const user = await prisma.User.findFirst({
      where: {
        name: userName,
      },
    });
    if (!user) {
      throw new Error(`User not found with name: ${userName}`);
    }

    // UserRoomsテーブルに新しいレコードを追加
    return await prisma.UsersRooms.create({
      data: {
        userId: user.id, // ユーザーIDを使用
        roomId: roomId,
      },
    });
  } catch (error) {
    console.error('Error adding user to room:', error);
    throw new Error('Adding user to room failed');
  }
}


//ユーザをデータベースに登録する関数
async function addUser(userName, password) {
  const user = await prisma.User.findFirst({
    where: {
      OR: [
        { name: { equals: userName } }
      ]
    },
  });
  if (user) {
    // ユーザー名が一致するユーザーが見つかった場合
    return false;
  }
  try {
    //Userテーブルに追加
    return await prisma.User.create({
      data: {
        name: userName,
        password: password,
      },
    });
  } catch (error) {
    console.error('Error add user:', error);
    throw new Error('add user failed');
  }
}

//ログイン認証する関数
async function authenticateUser(username, password) {
  // nameとpasswordが一致する最初のレコードを取得、なかったらnullを返す
  const user = await prisma.User.findFirst({
    where: {
      OR: [{ name: { equals: username } }, { password: { equals: password } }]
    },
  });
  if (user && user.password === password) {
    // パスワードが一致する場合
    return true;
  } else {
    // ユーザーが見つからないか、パスワードが一致しない場合
    return false;
  }
}

export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", async(data) => {
    console.log("入室: " + data)
    socket.broadcast.emit("enterEvent", data + "さんが入室しました")
    try {
      const users = await getUsers();

      // ユーザー一覧をリクエストしたクライアントに送信する
      socket.emit("usersListEvent", users);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "ユーザー情報の取得に失敗しました。");
    }
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

  // 編集メッセージを送信する
  socket.on("editEvent", async (data) => 
  {
    try 
    {
      console.log("data.messageId")

      // 編集前のメッセージをMessageテーブルから取得し、MessageEditHistoryテーブルに登録
      const previous_content = await getMessage(data.messageId);
      await saveEditMessage(data.messageId, previous_content.content);
      
      // 編集前のメッセージをMessageEditHistoryテーブルから取得 (編集履歴のリストを返す)
      const edit_message = await getEditMessage(data.messageId);
      console.log("編集したメッセージの内容:", edit_message);

      // Messageテーブルに登録されている編集前のメッセージを編集後のメッセージに変更
      const message = await updateMessage(data.messageId, data.editContent)
      console.log("メッセージの内容:", message);

      // 全ての編集履歴を保有したメッセージを全クライアントに送信
      io.sockets.emit("editEvent", {
        message      : message,
        edit_message : edit_message
      });
    }
    catch (error) 
    {
      // エラーメッセージを送信者にのみ送信
      socket.emit("errorEvent", "編集メッセージの保存に失敗しました。");
    }
  })

  // ユーザー一覧のイベントハンドラ
  socket.on("getUsersEvent", async () => {
    try {
      const users = await getUsers();

      // ユーザー一覧をリクエストしたクライアントに送信する
      socket.emit("usersListEvent", users);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "ユーザー情報の取得に失敗しました。");
    }
  });

  //ルーム一覧にアクセスする
  socket.on("getRooms", async () => {
    try {
      const rooms = await getRooms();
      console.log(rooms)

      // ルーム一覧をフロントに送信
      socket.emit("expRooms", rooms);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "ルームの取得に失敗しました。");
    }
  });

  // ユーザ情報をデータベースに登録する
  socket.on("addUser", async (data) => {
    try {
      const add = await addUser(data.userName, data.password);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "ユーザの登録に失敗しました");
    }
  })

  // ユーザID,ルームIDをUsersRoomsテーブルに登録する
  socket.on("addUserToRoom", async (data) => {
    const u_name = data.Username
    const r_Id = data.RoomID
    console.log(u_name)
    console.log(r_Id)
    try {
      const add = await addForUsersRooms(u_name, r_Id);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "UsersRoomsへの登録に失敗しました");
    }
  })

  //ログイン認証機能
  socket.on("checkLogin", async (data) => {
    const username = data.userName
    const password = data.password
    // ここでデータベースとの照合処理を実行
    const isOk = await authenticateUser(username, password);
    if (isOk) {
      // ユーザーが見つかり、パスワードが一致する(認証成功)場合
      socket.emit("authenticationResult", true);
      console.log(username + "さんは認証成功しました");
    } else {
      // 認証失敗の場合
      socket.emit("authenticationResult", false);
      console.log(username + "さんは認証失敗しました");
    }
  });

  socket.on("checkNewName", async (data) => {
    const username = data.userName
    const password = data.password
    // ここでデータベースとの照合処理を実行
    const isOkUser = await addUser(username, password);
    if (isOkUser) {
      socket.emit("authAddUser", true);
    } else {
      socket.emit("authAddUser", false);
      console.log(username + "さんは認証失敗しました");
    }
  });


  // メモイベントハンドラ
  socket.on("memoEvent", async (data) => {
    try {
      console.log(data);

      // メモをデータベースに保存する
      const memo = await saveMemo(data.content, data.userId);

      // 保存したメモをリクエストしたクライアントに送信する
      socket.emit("memoEvent", memo);
    } catch (error) {
      // エラーメッセージを送信者にのみ送信する
      socket.emit("errorEvent", "メモの保存に失敗しました。");
    }
  });

  // ブックマークのイベントハンドラ
  socket.on("saveBookmarkEvent", async ({ userId, messageId }) => {
    try {
      const bookmark = await saveBookmark(userId, messageId);
      socket.emit("bookmarkSavedEvent", bookmark);
    } catch (error) {
      socket.emit("errorEvent", "ブックマークの保存に失敗しました。");
    }
  });

  // ユーザーのブックマークを取得するイベントハンドラ
  socket.on("getUserBookmarksEvent", async (userId) => {
    try {
      const bookmarks = await getUserBookmarks(userId);
      socket.emit("userBookmarksEvent", bookmarks);
    } catch (error) {
      socket.emit("errorEvent", "ブックマークの取得に失敗しました。");
    }
  });

  // 特定のルームのピン留めされたメッセージを取得
  socket.on("getPinnedMessagesEvent", async (roomId) => {
    try {
      const pinnedMessages = await getPinnedMessages(roomId);
      socket.emit("pinnedMessagesEvent", pinnedMessages);
    } catch (error) {
      socket.emit("errorEvent", "ピン留めされたメッセージの取得に失敗しました。");
    }
  });

  // ルームのチャット履歴を取得するハンドラ
  socket.on("getRoomChatListEvent", async (roomId) => {
    try {
      console.log("ルームのチャット履歴を取得")
      const chatList = await getRoomChatList(roomId);
      socket.emit("roomChatListEvent", chatList);
    } catch (error) {
      socket.emit("errorEvent", "ブックマークの取得に失敗しました。");
    }
  });

  // ルームのチャットの編集履歴を取得するハンドラ
  socket.on("getRoomEditListEvent", async (roomId) => {
    try {
      console.log("ルームの編集履歴を取得");
      const chatList = await getRoomChatList(roomId);
      const editList = [];
      for (const chat of chatList) {
        editList.unshift(await getEditMessage(chat.id));
      }
      console.log(editList)
      socket.emit("roomEditListEvent", editList);
    } catch (error) {
      socket.emit("errorEvent", "編集履歴の取得に失敗しました。");
    }
  });

  // メッセージをピン留めする
  socket.on("pinMessageEvent", async ({ roomId, messageId }) => {
    try {
      const pinned = await pinMessage(roomId, messageId);
      io.sockets.emit("messagePinnedEvent", pinned);
    } catch (error) {
      socket.emit("errorEvent", "メッセージのピン留めに失敗しました。");
    }
  });
}
