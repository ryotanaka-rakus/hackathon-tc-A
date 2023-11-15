import { createRouter, createWebHistory } from "vue-router"
import Chat from "../components/Chat.vue"
import Login from "../components/Login.vue"
import RoomSelect from "../components/RoomSelect.vue"
import PostBook from "../components/PostBook.vue"
import PostPin from "../components/PostPin.vue"
import MemoBook from "../components/MemoBook.vue"
import MemoPin from "../components/MemoPin.vue"

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
        } else if (from.name === "chat" && to.name !== "roomSelect") {
          next({ name: "roomSelect" })
        } else {
          next()
        }
      },
    },
    {
      path: "/postbook/",
      name: "postbook",
      component: PostBook
    },
    {
      path: "/postpin/",
      name: "postpin",
      component: PostPin
    }, 
    {
      path: "/memobook/",
      name: "memobook",
      component: MemoBook
    }, 
    {
      path: "/memopin/",
      name: "memopin",
      component: MemoPin
    }
  ],
})

export default router