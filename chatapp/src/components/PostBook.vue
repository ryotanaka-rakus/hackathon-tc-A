<script setup>
import { reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'
import 'tailwindcss/tailwind.css'
import Post from './ListPost.vue'
import Book from './ListBook.vue'
import Fun from './Listfunction.vue'
import Btn from './ListButtonPost.vue'

// 仮のuserId, roomId。Login.vueから渡す必要がある。
const userId = 1
const roomId = 1
// #endregion

// #region local variable
const socket = socketManager.getInstance()

// ユーザー一覧をサーバーから取得する
const fetchUsers = () => {
  socket.emit("getUsersEvent"); // サーバにユーザー一覧を要求する
}

const chatList = reactive([])
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
  fetchUsers() // コンポーネントがマウントされたらユーザー一覧を取得する
  fetchUserBookmarks()
  fetchPinnedMessages()
})

// サーバーからユーザーのブックマークを取得する
const fetchUserBookmarks = () => {
  socket.emit("getUserBookmarksEvent", userId);
};

const fetchPinnedMessages = () => {
  socket.emit("getPinnedMessagesEvent", roomId)
}

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", (data) => {
    chatList.unshift(data)
  })

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    chatList.unshift(data)
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    console.log(data)
    chatList.unshift(data)

  })
};
</script>

<template>
  <div class="flex">
    <Fun />
    <div class="flex-1 p-3">
      <div class="my-5 ">
        <div class="flex justify-center">
          <div>
            <Post />
          </div>
          <Book />
        </div>
        <Btn />
      </div>
    </div>
  </div>
</template>