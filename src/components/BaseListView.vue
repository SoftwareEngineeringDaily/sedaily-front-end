<template>
  <div class="news-view">
      <div class="categories-container">
        <div v-if="isLoggedIn && showTopics !== null" class="topics-container">
        <h4>Topics</h4>
          <ul>
            <li class='topic-item' v-for="topic in showTopics" :key="topic._id" @click='topicHandler(topic)' :class='getClassForTopic(topic._id)'>
              {{ topic.name }}
            </li>
          </ul>
        </div>
        <div class="topics-container">
        <h4>Most Popular Topics</h4>
          <ul>
            <li class='topic-item'
              v-for="topic in showMostPopular"
              :key="topic._id"
              @click='topicHandler(topic._id)'
              :class='getClassForTopic(topic._id)'>
              {{ topic.name }}
            </li>
          </ul>
        </div>
        <div v-show="showTopics !== null &&
         this.$store.state.topics.user === null || this.$store.state.topics.user.length === 0">
          <first-topics-select />
        </div>
        <h4>Category</h4>
        <category-list
          :categories="categories"
          :active-category="activeCategory"
          @setSelectedCategory="setSelectedCategory"
          v-if="showFilteringElements"
        />
        <p>
          {{searchDataNew}}
        </p>
        <div class="app-download">
          <a
            href="https://itunes.apple.com/us/app/software-engineering-daily/id1253734426?mt=8"
            target="_blank"
          >
            <img src="@/assets/iosstore.png" class="icon">
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.koalatea.sedaily"
            target="_blank"
          >
            <img src="@/assets/androidstore.png" class="icon">
          </a>
        </div>
      </div>

    <instructions :displayedPosts="displayedPosts"></instructions>
    <transition :name="transition">
      <div
        class="post-summary__container"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <post-summary
          v-for="post in displayedPosts"
          :key="post._id"
          :post="post"
          v-on:play-podcast="playPodcast"
        ></post-summary>
        <div class="spinner-holder">
          <spinner :show="loading"></spinner>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import Spinner from "components/Spinner.vue";
import PostSummary from "components/PostSummary.vue";
import CategoryList from "components/CategoryList.vue";
import Blank from "components/Blank.vue";
import FirstTopicsSelect from 'components/FirstTopicsSelect.vue'
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  name: "top-list",

  components: {
    instructions: Blank,
    Spinner,
    CategoryList,
    PostSummary,
    FirstTopicsSelect
  },

  data() {
    return {
      playingPost: { title: "starting title" },
      type: "new",
      showFilteringElements: true,
      endPoint: "fetchListData",
      loading: false,
      endOfPosts: false,
      transition: "slide-up",
      displayedPosts: [],
      topicId: '',
      categories: [
        {
          name: "Business and Philosophy",
          id: "1068"
        },
        {
          name: "Blockchain",
          id: "1082"
        },
        {
          name: "Cloud Engineering",
          id: "1079"
        },
        {
          name: "Data",
          id: "1081"
        },
        {
          name: "JavaScript",
          id: "1084"
        },
        {
          name: "Machine Learning",
          id: "1080"
        },
        {
          name: "Open Source",
          id: "1078"
        },
        {
          name: "Security",
          id: "1083"
        },
        {
          name: "Hackers",
          id: "1085"
        },
        {
          name: "Greatest Hits",
          id: "1069"
        }
      ],
      searchTerm: null,
      activeCategory: { name: 'All', id: null },
    }
  },
  watch: {
     searchTerm() {
       this.resetPosts()
     }
  },
  computed: {
    ...mapState(["topics"]),
    searchDataNew() {
      this.setSearchData()
      return null
    },
    showTopics() {
      return this.topics.user
    },
    showMostPopular() {
      return this.topics.mostPopular
    },
    isLoggedIn() {
      if (this.$store.state.me._id === undefined) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.$store.commit('setActiveType', { type: this.type });
    this.$store.dispatch('mostPopular');
  },
  methods: {
    ...mapActions(['showTopic']),
    setSearchData() {
      this.searchTerm = this.$store.state.searchTerm
    },
    getClassForTopic (topic_id) {
      return (this.topicId === topic_id) ? 'topic-active' : ''
    },
    setSelectedCategory (category) {
      this.activeCategory = category
      this.resetPosts()
    },
    topicHandler(topic) {
      let topicId = topic._id,
          topicName = topic.name;
      this.showTopic(topicId).then(
        topics => this.displayedPosts = topics.data.posts
      )
      this.$router.push({ path: `/topics/${topicName}` })

    },
    loadMore (newSearch = false) {
      if (this.endOfPosts) {
        return;
      }
      this.loading = true;
      const params = {
        type: this.type,
        category: this.activeCategory.id,
        search: undefined,
        createdAtBefore: undefined
      }
      if (this.searchTerm) {
        params.search = this.searchTerm;
      }
      if (this.displayedPosts.length > 0) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1];
        params.createdAtBefore = moment(lastPost.date).toISOString();
      }
      this.$store
        .dispatch(this.endPoint, params)
        .then(result => {
          if (newSearch) {
            this.displayedPosts = [];
          }

          if (result && result.posts && result.posts.length > 0) {
            this.displayedPosts = this.displayedPosts.concat(result.posts);
          } else {
            this.endOfPosts = true;
          }
          this.loading = false;
        })
        .catch(_ => {
          // TODO: log events
          this.endOfPosts = true;
          this.loading = false;
        });
    },
    resetPosts() {
      this.displayedPosts = [];
      this.endOfPosts = false;
      this.loading = false;
      if (this.topicId !== '') {
        this.loadMore(false)
      }
      // this.loadMore(true);
    },
    playPodcast(post) {
      console.log("inside play podacst");
      this.playingPost = post;
      console.log(post);
    }
  }
};
</script>

<style lang="stylus">
@import './../css/variables'

.news-view
  padding-top 10px

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
  box-shadow 0 1px 2px rgba(0,0,0,.1)
  a
    margin 0 1em
  .disabled
    color #ccc

.news-list
  position absolute
  margin 30px 0
  width 100%
  transition all .5s cubic-bezier(.55,0,.1,1)
  ul
    list-style-type none
    padding 0
    margin 0

.slide-left-enter, .slide-right-leave-active
  opacity 0
  transform translate(30px, 0)

.slide-left-leave-active, .slide-right-enter
  opacity 0
  transform translate(-30px, 0)

.post-move, .post-enter-active, .post-leave-active
  transition all .5s cubic-bezier(.55,0,.1,1)

.post-enter
  opacity 0
  transform translate(30px, 0)

.post-leave-active
  position absolute
  opacity 0
  transform translate(30px, 0)

@media (max-width 600px)
  .news-list
    margin 10px 0
@import './../css/variables';

.news-view {
  padding-top: 10px;
  display: flex;
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

//TOPIC
.topics-container
  ul
    list-style none
    padding 0
    li
      padding 5px
      margin 4px
      color #808080
      cursor pointer
      &:hover
          color primary-color !important

.topic-active
  color primary-color !important

.categories-container
  padding-top 2rem
  display flex
  flex-direction column

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.post-summary__container
  width 50%
  padding 2rem
  margin-left 7rem

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
}

/* Filters */
.filters {
  position: relative;
  margin-top: 1em;

  input {
    width: 100%;
  }

  button {
    background-color: #3F58AF;
    color: #fff;
    box-shadow: none;
    border: none;
    font-size: 14px;
    height: 30px;
    border-radius: 2px;
  }
}

.active-tags {
  margin-top: 1em;
}

.app-download
  display flex
  flex-direction column

.active-tag {
  padding: 0.5em;
  color: #fff;
  background-color: #3F58AF;
}

.remove-tag-button:hover {
  cursor: pointer;
}

.spinner-holder {
  width: 100%;
  text-align: center;
  margin: 10px;
}

.auto-complete {
  width: 200px;
  background: #fff;
  padding: 1em;
  position: absolute;
  top: 30px;
  z-index: 1000;
  box-shadow: 6px 0px 10px #efefef;

  .add-tag-button {
    color: #3F58AF;
    font-size: 10px;
  }

  .add-tag-button:hover {
    cursor: pointer;
  }
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}
</style>
