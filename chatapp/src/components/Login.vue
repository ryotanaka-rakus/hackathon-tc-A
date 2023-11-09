<script setup>
import { inject, ref, registerRuntimeCompiler, onMounted } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const inputUserName = ref("")
const inputPassword = ref("")
const isLogin = ref(false) //Trueならログイン、Falseなら新規登録
// #endregion

//　トグルボタンで新規登録かログインか切り替え
const onToggleForm = () => {
  isLogin.value = !isLogin.value
}

//入室が成功した時の処理まとめ
const enterVerified = (username) => {
  // ユーザー名が入力されていれば入室メッセージを送信
  socket.emit(username)
  // 全体で使用するnameに入力されたユーザー名を格納
  userName.value = username;
  //チャット画面へ遷移
  router.push({ name: "roomSelect" })
  // 入室メッセージを送信
  socket.emit("enterEvent", userName.value + "さんが入室しました")
}

//「新規登録」か「ログイン」が押された時（左のボタン）
const onSubmit = () => {
  const inUserName = inputUserName.value.trim()
  const inPassword = inputPassword.value.trim()
  const inUserData = {
    userName: inUserName,
    password: inPassword,
  }

  if (inUserName && inPassword)//空の入力でなければ
   {
    if (isLogin.value) //ログインの場合
    {
      socket.emit("checkLogin", inUserData)
      socket.on('authenticationResult', (result) => {
        if (result) {
          //認証成功の処理
          enterVerified(inUserName);
        } else {
          // 認証失敗の処理
          alert('ユーザー名またはパスワードが異なります');
        }
      });
    } else // 新規登録の場合
    {
      socket.emit("addUser", inUserData)
      enterVerified(inUserName);
    }
  } else {
    alert('ユーザ名またはパスワードを入力してください')
  }
}



// // #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat サンプル</h1>
    <div class="mt-10">
      <p>ユーザー名</p>
      <input type="text" v-model="inputUserName" class="user-name-text" />
      <p>パスワード</p>
      <input type="password" v-model="inputPassword" class="user-password-text" />
    </div>
    <button type="button" @click="onSubmit" class="button-normal">{{ isLogin ? 'ログイン' : '新規登録' }}</button>
    <button type="button" @click="onToggleForm" class="button-toggle">{{ isLogin ? '新規登録' : 'ログイン' }}</button>
  </div>
</template>


<style scoped>
.user-name-text,
.user-password-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
}

.button-normal {
  margin-right: 10px;
}

.button-toggle {
  margin-top: 10px;
  background-color: lightgray;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
</style>

