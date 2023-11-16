<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'
import 'tailwindcss/tailwind.css'
import { useRouter } from "vue-router";


// #region global state
const userName = inject("userName")
// 仮のuserId, roomId。Login.vueから渡す必要がある。
const userId = 1
const roomId = 1
// #endregion

// #region local variable
const socket = socketManager.getInstance()
const router = useRouter();

// ユーザー一覧をサーバーから取得する
const fetchUsers = () => {
  socket.emit("getUsersEvent"); // サーバにユーザー一覧を要求する
}

const fetchChatList = () => {
  socket.emit("getRoomChatListEvent")
}

const fetchEditList = () => {
  socket.emit("getRoomEditListEvent")
}
// #endregion

// #region reactive variable
const chatContent = ref("")
const editContent = ref("") // 編集メッセージ
const editAreaFlag = ref(false) // 編集エリアを表示するか示す boolean 値
const chatList = reactive([])
const editList = reactive([]) // 編集履歴一覧
const memoList = reactive([])
const historyFlag = reactive([]) // 編集履歴が表示するか示す boolean 値
const bookmarkList = reactive([]) // ブックマーク一覧を格納するためのリアクティブな配列
const pinMessageList = reactive([]) // ブックマーク一覧を格納するためのリアクティブな配列
const userList = reactive([]) // ユーザー一覧を格納するためのリアクティブな配列
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
  fetchUsers() // コンポーネントがマウントされたらユーザー一覧を取得する
  fetchUserBookmarks()
  fetchPinnedMessages()
  fetchChatList()
  fetchEditList()
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

// 編集メッセージをサーバーに送信する処理
const onEdit = (messageId) => 
{
  // 編集メッセージが入力されている場合
  if (editContent.value.trim()) 
  {
    const editData = {
      messageId,
      editContent : editContent.value,
    }
    socket.emit("editEvent", editData);

    // 入力欄を初期化
    editContent.value = ""

    // 編集エリアを非表示にする
    showEditTextarea()
  }

  // 編集メッセージが入力されていない場合
  else 
  {
    alert("編集テキストを入力してください。")
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

const pinMessage = (messageId) => {
  socket.emit("pinMessageEvent", { roomId, messageId })
}

// サーバーからユーザーのブックマークを取得する
const fetchUserBookmarks = () => {
  socket.emit("getUserBookmarksEvent", userId);
};

const fetchPinnedMessages = () => {
  socket.emit("getPinnedMessagesEvent", roomId)
}

// 編集履歴を表示する or 編集履歴を非表示にする関数
const editHistoryVisibility = (messageId) => 
{
  console.log("editHistoryVisibility :", historyFlag[messageId])

  // 状態を反転させる (表示 → 非表示 or 非表示 → 表示)
  historyFlag[messageId] = !historyFlag[messageId];
};

// 編集エリアを表示 or 編集エリアを非表示にする関数
const showEditTextarea = () =>
{
  if (editAreaFlag.value == false)
  {
    editAreaFlag.value = true;
  }
  else
  {
    editAreaFlag.value = false;
  }
  console.log("editAreaFlag", editAreaFlag.value)
}
// #endregion

// #region socket event handler
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
    console.log(data)
    chatList.unshift(data)

  })

  // 編集イベントを受け取ったら実行
  socket.on("editEvent", (data_list) => 
  {
    // 既存のデータを探索
    const targetMessageId   = data_list.edit_message[0].messageId;
    const existingDataIndex = chatList.findIndex(data => data.id === targetMessageId);
    console.log("targetMessageId:", targetMessageId);
    console.log("existingDataIndex:", existingDataIndex);
      
    // chatList に既存のデータが見つかった場合
    if (existingDataIndex !== -1) 
    {
      // 編集前のメッセージを編集後のメッセージに変更
      chatList[existingDataIndex] = data_list.message;

      // 編集前のメッセージを編集履歴に追加
      const existingEditDataIndex = editList.findIndex(data => data[0] && data[0].messageId === targetMessageId);

      // 編集履歴が存在する場合
      if (existingEditDataIndex !== -1) 
      {
        editList[existingEditDataIndex] = data_list.edit_message
      }
      else
      {
        editList.unshift(data_list.edit_message)
      }
      
      // 最初は編集履歴を非表示にしておく
      historyFlag.unshift(false)
    } 
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

  // ピンメッセージ保存イベントを受け取ったら実行
  socket.on("messagePinnedEvent", (msg) => {
    pinMessageList.push(msg);
    console.log(pinMessageList)
  });

  // ユーザーブックマークイベントを受け取ったら実行
  socket.on("userBookmarksEvent", (bookmarks) => {
    bookmarkList.splice(0, bookmarkList.length, ...bookmarks); // 既存の配列を新しいブックマークで置き換え
  });

  // ユーザーブックマークイベントを受け取ったら実行
  socket.on("pinnedMessagesEvent", (msgs) => {
    pinMessageList.splice(0, msgs.length, ...msgs); // 既存の配列を新しいブックマークで置き換え
  });

  // roomChatListイベントを受け取ったら実行
  socket.on("roomChatListEvent", (receivedCharList) => {
    chatList.splice(0, chatList.length, ...receivedCharList)
  });

  // roomEditListイベントを受け取ったら実行
  socket.on("roomEditListEvent", (receivedEditList) => {
    editList.splice(0, chatList.length, ...receivedEditList)
  });
};

const formatTimestamp = (timestamp) => {
  timestamp = new Date(timestamp);
  return timestamp.toLocaleString();
}

const enterPostBook = () => {
  if (router) {
    router.push({ name: 'postbook' });
  }
}

const enterPostPin = () => {
  if (router) {
    router.push({ name: 'postpin' });
  }
}

const enterMemoBook = () => {
  if (router) {
    router.push({ name: 'memobook' });
  }
}

const enterMemoPin = () => {
  if (router) {
    router.push({ name: 'memopin' });
  }
}

</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <div class="mt-5" v-if="memoList.length !== 0">
    <h4>メモ</h4>
    <div id="commentSection" class="max-w-lg max-h-[524px] overflow-y-auto border p-3" ref="commentSectionRef">
      <ul>
        <li class="item mt-4" v-for="(memo, i) in memoList" :key="i">{{ memo.content }}</li>
      </ul>
    </div>
  </div>
</template>
