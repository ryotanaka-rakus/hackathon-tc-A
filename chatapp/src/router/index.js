import { createRouter, createWebHistory } from "vue-router"
import Chat from "../components/Chat.vue"
import Login from "../components/Login.vue"
import RoomSelect from "../components/RoomSelect.vue"

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
        } else {
          next({ name: "roomSelect" })
        }
      },
    }
  ],
})

export default router