import Vue from 'vue'
import Router from 'vue-router'
import TopListView from '@/views/TopListView'
import NewListView from '@/views/NewListView'
import ItemView from '@/views/ItemView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TopListView',
      component: TopListView
    },
    { path: '/top/:page(\\d+)?', component: TopListView },
    { path: '/new/:page(\\d+)?', component: NewListView },
    { path: '/recommendations/:page(\\d+)?', component: NewListView },
    { path: '/item/:id(\\d+)?', component: ItemView }
  ]
})
