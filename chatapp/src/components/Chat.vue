<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
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
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const memoList = reactive([])
const userList = reactive([]) // ユーザー一覧を格納するためのリアクティブな配列
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
  fetchUsers() // コンポーネントがマウントされたらユーザー一覧を取得する
})
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {

  //ユーザー名が入力されているかチェック
  const intext = chatContent.value.trim()

  if (intext) {
    const messageData = {
      messageContent: chatContent.value,
      userId: userId,
      roomId: roomId,
    }
    socket.emit("publishEvent", messageData);

    // 入力欄を初期化
    chatContent.value = ""
  }
  else {
    alert("テキストを入力してください。")
  }
}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", userName.value + "さんが退室しました")
}

// メモをサーバに送信する
const onMemo = () => {
  // メモの内容が入力されているかチェック
  const memoText = chatContent.value.trim();

  if (memoText) {
    const memoData = {
      content: chatContent.value,
      userId: userId,
    }
    socket.emit("memoEvent", memoData);

    // 入力欄を初期化
    chatContent.value = ""
  }
  else {
    alert("メモを入力してください。")
  }
}

// サーバーから受信したメモを画面上に表示する
const onReceiveMemo = (memo) => {
  memoList.unshift(memo)
}

// #endregion

// #region socket event handler
// サーバーから受信したエラーを処理する
const onReceiveError = (errorMessage) => {
  // エラーメッセージをどのように表示するかは、アプリケーションに依存します
  // 例えばアラート、モーダル、または特定のUIコンポーネントにエラーを表示することができます
  alert(errorMessage);
}
// #endregion

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
    chatList.unshift(data)
  })

  // メモイベントを受け取ったら実行
  socket.on("memoEvent", onReceiveMemo);

  // エラーイベントを受け取ったら実行
  socket.on("errorEvent", onReceiveError);

  // ユーザー一覧イベントを受け取ったら実行
  socket.on("usersListEvent", (users) => {
    userList.splice(0, userList.length, ...users) // 受け取ったユーザー一覧で更新
  })
}



// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area" v-model="chatContent"></textarea>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <h4>ChatList</h4>
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">
            {{ userList.filter((user) => user.id == chat.senderId)[0].name + "さん: " + chat.content }}
          </li>
        </ul>
      </div>
      <div class="mt-5" v-if="memoList.length !== 0">
        <h4>MemoList</h4>
        <ul>
          <li class="item mt-4" v-for="(memo, i) in memoList" :key="i">
            {{ memo.content }}
          </li>
        </ul>
      </div>
    </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
    </router-link>
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
</style>