<script setup>
import { inject, ref, registerRuntimeCompiler, onMounted } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'
import 'tailwindcss/tailwind.css'


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
  //socket.emit("enterEvent", userName.value + "さんが入室しました")
  socket.emit("enterEvent", username)
}


const loginOrAdd=() =>{
  isLogin.value = !isLogin.value
  console.log(isLogin.value)
}
// const toggleLogin = () => {
//   isLogin.value = !isLogin.value;
// }

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
      socket.emit("checkNewName", inUserData)
      socket.on('authAddUser', (result) => {
        if (result) {
          //認証成功の処理
          enterVerified(inUserName);
        } else {
          // 認証失敗の処理
          alert('すでに同じユーザー名が登録されています。\n名前を変えて登録してください。');
        }
      });
      // enterVerified(inUserName);
    }
  } else {
    alert('ユーザ名またはパスワードを入力してください')
  }
}



// // #endregion
</script>

<template>
  <div class="flex justify-center mt-20">
    <h1 class="text-blue-700 font-bold text-7xl mt-20">ChatPack</h1>
  </div>
  <div class="mt-20 flex justify-center flex-col items-center">
    <div class="flex justify-center">
      <p class="mt-1 mr-10">ユーザー名</p>
      <input type="text" v-model="inputUserName" class="pr-10 border-2 border-solid border-gray-300" />
    </div>
    <div class="flex justify-center mt-10">
      <p class="mt-1 mr-10">パスワード</p>
      <input type="password" v-model="inputPassword" class="pr-10 border-2 border-solid border-gray-300" />
    </div>
  </div>
  <div class="mt-15 flex justify-center ml-0">
    <div class="button-container">
      <button class="mt-0.5" type="button" @click="loginOrAdd" :class="{ 'active': isLogin, 'inactive': !isLogin }">ログイン</button>
      <button class="ml-5 mt-0.5" type="button" @click="loginOrAdd" :class="{ 'active': !isLogin, 'inactive': isLogin }">新規登録</button>
    </div>
    <div>
      <button type="button" @click="onSubmit" class="ml-10 py-3 px-6 bg-blue-500 rounded text-white hover:bg-blue-700 shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/25">送信</button>
    </div>
  </div>
</template>

<style scoped>

.button-container {
  display: flex;
  justify-content: flex-start;
  gap: 8px; /* ボタン間の隙間を設定 */
  margin-bottom: 10px;
}

.button-container > button {
  padding: 10px 20px;
  border: 1px solid transparent;
  background-color: #ccc; /* デフォルトの背景色（灰色） */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.button-container > button.active {
  background-color: #007bff;
  color: white;
}

.button-container > button.inactive {
  background-color: #ccc; /* 非アクティブの背景色（灰色） */
  color: #000;
}
</style>