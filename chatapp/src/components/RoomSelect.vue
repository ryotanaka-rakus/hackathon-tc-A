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
  <h1>Room Selection</h1>
  <h1>{{ userName }}さん、こんにちは</h1>
  <h2>ルームを選択してください</h2>
  <div>
    <!-- ルーム情報をタイル状に表示 -->
    <div v-for="(room, index) in roomList" :key="index" class="room-tile">
      <!-- ボタン要素としてラップ -->
      <button @click="enterRoom(index + 1)" class="room-button">{{ room.name }}</button>
    </div>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 500px;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}

/* タイルのスタイル */
.room-tile {
  display: inline-block;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

/* ボタンのスタイル */
.room-button {
  background-color: #007bff;
  /* ボタンの背景色 */
  color: #fff;
  /* ボタンの文字色 */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.room-button:hover {
  background-color: #0056b3;
  /* ホバー時の背景色 */
}
</style>
