<template>
  <div class="news-view">
    <div class="categories-container">
      <div v-if="showUserTopics" class="topics-container">
        <h4>Favourite</h4>
        <ul>
          <li
            class="topic-item"
            v-for="topic in showTopics"
            :key="topic._id"
            @click="topicHandler(topic)"
            :class="getClassForTopic(topic._id)"
          >{{ topic.name }}</li>
        </ul>
      </div>
      <div class="topics-container">
        <h4>Most Popular</h4>
        <!-- <ul>
          <li @click="fetchPosts" :class="getClassForTopic('')">All</li>
          <li
            class="topic-item"
            v-for="topic in showMostPopular"
            :key="topic._id"
            @click="topicHandler(topic)"
            :class="getClassForTopic(topic._id)"
          >{{ topic.name }}</li>
        </ul> -->
        <router-link to="/">All</router-link>
        <router-link v-for="topic in showMostPopular" :key="topic._id" :to="getTopicRoute(topic)">
          {{ topic.name }}
        </router-link>
      </div>
      <app-download-buttons />
    </div>

    <!-- <instructions :displayedPosts="displayedPosts"></instructions> -->
    <transition :name="transition">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        class="post-scroll-container">

        <!-- <post-summary v-for="post in displayedPosts" :key="post._id" :post="post"></post-summary> -->
        <post-preview
          v-for="post in displayedPosts"
          :key="post._id"
          :displayedPosts="displayedPosts"
          :post="post" />

        <div class="spinner-holder">
          <spinner :show="loading"></spinner>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import uniqBy from 'lodash/uniqBy'
import PostPreview from '@/components/post/PostPreview'
import Spinner from '@/components/Spinner.vue'
import AppDownloadButtons from '@/components/AppDownloadButtons.vue'
// import PostSummary from '@/components/post/PostSummary.vue'
import CategoryList from '@/components/feed/FeedCategoryList.vue'
// import FirstTopicsSelect from '@/components/FirstTopicsSelect.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
// import Blank from '@/components/Blank.vue'

export default {
  name: "top-list",

  components: {
    // instructions: Blank,
    Spinner,
    CategoryList,
    PostPreview,
    AppDownloadButtons,
    // FirstTopicsSelect
  },

  data() {
    return {
      showFilteringElements: true,
      loading: false,
      endOfPosts: false,
      transition: "slide-up",
      displayedPosts: [],
      topicId: "",
      routerTopic: false
    };
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
    }
  },
  computed: {
    ...mapState(["topics", "searchTerm"]),
    search() {
      return this.searchTerm;
    },
    showTopics() {
      return this.topics.user;
    },
    showMostPopular() {
      return this.topics.mostPopular;
    },
    isLoggedIn() {
      if (this.$store.state.me._id === undefined) {
        return false;
      } else {
        return true;
      }
    },
    showUserTopics() {
      if ((Object.entries(this.$store.state.me).length !== 0 && this.$store.state.me.constructor === Object) && this.$store.state.topics.user !== null) {
        if (this.$store.state.topics.user.length !== 0) {
          return true
        }
      } else {
        return false
      }
    }
  },
  created() {
    this.$store.commit("setActiveType", { type: this.type });
    this.$store.dispatch("mostPopular");
  },
  beforeRouteEnter(to, from, next) {
    const topicSlug = to.params.topic;
    if (topicSlug === undefined) {
      return next(vm => {
        if(vm.$store.state.searchTerm === null) {
          vm.routerTopic = false
          vm.fetchPosts()
        }
      });
    }
    next(vm =>
      vm.$store
        .dispatch("showTopic", topicSlug)
        .then(topics => {
          vm.routerTopic = true
          vm.displayedPosts = topics.data.posts;
          vm.$store.commit('setPosts', {posts: topics.data.posts})
          vm.topicId = topics.data.topic[0]._id
        })
    );
  },
  beforeRouteUpdate(to, from, next) {
    const topicSlug = to.params.topic;
    this.$store.dispatch("showTopic", topicSlug).then(topics => {
      this.routerTopic = false
      this.endOfPosts = false
      this.displayedPosts = topics.data.posts;
      this.$store.commit('setPosts', {posts: topics.data.posts})
    });
    next();
  },
  methods: {
    ...mapActions(["showTopic", "getTopicsInSearch", "fetchSearch"]),
    getClassForTopic(topic_id) {
      return this.topicId === topic_id ? "topic-active" : "";
    },
    setSelectedCategory(category) {
      this.activeCategory = category;
      this.resetPosts();
    },
    getTopicRoute(topic) {
      return (topic.topicPage && topic.maintainer) ? `/topic/${topic.slug}` : `/posts/${topic.slug}`
    },
    // topicHandler(topic) {
    //   this.displayedPosts = [];
    //   this.loading = true;
    //   let topicId = topic._id,
    //     topicSlug = topic.slug;
    //   this.topicId = topicId;
    //   this.showTopic(topicSlug).then(
    //     topics => {
    //       this.loading = false;
    //       this.displayedPosts = topics.data.posts
    //       this.$store.commit('setPosts', {posts: topics.data.posts})
    //       }
    //   );
    //   this.$router.push({ path: `/topics/${topicSlug}` });
    // },
    fetchPosts() {
      this.topicId = "";
      this.$router.push({ path: `/` });
      this.getTopicsInSearch({}).then(
        data => {
          this.displayedPosts = data.posts
          this.$store.commit('setPosts', {posts: data.posts})
        }
      );
      this.resetPosts();
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
      if (this.displayedPosts.length > 0) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1];
        params.createdAtBefore = moment(lastPost.date).toISOString();
      }
      this.$store
        .dispatch(method, params)
        .then(result => {
          if (newSearch) {
            this.displayedPosts = [];
          }
          if (result && result.posts && result.posts.length > 0 && this.routerTopic === false) {
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
};
</script>

<style lang="stylus">
@import '../../css/variables';

.news-view 
  padding-top 10px
  display flex
  justify-content space-between

.news-list-nav, .news-list 
  background-color #fff
  border-radius 2px

.news-list-nav 
  padding 15px 30px
  position fixed
  text-align center
  left 0
  right 0
  z-index 998
  box-shadow 0 1px 2px rgba(0, 0, 0, 0.1)

  a 
    margin 0 1em

  .disabled 
    color #ccc
  
.news-list 
  position absolute
  margin 30px 0
  width 100%
  transition all 0.5s cubic-bezier(0.55, 0, 0.1, 1)

  ul 
    list-style-type none
    padding 0
    margin 0
  
// TOPIC
.topics-container 
  a 
    margin 10px 0
    color #808080
    text-decoration none
    display block

    &:hover 
      color primary-color !important

    // TODO for /posts
    &.router-link-exact-active
      color #856aff !important
      font-weight 600
    
@media (max-width 750px) 
  .topics-container 
    ul 
      li 
        margin-right 10px
      
  .spinner-holder 
    margin auto
  
.topic-active 
  color #856aff !important
  font-weight 600

.categories-container 
  padding-top 2rem
  display flex
  flex-direction column

.slide-left-enter, .slide-right-leave-active 
  opacity 0
  transform translate(30px, 0)

.slide-left-leave-active, .slide-right-enter 
  opacity 0
  transform translate(-30px, 0)

.post-scroll-container 
  flex 1

.post-summary__container 
  width 50%
  padding 2rem
  margin-left 7rem

.post-move, .post-enter-active, .post-leave-active 
  transition all 0.5s cubic-bezier(0.55, 0, 0.1, 1)

.post-enter 
  opacity 0
  transform translate(30px, 0)

.post-leave-active 
  position absolute
  opacity 0
  transform translate(30px, 0)

/* Filters */
.filters 
  position relative
  margin-top 1em

  input 
    width 100%
  
  button 
    background-color #3F58AF
    color #fff
    box-shadow none
    border none
    font-size 14px
    height 30px
    border-radius 2px
 
.active-tags 
  margin-top 1em

.app-download 
  display flex
  flex-direction column
  align-items center

.active-tag 
  padding 0.5em
  color #fff
  background-color #3F58AF

.remove-tag-buttonhover 
  cursor pointer

.spinner-holder 
  width 85%
  text-align center

.auto-complete 
  width 200px
  background #fff
  padding 1em
  position absolute
  top 30px
  z-index 1000
  box-shadow 6px 0px 10px #efefef

  .add-tag-button 
    color #3F58AF
    font-size 10px
  
  .add-tag-buttonhover 
    cursor pointer
  

@media (max-width 750px) 
  .news-view 
    flex-direction column
  
  .row 
    display flex
    flex-wrap wrap
    margin-right 0px
    margin-left 0px
  
  .news-post 
    width 100%
    margin 15px auto
  
  .app-download 
    display flex
    flex-direction row
    flex-wrap wrap
    justify-content center
  
</style>


<!-- .news-view {
  padding-top: 10px;
}

.news-list-nav, .news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list-nav {
  padding: 15px 30px;
  position: fixed;
  text-align: center;
  left: 0;
  right: 0;
  z-index: 998;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  a {
    margin: 0 1em;
  }

  .disabled {
    color: #ccc;
  }
}

.news-list {
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.post-move, .post-enter-active, .post-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.post-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.post-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
} -->
