import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Projects from '../views/Projects.vue'
import CreateProject from '../views/CreateProject.vue'
import Project from '../views/Project.vue'
import GeneratetData from '../views/GenerateData.vue'
import EditProject from '../views/EditProject.vue'
import Post from '../views/Post.vue'
import ContentAnalyser from '@/views/ContentAnalyser.vue'
import Posts from '@/views/Posts.vue'
import CreatePost from '@/views/CreatePost.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { path: '/', redirect: '/login' },
  { path: '/register', component: Register },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-project',
    component: CreateProject,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    component: Project,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/posts/:postId',
    component: Post,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:postId',
    component: Post,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/posts/:postId',
    component: Post,
    meta: { requiresAuth: true }
  },
  {
    path: '/generate-data/:id',
    component: GeneratetData,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-project/:id',
    component: EditProject,
    meta: { requiresAuth: true }
  },
  {
    path: '/content-analyser/:id?',
    component: ContentAnalyser,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts',
    component: Posts,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-post',
    component: CreatePost,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.token) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
