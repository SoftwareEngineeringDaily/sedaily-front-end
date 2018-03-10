<template>
  <div class="news-view col-sm-12">
    <div
      v-if="showFilteringElements"
      class="search-bar">
      <input
        v-model="searchTerm"
        class="search-bar-input"
        type="text"
        placeholder="Search..."
        debounce="900">
    </div>
    <div v-else>
      <br>
      <br>
    </div>

    <category-list
      v-if="showFilteringElements"
      :categories="categories"
      :active-category="activeCategory"
      @setSelectedCategory="setSelectedCategory" />

    <instructions :displayed-posts="displayedPosts" />
    <transition :name="transition">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <post-summary
          v-for="post in displayedPosts"
          :key="post._id"
          :post="post"
          @play-podcast="playPodcast" />
        <div class="spinner-holder">
          <spinner :show="loading" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import Spinner from '~/components/Spinner.vue'
import PostSummary from '~/components/PostSummary.vue'
import CategoryList from '~/components/CategoryList.vue'
import Blank from '~/components/Blank.vue'

export default {
  components: {
    instructions: Blank,
    Spinner,
    CategoryList,
    PostSummary
  },
  data () {
    return {
      playingPost: { title: 'starting title' },
      type: 'new',
      showFilteringElements: true,
      endPoint: 'fetchListData',
      loading: false,
      endOfPosts: false,
      transition: 'slide-up',
      displayedPosts: [],
      categories: [
        {
          name: 'Business and Philosophy',
          id: '1068'
        },
        {
          name: 'Blockchain',
          id: '1082'
        },
        {
          name: 'Cloud Engineering',
          id: '1079'
        },
        {
          name: 'Data',
          id: '1081'
        },
        {
          name: 'JavaScript',
          id: '1084'
        },
        {
          name: 'Machine Learning',
          id: '1080'
        },
        {
          name: 'Open Source',
          id: '1078'
        },
        {
          name: 'Security',
          id: '1083'
        },
        {
          name: 'Hackers',
          id: '1085'
        },
        {
          name: 'Greatest Hits',
          id: '1069'
        }
      ],
      activeCategory: { name: 'All', id: null },
      searchTerm: null
    }
  },
  watch: {
    searchTerm () {
      this.makeSearch()
    }
  },
  fetch ({ store }) {
    store.commit('setActiveType', { type: this.type })
  },
  methods: {
    setSelectedCategory (category) {
      this.activeCategory = category
      this.resetPosts()
    },
    makeSearch () {
      if (this.searchTerm === ' ') {
        this.searchTerm = null
      }
      this.resetPosts()
    },
    loadMore (newSearch = false) {
      if (this.endOfPosts) {
        return
      }
      this.loading = true
      const params = {
        type: this.type,
        category: this.activeCategory.id,
        search: undefined,
        createdAtBefore: undefined
      }

      if (this.searchTerm) {
        params.search = this.searchTerm
      }
      if (this.displayedPosts.length > 0) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1]
        params.createdAtBefore = moment(lastPost.date).toISOString()
      }
      this.$store.dispatch(this.endPoint, params)
        .then((result) => {
          if (newSearch) {
            this.displayedPosts = []
          }

          if (result && result.posts && result.posts.length > 0) {
            this.displayedPosts = this.displayedPosts.concat(result.posts)
          } else {
            this.endOfPosts = true
          }
          this.loading = false
        })
        .catch(_ => {
        // TODO: log events
          this.endOfPosts = true
          this.loading = false
        })
    },
    resetPosts () {
      this.displayedPosts = []
      this.endOfPosts = false
      this.loading = false
      this.loadMore(true)
    },
    playPodcast (post) {
      console.log('inside play podacst')
      this.playingPost = post
      console.log(post)
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/variables'

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
.search-bar
  input
    width 100%
    margin 20px 0
    padding 10px
    font-size 2rem
    font-weight 100
    color #C4C4C4
    padding-left 20px
    border none
    border-bottom 1px solid #ccc

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

.active-tag
  padding .5em
  color #fff
  background-color #3F58AF

.remove-tag-button:hover
  cursor pointer

.spinner-holder
  width 100%
  text-align center
  margin 10px

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
  .add-tag-button:hover
    cursor pointer

@media (max-width 600px)
  .news-list
    margin 10px 0

</style>
