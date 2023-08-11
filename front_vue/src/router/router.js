import {createRouter, createWebHashHistory} from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import AddPost from '../views/AddPost.vue'
import Profile from '../views/Profile.vue'
import ShowSinglePost from '../views/ShowSinglePost.vue'
import insertJWTMiddleware from '../middleware/InsertJwtMiddleware'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/posts', component: Home, meta: { requiresAuth: true } },
  { path: '/addpost', component: AddPost, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/post', component: ShowSinglePost, meta: {requiresAuth: true} }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, 
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      insertJWTMiddleware(to, from, next);
    } else {
      next();
    }
  });

  export default router