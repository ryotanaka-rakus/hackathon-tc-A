import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  socket.on("publishEvent", (data) => {
    console.log("投稿: " + data)
    io.sockets.emit("publishEvent", data)
  })
}