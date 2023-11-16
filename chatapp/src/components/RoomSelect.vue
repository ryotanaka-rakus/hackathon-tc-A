<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'
import 'tailwindcss/tailwind.css'

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = socketManager.getInstance()
const router = useRouter()


// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const userList = reactive([]) // ユーザー一覧を格納するためのリアクティブな配列

//ルーム情報をサーバから取得し、表示させる
function useRooms() {
  const rooms = ref([]);
  const getRooms = () => {
    socket.emit('getRooms');
  }
  onMounted(() => {
    getRooms();
  })
  socket.on('expRooms', (receivedRooms) => {
    // 受け取ったルーム情報をroomsに代入
    rooms.value = receivedRooms;
  })
  return rooms; // ルーム情報を返す
}
const roomList = useRooms();

//ボタンが押されたとき、そのルームIDをサーバーに送信する
const enterRoom = (roomid) => {
  // ルームIDを取得
  console.log(roomid)
  const data = {
    Username: userName.value,
    RoomID: roomid,
  }
  // サーバーにルームIDを送信
  socket.emit('addUserToRoom', data);
  // ルームに入るアクションをここで実行
  // 例: ルームに入るための関数を呼び出すなど
  router.push({ name: "chat" })
}
// #endregion
</script>

<template>
  <div class="flex justify-center mt-20">
    <h1 class="text-gray-600 font-bold text-4xl mt-15">ルームを選択してください</h1>
  </div>
  <div class="flex justify-center mt-20">
    <!-- ルーム情報をタイル状に表示 -->
    <div v-for="(room, index) in roomList" :key="index" class="mx-4 items-center">
      <!-- ボタン要素としてラップ -->
      <button @click="enterRoom(index + 1)" class="py-3 px-4 bg-blue-500 rounded text-white hover:bg-blue-700 shadow-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring focus:border-blue-300">{{ room.name }}</button>
    </div>
  </div>
</template>
