<template>
  <transition :name="transition">
    <div v-if="noData" class="no-data">No posts found</div>
    <div class="posts-feed"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      >
        <post-preview 
          v-for="post in displayedPosts"
          :key="post._id"
          :displayedPosts="displayedPosts"
          :post="post" />
        <spinner :show="loading"></spinner>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import uniqBy from 'lodash/uniqBy'
import Spinner from '@/components/Spinner';
import PostPreview from '@/components/post/PostPreview'

export default {
  components: {
    Spinner,
    PostPreview
  },
  name: 'search',
  data () {
    return {
      loading: false,
      noData: false,
      endOfPosts: false,
      transition: "slide-up",
      displayedPosts: [],
    }
  },
  computed: {
    search() {
      if (!this.$route.query || !this.$route.query.query) return ''
      return this.$route.query.query
    },

  },
  mounted () {
    this.getPosts()
  },
  watch: {
    $route(to, from) {
      if (to.query && to.query.query) {
        this.getPosts()
      }
    },
  },
  methods: {
    ...mapActions(["fetchSearch"]),

    getPosts () {
      this.displayedPosts = []
      this.endOfPosts = false;
      this.loading = true
      this.fetchSearch({ query: this.search }).then(
        data => {
          this.noData = !(data.posts && data.posts.length)
          this.displayedPosts = data.posts
          this.$store.commit('setPosts', { posts: data.posts })
        }
      ).finally(() => {
        this.loading = false
      })
    },

    loadMore(newSearch = false) {
      if (this.endOfPosts) {
        return;
      }
      this.loading = true;
      const params = {
        query: this.search,
        page: this.$store.state.nextPage,
      }

      if (this.displayedPosts.length) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1];
        params.createdAtBefore = moment(lastPost.date).toISOString();
      }

      this.$store
        .dispatch('fetchSearch', params)
        .then(result => {
          if (newSearch) {
            this.displayedPosts = []
          }
          if (result && result.posts && result.posts.length) {
            this.displayedPosts = uniqBy(this.displayedPosts.concat(result.posts), '_id');
            this.endOfPosts = result.isEnd
          } else {
            this.endOfPosts = true
          }
        })
        .catch(_ => {
          this.endOfPosts = true
          this.$toasted.error('There was a problem loading posts', { duration : 0 })
        }).finally(() => {
          this.loading = false
        });
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-data
  flex 1
  font-size 22px
  text-align center
  padding 30px

.posts-feed
  flex 1

  .spinner
      margin 0 auto
      display block

</style>