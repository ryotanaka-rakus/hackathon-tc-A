<script setup>
import { computed, provide, ref } from "vue"
import { useRouter } from "vue-router";

// #region reactive state
const userName = ref("")
// #endregion

// #region global variable
provide("userName", userName)
// #endregion

const router = useRouter();
const isUserName = computed(() => {
  return router.path !== "/";
});

const enterChat = () => {
  // '/chat' パスに遷移
  router.push({ name: 'chat' });
};
</script>

<template>
  <header>
    <div class="border-b-2 border-gray-500 flex flex-row items-center justify-between">
      <h1 class="text-blue-700 font-bold text-3xl mb-2" @click="enterChat">ChatPack</h1>
      <div class="max-w-3xl text-2xl"><p v-if="isUserName && $route.path !== '/'">ユーザー名：{{ userName }}</p></div>
    </div>
  </header>
  <router-view />
</template>
