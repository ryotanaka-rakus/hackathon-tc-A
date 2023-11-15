import { createRouter, createWebHistory } from "vue-router"
import Chat from "../components/Chat.vue"
import Login from "../components/Login.vue"
import RoomSelect from "../components/RoomSelect.vue"
import ChatPost from "../components/ChatPost.vue"
import Memo from "../components/Memo.vue"
import BookMark from "../components/BookMark.vue"
import Pin from "../components/Pin.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/roomSelect/",
      name: "roomSelect",
      component: RoomSelect
    }, 
    {
      path: "/chat/",
      name: "chat",
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (from.name === "roomSelect") {
          next()
        } else if (from.name === "chatpost" && to.name !== "chat") {
          next({ name: "chat" })
        } else if (from.name === "chat" && to.name !== "roomSelect") {
          next({ name: "roomSelect" })
        } else {
          next()
        }
      },
    },
    {
      path: "/chatpost/",
      name: "chatpost",
      component: ChatPost
    },
    {
      path: "/memo/",
      name: "memo",
      component: Memo
    }, 
    {
      path: "/bookmark/",
      name: "bookmark",
      component: BookMark
    }, 
    {
      path: "/pin/",
      name: "pin",
      component: Pin
    }
  ],
})

export default router