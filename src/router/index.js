import Router from 'vue-router'
import TopListView from '@/views/TopListView'
import NewListView from '@/views/NewListView'
import PostDetailsView from '@/views/PostDetailsView'
import LoginView from '@/views/LoginView'
import SubscribeView from '@/views/SubscribeView.vue'
import RegisterView from '@/views/RegisterView'
import RecomendationListView from '@/views/RecomendationListView'
import EditProfile from '@/views/EditProfileView'
import FeedView from '@/views/FeedView'
import ProfileView from '@/views/ProfileView'
import PublicProfileView from '@/views/PublicProfileView'
import ForgotPassword from '@/views/ForgotPassword'
import RegainAccount from '@/views/RegainAccount'
import PremiumChoices from '@/views/PremiumChoices'
import JobsBoardView from '@/views/JobsBoardView'
import JobView from '@/views/JobView'
import AddJobView from '@/views/AddJobView'
import EditJobView from '@/views/EditJobView'
import { apiConfig } from '../../config/apiConfig'
import CompanyLandingPage from '@/views/CompanyLandingPage'
import UpdateCompanyProfile from '@/views/UpdateCompanyProfile'
import AdminDashboard from '@/views/AdminDashboard'
import CompanyCompose from '@/views/CompanyCompose'
import CompanyEdit from '@/views/CompanyEdit'
import Contributors from '@/views/Contributors'
import Forum from '@/views/Forum'
import ForumThreadView from '@/views/ForumThreadView'
import NewForumThreadView from '@/views/NewForumThreadView'

import authorize from './authHook'

const router = new Router({
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
    { path: '/post/:id([A-Za-z0-9-_]+)?/:postTitle([A-Za-z0-9-_]+)?', component: PostDetailsView },
    { path: '/subscribe', component: SubscribeView, props: { stripePublicKey: apiConfig.STRIPE_PUBLIC_KEY }},
    { path: '/premium', component: PremiumChoices },
    { path: '/login', component: LoginView },
    { path: '/edit-profile', beforeEnter: authorize, component: EditProfile },
    { path: '/register', component: RegisterView },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/profile', component: ProfileView },
    { path: '/profile/:id([A-Za-z0-9-_]+)?', component: PublicProfileView },
    { path: '/jobs', component: JobsBoardView },
    { path: '/jobs/:id([A-Za-z0-9-_]+)?', component: JobView },
    { path: '/add-job', beforeEnter: authorize, component: AddJobView },
    { path: '/edit-job/:id([A-Za-z0-9-_]+)?', beforeEnter: authorize, component: EditJobView },
    { path: '/update-company/:id([A-Za-z0-9-_]+)?/:companyName([A-Za-z0-9-_]+)?', beforeEnter: authorize, component: UpdateCompanyProfile },
    { path: '/contributors', component: Contributors },
    { path: '/forum', component: Forum },
    { path: '/new-thread', beforeEnter: authorize, component: NewForumThreadView },
    { path: '/forum/:id([A-Za-z0-9-_]+)?/', component: ForumThreadView },
    { path: '/admin', beforeEnter: authorize, component: AdminDashboard },
    { path: '/admin/add-company', beforeEnter: authorize, component: CompanyCompose },
    { path: '/admin/edit-company/:id', beforeEnter: authorize, component: CompanyEdit },
    { path: '/:company', component: CompanyLandingPage }
  ]
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
