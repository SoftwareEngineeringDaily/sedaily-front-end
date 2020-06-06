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
        <ul>
          <li @click="fetchPosts" :class="getClassForTopic('')">All</li>
          <li
            class="topic-item"
            v-for="topic in showMostPopular"
            :key="topic._id"
            @click="topicHandler(topic)"
            :class="getClassForTopic(topic._id)"
          >{{ topic.name }}</li>
        </ul>
      </div>
    </div>
    <transition :name="transition">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="true"
        infinite-scroll-distance="10"
        class="post-scroll-container">
        <post-preview v-for="(post, i) in displayedPosts" :key="post._id" :post="post" :inverse="((i+1)%4==2||(i+1)%4==3)"></post-preview>
        <div class="spinner-holder">
          <spinner :show="loading"></spinner>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions, mapGetters } from 'vuex'

import Spinner from '@/components/Spinner'
import { PostSummary, PostPreview } from '@/components/post'
import CategoryList from '@/components/feed/FeedCategoryList'

export default {
  name: "top-list",

  components: {
    Spinner,
    CategoryList,
    PostSummary,
    PostPreview,
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
      let id = this.topicId;

      if (id === '') {
        return this.getPosts({ search: term })
          .then(data => {
            this.displayedPosts = data.posts
            this.$store.commit('setPosts', {posts: data.posts})
          });
      }

      this.getPosts({ topic: id, search: term })
        .then(data => {
          this.displayedPosts = data.posts
          this.$store.commit('setPosts', {posts: data.posts})
        });
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
        .dispatch('showTopic', topicSlug)
        .then(topics => {
          vm.routerTopic = true
          vm.displayedPosts = topics.data.posts;
          vm.$store.commit('setPosts', {
            posts: topics.data.posts
          })

          vm.topicId = topics.data.topic[0]._id
        })
    );
  },

  beforeRouteUpdate(to, from, next) {
    const topicSlug = to.params.topic;

    this.$store.dispatch('showTopic', topicSlug)
      .then(topics => {
        this.routerTopic = false
        this.endOfPosts = false
        this.displayedPosts = topics.data.posts;
        this.$store.commit('setPosts', {
          posts: topics.data.posts
        })
      });

    next();
  },

  methods: {
    ...mapActions([ "showTopic", "getTopicsInSearch" ]),
    getClassForTopic(topic_id) {
      return this.topicId === topic_id ? "topic-active" : "";
    },
    topicHandler(topic) {
      this.displayedPosts = [];
      this.loading = true;
      let topicId = topic._id,
        topicSlug = topic.slug;
      this.topicId = topicId;
      this.showTopic(topicSlug).then(
        topics => {
          this.loading = false;
          this.displayedPosts = topics.data.posts
          this.$store.commit('setPosts', {posts: topics.data.posts})
          }
      );
      this.$router.push({ path: `/topics/${topicSlug}` });
    },
    fetchPosts() {
      this.topicId = "";
      this.getTopicsInSearch({}).then(
        data => {
          this.displayedPosts = data.posts
          this.$store.commit('setPosts', {posts: data.posts})
        }
      );
      this.resetPosts();
    },
    loadMore(newSearch = false) {
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
      const params = {
        topic: this.topicId || undefined,
        search: undefined,
        createdAtBefore: undefined
      };
      if (this.$store.state.searchTerm) {
        params.search = this.$store.state.searchTerm;
      }
      if (this.displayedPosts.length > 0) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1];
        params.createdAtBefore = moment(lastPost.date).toISOString();
      }
      this.$store
        .dispatch("getTopicsInSearch", params)
        .then(result => {
          if (newSearch) {
            this.displayedPosts = [];
          }
          if (result && result.posts && result.posts.length > 0 && this.routerTopic === false) {
            this.displayedPosts = this.displayedPosts.concat(result.posts);
          } else {
            this.endOfPosts = true;
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

//.grid-view
//  display grid
//  grid-template-columns auto
//  grid-auto-rows 1fr
//  grid-column-gap 30px
//  grid-row-gap 24px
//  padding-bottom 150px
//
//  @media (min-width: 900px)
//    grid-template-columns repeat(2, 1fr)
//    grid-column-gap 30px
//    grid-row-gap 24px

.post-scroll-container {
  flex: 1;
}

.news-view {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}

// TOPIC
.topics-container {
  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 10px 0;
      color: #808080;
      cursor: pointer;

      &:hover {
        color: primary-color !important;
      }
    }
  }
}
@media (max-width: 750px) {
  .topics-container {
    ul {
      li {
        margin-right: 10px;
      }
    }
  }
  .spinner-holder {
    margin: auto;
  }
}

.topic-active {
  color: #856aff !important;
  font-weight: 600;
}

.categories-container {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
}

.spinner-holder {
  width: 85%;
  text-align: center;
}

@media (max-width: 750px) {
  .spinner-holder {
    margin: auto;
  }
}
</style>
