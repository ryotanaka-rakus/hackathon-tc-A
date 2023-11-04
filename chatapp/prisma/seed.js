import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Userのseedデータ
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      password: 'alice123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      password: 'bob123',
    },
  });

  // Roomのseedデータ
  const room1 = await prisma.room.create({
    data: {
      name: 'General',
      is_direct_message: 0, // 0 または 1 でダイレクトメッセージかどうかを判断
    },
  });

  // UsersRoomsのseedデータ
  const usersRooms1 = await prisma.usersRooms.create({
    data: {
      userId: user1.id,
      roomId: room1.id,
    },
  });

  const usersRooms2 = await prisma.usersRooms.create({
    data: {
      userId: user2.id,
      roomId: room1.id,
    },
  });

  // Messageのseedデータ
  const message1 = await prisma.message.create({
    data: {
      roomId: room1.id,
      senderId: user1.id,
      content: 'Hello, Bob!',
    },
  });

  // MessageReplyのseedデータ
  const messageReply1 = await prisma.messageReply.create({
    data: {
      messageId: message1.id,
      senderId: user2.id,
      content: 'Hello, Alice!',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
