import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/recent',
    name: 'Recent',
    meta: {
      nav: true
    },
    component: () => import('@/views/recent/index.vue'),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/index.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    meta: {
      nav: true
    },
    component: () => import('@/views/contact/index.vue'),
  },
  {
    path: '/userSearch',
    name: 'UserSearch',
    component: () => import('@/views/contact/userSearch.vue'),
  },
  {
    path: '/group',
    name: 'Group',
    meta: {
      nav: true
    },
    component: () => import('@/views/group/index.vue'),
  },
  {
    path: '/groupSearch',
    name: 'GroupSearch',
    component: () => import('@/views/group/groupSearch.vue'),
  },
  {
    path: '/groupDetail',
    name: 'GroupDetail',
    component: () => import('@/views/group/groupDetail.vue'),
  },
  {
    path: '/mine',
    name: 'Mine',
    meta: {
      nav: true
    },
    component: () => import('@/views/mine/index.vue'),
  },
  {
    path: '/info',
    name: 'Info',
    component: () => import('@/views/mine/info.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
