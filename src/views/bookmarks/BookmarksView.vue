<template>
  <div class="bookmarks-view">
    <h3>
      Listen to your playlist, and all 1500+ of our episodes in the Software Daily apps
    </h3>

    <AppDownloadButtons class="centered-apps"/>

    <h2>Bookmarks</h2>
    <spinner :show="loading" />
    <router-link v-for="post in posts" :key="post._id" :to="getPostRoute(post)" class="bookmark">
      <div class="image-container">
        <img :src="post.featuredImage"/>
      </div>
      <div class="body">
        <h4>{{post.title.rendered}}</h4>
      </div>
    </router-link>  
  </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import Spinner from '@/components/Spinner'
import AppDownloadButtons from '@/components/AppDownloadButtons'

export default {
  name: 'profile-view',

  components: {
    Spinner,
    AppDownloadButtons
  },

  data () {
    return {
      loading: false,
      posts: []
    }
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    })
  },

  mounted () {
    this.loadBookmarks()
  },

  methods: {
    ...mapActions(['getBookmarks']),
    
    loadBookmarks () {
      if (!this.me || !this.me._id) return
      this.loading = true
      this.getBookmarks().then((data) => {
        this.posts = data;
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    getPostRoute (post) {
      return `/post/${post._id}/${post.slug}`
    }
  },
}
</script>
<style scoped lang="stylus">
  @import '../../css/variables'
  .bookmarks-view
    padding 0 15px

    .spinner
      margin 0 auto
      display block
  
    h2,h3
      text-align center
      font-weight 200
    
    h2
      margin-bottom 30px
    
    .centered-apps
      justify-content center
      margin 30px 0

    .bookmark
      width 60%
      margin 0 auto
      background-color #e9ecef
      margin-bottom 30px
      display block
      color #222

      .body
        padding 20px

      .image-container
        height 150px

        img
          width 100%
          height 100%
          object-fit cover
      
      h4
        font-weight 800
</style>
