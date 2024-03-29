<template>
  <transition :name="transition">
    <div class="posts-feed">
      <div class="posts-main">
        <div class="posts-header">
          <div class="posts-featured">
            <post-preview
              v-for="post in displayedFeaturedPosts"
              :key="post._id"
              :displayedPosts="displayedFeaturedPosts"
              :post="post" />
          </div>
        </div>

        <div class="posts-list"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
          <post-preview
            v-for="post in displayedPosts"
            layout="line"
            :key="post._id"
            :displayedPosts="displayedPosts"
            :post="post" />
          <spinner :show="loading"></spinner>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import uniqBy from 'lodash/uniqBy'
import Spinner from '@/components/Spinner';
import { TopicPopularList } from '@/components/topic'
import { PopularPosts, PostPreview } from '@/components/post'
import { SubHeadline } from '@/components/typography'

export default {
  name: 'posts-feed',

  components: {
    Spinner,
    PostPreview,
    PopularPosts,
    TopicPopularList,
    SubHeadline,
  },

  data () {
    return {
      loading: false,
      endOfPosts: false,
      transition: 'slide-up',
      displayedSamplePosts: [],
      displayedFeaturedPosts: [],
      displayedPosts: [],
      topicId: "",
      routerTopic: false
    }
  },

  computed: {
    ...mapState([
      'topics',
      'searchTerm'
    ]),

    search() {
      return this.searchTerm;
    },
  },

  mounted () {
    if (this.$route.params.slug) {
      return this.fetchTopicPosts()
    }

    return this.fetchPosts()
  },

  watch: {
    searchTerm() {
      let term = this.$store.state.searchTerm;

      if (this.topicId === "") {
        this.fetchSearch({ query: term }).then(
          data => {
            this.displayedPosts = data.posts
            this.$store.commit('setPosts', { posts: data.posts })
          }
        );
      } else {
        let id = this.topicId;
        this.getTopicsInSearch({ topic: id, search: term }).then(
          data => {
            this.displayedPosts = data.posts
            this.$store.commit('setPosts', { posts: data.posts })
          }
        );
      }
    },

    $route(to, from) {
      if (to.name === 'PostsAll') return this.fetchPosts()
      if (to.name === 'Posts') return this.fetchTopicPosts()
    }
  },
  methods: {
    ...mapActions([
      'showTopic',
      'getTopicsInSearch',
      'fetchSearch',
    ]),

    fetchPosts() {
      if (this.loading) {
        return
      }

      this.loading = true
      this.topicId = ''

      this.getTopicsInSearch({})
        .then(data => {
          this.displayedPosts = data.posts.slice(5)
          this.displayedSamplePosts = data.posts.slice(0, 2)
          this.displayedFeaturedPosts = data.posts.slice(2, 5)
          this.$store.commit('setPosts', {
            posts: data.posts,
          })
        }
      ).finally(() => {
        this.loading = false
      })

      this.resetPosts();
    },

    fetchTopicPosts() {
      this.loading = true
      this.$store.dispatch('showTopic', this.$route.params.slug).then((response) => {
        if (response.data) {
          this.displayedPosts = response.data.posts
          if (response.data.topic) this.topicId = response.data.topic[0]._id
        }
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    loadMore(newSearch = false) {
      let isSearch = !!(this.$store.state.searchTerm)
      let method = isSearch ? 'fetchSearch' : 'getTopicsInSearch'

      if (this.routerTopic === true) {
        if(this.topicId){
          this.routerTopic = false
          this.endOfPosts = false
        }
      }

      if (this.endOfPosts) {
        return;
      }

      this.loading = true;

      let params = {
        topic: this.topicId || undefined,
        search: undefined,
        createdAtBefore: undefined
      };

      if (isSearch) {
        params = {
          query: this.$store.state.searchTerm,
          page: this.$store.state.nextPage,
        }
      }

      if (this.displayedPosts.length) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1];
        params.createdAtBefore = moment(lastPost.date).toISOString();
      }

      this.$store
        .dispatch(method, params)
        .then(result => {
          if (newSearch) {
            this.displayedPosts = [];
          }
          if (result && result.posts && result.posts.length && this.routerTopic === false) {
            this.displayedPosts = uniqBy(this.displayedPosts.concat(result.posts), '_id');
          } else {
            this.endOfPosts = true;
          }
          if (isSearch) {
            this.endOfPosts = (params.page === result.nextPage)
          }
          this.loading = false;
        })
        .catch(_ => {
          this.endOfPosts = true;
          this.loading = false;
        });
    },

    resetPosts() {
      this.displayedPosts = [];
      this.endOfPosts = false;
      this.loading = false;
      this.loadMore(true);
    }
  }
}
</script>

<style lang="stylus" scoped>
.posts-main
  width 100%

.posts-feed
  padding-top 2rem

.posts-header
  padding-bottom 2rem

.posts-sample
  >>> .body
    padding-top 0

  >>> .tags,
  >>> .img-container
    display none

.posts-feed,
.posts-header
  display flex

.posts-sample
  flex-grow 1
  max-width 33%

.posts-featured
  flex-grow 2
  margin 0 1.5rem
  padding 0 1.5rem
  max-width: calc(100% - 3rem)

  >>> .news-post .body
    padding 1.5rem 0 3rem

.posts-list
  flex: 1
  width 100%
  padding-right 1.5rem

  .spinner
    margin 0 auto
    display block

  >>> .news-post .img-container
    border-width 0

@media (max-width 990px)
  .posts-featured
    margin-right 0
    padding-right 0
    border-right none

@media (max-width 767px)
  .posts-header
    flex-direction column-reverse

    .posts-sample
      max-width none

      >>> .body
        padding-top 1.5rem

      >>> .tags,
      >>> .img-container
        display block

    .posts-featured
      margin 0
      padding 0
      border-left none

      >>> .news-post .body
        padding 1.5rem 0

  .posts-feed
    padding-top 0

  .posts-list
    padding-right 0

    >>> .news-post .img-container
      border-width 2px

</style>
