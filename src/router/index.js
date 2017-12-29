import Vue from 'vue'
import Router from 'vue-router'
import {
  TopListView,
  NewListView,
  PostDetailsView,
  LoginView,
  SubscribeView,
  RegisterView,
  RecomendationListView,
  EditProfileView,
  FeedView,
  ProfileView,
  ForgotPassword,
  RegainAccount,
  PremiumChoices
} from '@/views'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'NewListView',
      component: NewListView
    },
    { path: '/regain-account/:secretKey/:resetUID', component: RegainAccount },
    { path: '/top/:page(\\d+)?', component: TopListView },
    { path: '/new/:page(\\d+)?', component: NewListView },
    { path: '/recommendations/:page(\\d+)?', component: RecomendationListView },
    { path: '/feed', component: FeedView },
    { path: '/post/:id([A-Za-z0-9-_]+)?', component: PostDetailsView },
    { path: '/subscribe', component: SubscribeView },
    { path: '/premium', component: PremiumChoices },
    { path: '/login', component: LoginView },
    { path: '/edit-profile', component: EditProfileView },
    { path: '/register', component: RegisterView },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/profile', component: ProfileView }
  ]
})
