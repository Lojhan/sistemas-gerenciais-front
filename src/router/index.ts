import Vue from 'vue'
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from 'vue-router'
import store from '@/store/index'

Vue.use(VueRouter)

const commonGuard = (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  if(store.getters.authenticated) {
    next()
  } else {
    next({ path: 'login' }) 
  }
}

const admGuard = (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  if(store.getters.authenticated && store.getters.role === 'adm') {
    next()
  } else {
    next({ path: '' }) 
    }
}


const routes: Array<RouteConfig> = [  
  {
    path: '',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    beforeEnter: commonGuard
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/products-stocks',
    name: 'ProductsInStocks',
    component: () => import('../views/About.vue'),
    beforeEnter: commonGuard
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products.vue'),
    beforeEnter: commonGuard
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: () => import('../views/Storages.vue'),
    beforeEnter: commonGuard
  },
  {
    path: '/logs',
    name: 'Logs',
    component: () => import('../views/Logs.vue'),
    beforeEnter: admGuard
  },
  {
    path: '/market-logs',
    name: 'MarketLogs',
    component: () => import('../views/MarketLogs.vue'),
    beforeEnter: commonGuard
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: () => import('../views/CreateAccount.vue'),
    beforeEnter: admGuard
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
