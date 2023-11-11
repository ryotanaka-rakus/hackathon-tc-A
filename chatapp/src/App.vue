<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")
// #endregion

// #region global variable
provide("userName", userName)
// #endregion
</script>

<template>
  <header>
    <div class="border-b-2 border-gray-500 flex flex-row items-center justify-between">
      <h1 class="text-blue-700 font-bold text-3xl mb-2 max-w-xl">ChatApp</h1>
      <div class="max-w-xl"><p>ユーザー名：{{ userName }}</p></div>
    </div>
  </header>
  <router-view />
</template>

<style scoped>
</style>
