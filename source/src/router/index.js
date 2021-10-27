import Vue from 'vue'
import VueRouter from 'vue-router'
import Startup from '../views/Startup.vue'
import Desktop from '../views/Desktop.vue'
import store from '../store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Startup',
    component: Startup
  },
  {
    path: '/desktop',
    name: 'Desktop',
    component: Desktop
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {

  // console.log(store.state.client.isCheck);
  if (to.name !== 'Startup' && !store.state.client.isCheck) next({ name: 'Startup' })
  else next()
})
export default router
