<script setup>
import { ref }       from 'vue';
import { provide }   from 'vue';
import { useRouter } from 'vue-router';

const router   = useRouter();
const userName = ref('');

//  DIコンテナに userName を格納
provide('userName', userName);

const enterRoom = () => 
{
//  ユーザー名が未入力の場合、エラーダイアログを表示
  if (userName.value === "") 
  {
    alert("ユーザー名を入力してください");
  } 
//  チャットルームに遷移
  else
  {
    router.push("/chatroom")
  }
}
</script>

<template>
  <h1>Vue.js Chat サンプル</h1>
  <div>ユーザー名</div>
  <form name="f1">
    <!-- v-model : 変数userNameに、入力されたユーザー名を代入 -->
    <input type="text" v-model="userName">
    <div>
      <button type="button" @click="enterRoom">入室</button>
    </div>
  </form>
</template>