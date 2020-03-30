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
  name: 'popular',
  components: {
    Spinner,
    PostPreview
  },

  mounted () {
    this.getPosts()
  },

  data () {
    return {
      loading: false,
      noData: false,
      endOfPosts: false,
      transition: "slide-up",
      displayedPosts: [],
    }
  },

  methods: {
    ...mapActions([ 'getPostsList' ]),

    getPosts () {
      this.displayedPosts = []
      this.endOfPosts = false;
      this.loading = true
      const options = {
        type: 'popular',
      }
      this.getPostsList(options)
        .then(data => {
          this.noData = !(data.posts && data.posts.length)
          this.displayedPosts = data.posts
          this.$store.commit('setPosts', { posts: data.posts })
        }).finally(() => {
        this.loading = false
      })
    },

    loadMore() {
      if (this.endOfPosts) {
        return;
      }
      this.loading = true;
      const options = {
        type: 'popular'
      }

      if (this.displayedPosts.length) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1];
        options.createdAtBefore = moment(lastPost.date).toISOString();
      }
      
      this.getPostsList(options)
        .then(data => {
          if (data && data.posts && data.posts.length) {
            this.displayedPosts = uniqBy(this.displayedPosts.concat(data.posts), '_id');
          } else {
            this.endOfPosts = true
          }
        })
        .catch(e => {
          this.endOfPosts = true
          this.$toasted.error('There was a problem loading posts', { duration : 0 })
        })
        .finally(() => {
        this.loading = false
      })
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
