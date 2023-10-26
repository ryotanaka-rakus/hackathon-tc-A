import { createRouter, createWebHistory } from "vue-router"
import Login                              from "../components/Login.vue"
import ChatRoom                           from "../components/ChatRoom.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Login,
    },
    {
      path: "/chatroom",
      component: ChatRoom,
    }
  ],
})

export default router