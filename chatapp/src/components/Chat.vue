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
    chatList.push(data)
  })

  // メモイベントを受け取ったら実行
  socket.on("memoEvent", onReceiveMemo);

  // エラーイベントを受け取ったら実行
  socket.on("errorEvent", onReceiveError);

  // ユーザー一覧イベントを受け取ったら実行
  socket.on("usersListEvent", (users) => {
    userList.splice(0, userList.length, ...users) // 受け取ったユーザー一覧で更新
  })

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
}



// #endregion
</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <div class="flex">
    <div class="max-w-xs border-r-2 border-gray-500 p-2">
    aaaaaaaaaaaaaa
    <div>
      <router-link to="/" class="link">
          <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
        </router-link>
    </div>
    </div>
    <div class="flex-1 p-3">
      <div class=" my-5 px-4">
        <div class="mt-10">
          <div class="mt-5" v-if="chatList.length !== 0">
            <h4>ChatList</h4>
            <div id="commentSection" class="max-w-screen-md max-h-32 overflow-y-auto border p-3">
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
            <div id="commentSection" class="max-w-screen-md max-h-32 overflow-y-auto border p-3">
              <ul>
                <li class="item mt-4" v-for="(memo, i) in memoList" :key="i">{{ memo.content }}</li>
              </ul>
            </div>
          </div>
          <!-- ブックマーク一覧 -->
         <h4>ブックマーク一覧</h4>
          <div id="commentSection" class="max-w-screen-md max-h-32 overflow-y-auto border p-3">
            <ul>
              <li v-for="bookmark in bookmarkList" :key="bookmark.id">
                <div v-if="chatList.filter((chat) => chat.id == bookmark.messageId)[0]">{{ userList.filter((user) => user.id == bookmark.userId)[0].name + "さん: " + chatList.filter((chat) => chat.id == bookmark.messageId)[0].content }}
                </div>
              </li>
            </ul>
          </div>
          <div>
            <textarea variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area" v-model="chatContent"></textarea>
            <div class="flex ">
              <button class="button-normal" @click="onPublish">投稿</button>
              <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
            </div>
          </div>
        </div>
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
</style>