import Router from 'vue-router'

import TopListView from '@/views/TopListView'
import SearchView from '@/views/SearchView'
import HomeView from '@/views/HomeView'
import PostView from '@/views/post/PostView'
import { LoginView, SubscribeView, RegisterView , RegainAccount, SettingsView, ForgotPassword} from '@/views/account'
import RecomendationListView from '@/views/RecomendationListView'
import FeedView from '@/views/FeedView'
import { ProfileView, PublicProfileView, EditProfile }  from '@/views/profile'
import PremiumChoices from '@/views/PremiumChoices'
import AdminDashboard from '@/views/AdminDashboard'
import { CompanyCompose, CompanyLandingPage, UpdateCompanyProfile, CompanyEdit } from '@/views/company'
import { JobView, AddJobView, EditJobView, JobsBoardView } from '@/views/job'
import Contributors from '@/views/Contributors'
import { ForumView, ForumThreadView, NewForumThreadView, NewProjectForumThreadView, EditForumThreadView }  from '@/views/forum'

import { apiConfig } from '../../config/apiConfig'
import authorize from './authHook'

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'HomeView', component: HomeView },
    { path: '/topics/:topic', name: 'SearchView', component: SearchView },
    { path: '/topics/:topic/:search', name: 'SearchView', component: SearchView },
    { path: '/regain-account/:secretKey/:resetUID', component: RegainAccount },
    { path: '/top/:page(\\d+)?', component: TopListView },
    { path: '/new/:page(\\d+)?', name: 'SearchView', component: SearchView },
    { path: '/recommendations/:page(\\d+)?', component: RecomendationListView },
    { path: '/feed', component: FeedView },
    { path: '/post/:id([A-Za-z0-9-_]+)?/:postTitle([A-Za-z0-9-_]+)?', component: PostView },
    { path: '/subscribe', component: SubscribeView, props: { stripePublicKey: apiConfig.STRIPE_PUBLIC_KEY }},
    { path: '/premium', component: PremiumChoices },
    { path: '/login', component: LoginView },
    { path: '/edit-profile', beforeEnter: authorize, component: EditProfile },
    { path: '/register', component: RegisterView },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/settings', name: 'NotificationSettings', beforeEnter: authorize, component: SettingsView },
    { path: '/profile', component: ProfileView },
    { path: '/profile/:id([A-Za-z0-9-_]+)?', component: PublicProfileView },
    { path: '/jobs', component: JobsBoardView },
    { path: '/jobs/:id([A-Za-z0-9-_]+)?', component: JobView },
    { path: '/add-job', beforeEnter: authorize, component: AddJobView },
    { path: '/edit-job/:id([A-Za-z0-9-_]+)?', beforeEnter: authorize, component: EditJobView },
    { path: '/update-company/:id([A-Za-z0-9-_]+)?/:companyName([A-Za-z0-9-_]+)?', beforeEnter: authorize, component: UpdateCompanyProfile },
    { path: '/contributors', component: Contributors },
    { path: '/forum', component: ForumView },
    { path: '/new-thread', beforeEnter: authorize, name: 'NewThread', component: NewForumThreadView,  props: true },
    { path: '/new-project-thread', beforeEnter: authorize, name: 'NewProjectThread', component: NewProjectForumThreadView },
    { path: '/forum/edit-thread/:id([A-Za-z0-9-_]+)?', beforeEnter: authorize, component: EditForumThreadView },
    { path: '/forum/:id([A-Za-z0-9-_]+)?/', component: ForumThreadView },
    { path: '/admin', beforeEnter: authorize, component: AdminDashboard },
    { path: '/admin/add-company', beforeEnter: authorize, component: CompanyCompose },
    { path: '/admin/edit-company/:id', beforeEnter: authorize, component: CompanyEdit },
    { path: '/:company', component: CompanyLandingPage }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // Redirect all /# (hash) routes to non hash:
  try {
    if (to.fullPath && to.fullPath[1] === '#') {
      const withoutHash = to.fullPath.split('#')[1]
      router.push(withoutHash)
    } else {
      // Default, this will just go to the actual route
      next()
    }
  } catch (_) {
    // Catch all: go to default route
    next()
  }
})
export default router
