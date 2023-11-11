<script setup>
import { computed, onMounted, provide, ref } from "vue"
import { useRoute } from "vue-router";

// #region reactive state
const userName = ref("")
// #endregion

// #region global variable
provide("userName", userName)
// #endregion

const route = useRoute();
const isUserName = computed(() => {
  return route.path !== "/";
});


</script>

<template>
  <header>
    <div class="border-b-2 border-gray-500 flex flex-row items-center justify-between">
      <h1 class="text-blue-700 font-bold text-3xl mb-2 max-w-xl">ChatApp</h1>
      <div class="max-w-3xl text-2xl"><p v-if="isUserName">ユーザー名：{{ userName }}</p></div>
    </div>
  </header>
  <router-view />
</template>

<style scoped>
</style>
