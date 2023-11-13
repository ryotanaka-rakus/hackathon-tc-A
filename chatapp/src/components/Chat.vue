<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'
import 'tailwindcss/tailwind.css'


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

const fetchChatList = () => {
  socket.emit("getRoomChatListEvent")
}
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const memoList = reactive([])
const bookmarkList = reactive([]) // ブックマーク一覧を格納するためのリアクティブな配列
const userList = reactive([]) // ユーザー一覧を格納するためのリアクティブな配列
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
  fetchUsers() // コンポーネントがマウントされたらユーザー一覧を取得する
  fetchUserBookmarks()
  fetchChatList()
})
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {

  //ユーザー名が入力されているかチェック
  const intext = chatContent.value.trim()

  if (intext) {
    const messageData = {
      // messageContent: chatContent.value.replace(/\n/g, '\n'),
      //messageContent: chatContent.value.replace(/\n/g, '\n'),
      messageContent: chatContent.value.replace(/\n/g, '<br>'),
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

// ブックマークをサーバーに保存する
const saveBookmark = (messageId) => {
  socket.emit("saveBookmarkEvent", { userId, messageId });
};

// サーバーからユーザーのブックマークを取得する
const fetchUserBookmarks = () => {
  socket.emit("getUserBookmarksEvent", userId);
};
// #endregion

// #region socket event handler
<<<<<<< Updated upstream
=======
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.unshift(data)
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.unshift(data)
}

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  console.log(data)
  console.log("aaaaaaa")
  chatList.unshift(data)
}

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    chatList.push(data)
=======
    console.log(data)
    chatList.unshift(data)
>>>>>>> Stashed changes
  })

  // メモイベントを受け取ったら実行
  socket.on("memoEvent", onReceiveMemo);

  // エラーイベントを受け取ったら実行
  socket.on("errorEvent", onReceiveError);

  // ユーザー一覧イベントを受け取ったら実行
  socket.on("usersListEvent", (users) => {
    userList.splice(0, userList.length, ...users) // 受け取ったユーザー一覧で更新
  })

<<<<<<< Updated upstream
  // ブックマーク保存イベントを受け取ったら実行
  socket.on("bookmarkSavedEvent", (bookmark) => {
    bookmarkList.push(bookmark);
  });

  // ユーザーブックマークイベントを受け取ったら実行
  socket.on("userBookmarksEvent", (bookmarks) => {
    bookmarkList.splice(0, bookmarkList.length, ...bookmarks); // 既存の配列を新しいブックマークで置き換え
  });


  // roomChatListイベントを受け取ったら実行
  socket.on("roomChatListEvent", (receivedCharList) => {
    chatList.splice(0, chatList.length, ...receivedCharList)
  });
=======

};
const formatTimestamp = (timestamp) => {
  timestamp = new Date();
  return timestamp.toLocaleString();
>>>>>>> Stashed changes
}

</script>

<template>
<<<<<<< Updated upstream
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <div class="flex">
    <div class="w-64 md:w-72 border-r-2 border-gray-500 p-2 flex flex-col h-auto">
      <div class="flex-grow">
        <div class="mt-3">
          オンライン
          <div>
            ・ff
          </div>
          <div>
            ・abcd
          </div>
        </div>
        <div class="mt-5">
          オフライン
          <div>
            ・ああああああ
          </div>
          <div>
            ・aaaaaaaa
          </div>
        </div>
      </div>
      <div class="">
        <router-link to="/" class="link">
          <button type="button" class="py-2 px-4 bg-gray-500 rounded text-white hover:bg-gray-700 shadow-md transition-all hover:shadow-lg hover:shadow-gray-500/25" @click="onExit">退室する</button>
        </router-link>
      </div>
    </div>

    <div class="flex-1 p-3">
      <div class="my-5 ">
        <div class="flex justify-center">
          <div>
            <div class="mt-5" v-if="chatList.length !== 0">
              <h4>ChatList</h4>
              <div id="commentSection" class="max-w-10/12 max-h-80 overflow-y-auto border p-3">
                <ul>
                  <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">{{ userList.filter((user) => user.id == chat.senderId)[0].name + "さん: " + chat.content }}
                    <!-- ブックマークボタン -->
                    <button @click="saveBookmark(chat.id)">ブックマーク</button>
                  </li>
                </ul>
               </div>
            </div>
            <div class="mt-5" v-if="memoList.length !== 0">
              <h4>MemoList</h4>
              <div id="commentSection" class="max-w-10/12 max-h-80 overflow-y-auto border p-3">
                <ul>
                  <li class="item mt-4" v-for="(memo, i) in memoList" :key="i">{{ memo.content }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-5 ml-5">
            <!-- ブックマーク一覧 -->
            <h4>ブックマーク一覧</h4>
            <div id="commentSection" class="max-w-10/12 overflow-y-auto border p-3" style="max-height: 684px;">
              <ul>
                <li v-for="bookmark in bookmarkList" :key="bookmark.id">
                  <div v-if="chatList.filter((chat) => chat.id == bookmark.messageId)[0]">{{ userList.filter((user) => user.id == bookmark.userId)[0].name + "さん: " + chatList.filter((chat) => chat.id == bookmark.messageId)[0].content }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-5">
          <textarea variant="outlined" placeholder="投稿文を入力してください" class="pr-0 border-2 border-solid border-gray-300 w-96" v-model="chatContent"></textarea>
          
            <!-- <textarea variant="outlined" placeholder="投稿文を入力してください" class="border-2 border-solid border-gray-400 pr-0 w-full" v-model="chatContent"></textarea> -->
          <div class="mt-2 ml-5">
            <button class="py-2 px-3 bg-gray-500 rounded text-white hover:bg-blue-500 shadow-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:border-blue-300" @click="onPublish">投稿</button>
            <button class="ml-5 py-2 px-3 bg-gray-500 rounded text-white hover:bg-blue-500 shadow-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:border-blue-300" @click="onMemo">メモ</button>
          </div>
        </div>
=======
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area" v-model="chatContent"
        ></textarea>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">
            <span v-html="userList.filter((user) => user.id == chat.senderId)[0].name + 'さん: ' + chat.content"></span>
            <span class="message-timestamp">{{ formatTimestamp(chat.timestamp) }}</span>
          </li>
        </ul>
>>>>>>> Stashed changes
      </div>
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

.message-timestamp {
  font-size: 0.8em;
  color: #777;
  margin-left: 10px;
}
</style>