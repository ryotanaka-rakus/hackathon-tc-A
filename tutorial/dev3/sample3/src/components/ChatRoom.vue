<script setup>
import { ref }       from "vue";
import { inject }    from "vue";
import { useRouter } from "vue-router";

const router   = useRouter();
const userName = inject('userName');
console.log(userName);
const content  = ref('');

//  投稿ボタンが押されたときの処理
const postContent = () => 
{
//  投稿文が未入力の場合、エラーダイアログを表示
  if (content.value === "") 
  {
    alert("投稿内容を入力してください");
  } 
//  投稿
  else
  {
    
  }
}

//  「メモ」ボタンが押されたときの処理
const postMemo = () => 
{
//  投稿文が未入力の場合、エラーダイアログを表示
  if (content.value === "") 
  {
    alert("メモ内容を入力してください");
  } 
//  メモ
  else
  {
    
  }
}

const sampleimg1 = () => {
  const img = document.getElementById("img1");
  img.src   = "https://avatars.githubusercontent.com/u/116938721?v=4"
}
</script>

<template>
  <h1>Vue.js Chat チャットルーム</h1>
  <div>
    <p>ログインユーザー:{{ userName }}さん</p>
  </div>
  <div>
    <form>
      <textarea class="custom-textarea" maxlength="5000" placeholder="投稿文を入力してください" v-model="content"></textarea>
      <div style="height: 20px"></div>
      <div>
        <button type="button" class="custom-button" @click="postContent">投稿</button>
        <button type="button" class="custom-button" @click="postMemo">メモ</button>
      </div>
    </form>
    <div style="height: 20px"></div>
    <img id="img1" src="">
    
  </div>

</template>

<style scoped>

.center {
  /* 水平方向の中央揃え */
  text-align: center;
}

  /* ボタンの外見設定 */
  .custom-button {
    margin-right: 20px;
    margin-left : 20px;
    background-color: rgb(0, 255, 238);
  }
  .custom-button-memo {
    margin-right: 20px;
    margin-left : 20px;
    background-color: rgb(94, 255, 0);
  }

  /* テキストエリアの外見設定 */
  .custom-textarea {
  width: 30%; /* テキストエリアの幅を100%に設定 */
  height: 200px; /* テキストエリアの高さを200pxに設定 */
  padding: 10px; /* テキストエリア内部の余白を設定 */
  font-size: 16px; /* テキストのフォントサイズを設定 */
  border: 1px solid #ccc; /* テキストエリアの境界線を設定 */
  border-radius: 5px; /* テキストエリアの角を丸くするために設定 */
  margin-bottom: 10px; /* テキストエリアの下側に余白を設定 */
  }

  /* プレースホルダーテキストのスタイル */
  .custom-textarea::placeholder {
    color: #999; /* プレースホルダーテキストの色を設定 */
  }

</style>