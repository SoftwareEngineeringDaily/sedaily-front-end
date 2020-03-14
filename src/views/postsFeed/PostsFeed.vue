<template>
  <transition :name="transition">
    <div class="posts-feed"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      >
        <post-preview v-for="post in displayedPosts" :key="post._id" :post="post" />
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
  name: 'posts-feed',
  data () {
    return {
      loading: false,
      endOfPosts: false,
      transition: "slide-up",
      displayedPosts: [],
      topicId: "",
      routerTopic: false
    }
  },
  computed: {
    ...mapState(["topics", "searchTerm"]),
    search() {
      return this.searchTerm;
    },
  },
  mounted () {
    if (this.$route.params.slug) return this.fetchTopicPosts()
    return this.fetchPosts()
  },
  watch: {
    searchTerm() {
      let term = this.$store.state.searchTerm;

      if (this.topicId === "") {
        this.fetchSearch({ query: term }).then(
          data => {
            this.displayedPosts = data.posts
            this.$store.commit('setPosts', {posts: data.posts})
          }
        );
      } else {
        let id = this.topicId;
        this.getTopicsInSearch({ topic: id, search: term }).then(
          data => {
            this.displayedPosts = data.posts
            this.$store.commit('setPosts', {posts: data.posts})
          }
        );
      }
    },
    $route(to, from) {
      if (to.name === 'PostsAll') return this.fetchPosts()
      if (to.name === 'Posts') return this.fetchTopicPosts()
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   const topicSlug = to.params.slug;
  //   if (topicSlug === undefined) {
  //     return next(vm => {
  //       if(vm.$store.state.searchTerm === null) {
  //         vm.routerTopic = false
  //         vm.fetchPosts()
  //       }
  //     });
  //   }
  //   next(vm =>
  //     vm.$store
  //       .dispatch("showTopic", topicSlug)
  //       .then(topics => {
  //         vm.routerTopic = true
  //         vm.displayedPosts = topics.data.posts;
  //         vm.$store.commit('setPosts', {posts: topics.data.posts})
  //         vm.topicId = topics.data.topic[0]._id
  //       })
  //   );
  // },
  // beforeRouteUpdate(to, from, next) {
  //   const topicSlug = to.params.topic;
  //   this.$store.dispatch("showTopic", topicSlug).then(topics => {
  //     this.routerTopic = false
  //     this.endOfPosts = false
  //     this.displayedPosts = topics.data.posts;
  //     this.$store.commit('setPosts', {posts: topics.data.posts})
  //   });
  //   next();
  // },
  methods: {
    ...mapActions(["showTopic", "getTopicsInSearch", "fetchSearch"]),
    fetchPosts() {
      this.topicId = ""
      this.loading = true
      this.getTopicsInSearch({}).then(
        data => {
          this.displayedPosts = data.posts
          this.$store.commit('setPosts', {posts: data.posts})
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
      if(this.routerTopic === true){
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
  .posts-feed
    flex: 1

    .spinner
        margin: 0 auto;
        display block

</style>