<template>
  <div class="news-view">
    <div class='search-bar' v-if="showFilteringElements">
      <input type='text' placeholder='Search...' v-model='searchTerm' debounce="900"/>
    </div>
    <div v-else>
      <br />
      <br />
    </div>

    <div class='categories' v-if="showFilteringElements">
      <span class='category-item' @click="setSelectedCategory({name: 'All', id: null})" :class='getClassForCategory("All")'>All</span>
      <span v-for="category in categories" @click="setSelectedCategory(category)" class='category-item' :class='getClassForCategory(category.name)'> {{category.name}}</span>
    </div>

    <instructions :displayedItems="displayedItems"> </instructions>
    <transition :name="transition">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <item v-for="item in displayedItems" :key="item._id" :item="item"  v-on:play-podcast="playPodcast">
            </item>
          <div class="spinner-holder">
            <spinner :show="loading"></spinner>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import Spinner from '@/components/Spinner.vue'
import Item from '@/components/Item.vue'
import Blank from '@/components/Blank.vue'

export default {
  name: 'top-list',

  components: {
    instructions: Blank,
    Spinner,
    Item
  },

  data () {
    return {
      playingItem: {title: 'starting title'},
      type: 'new',
      showFilteringElements: true,
      endPoint: 'fetchListData',
      loading: false,
      endOfItems: false,
      transition: 'slide-up',
      displayedItems: [],
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
      activeCategory: {name: 'All', id: null},
      searchTerm: null
    }
  },

  created: function () {
    this.$store.commit('setActiveType', {type: this.type})
  },

  watch: {
    searchTerm () {
      this.makeSearch()
    }
  },

  methods: {
    setSelectedCategory (category) {
      this.activeCategory = category
      this.resetItems()
    },
    getClassForCategory (categoryName) {
      return categoryName === this.activeCategory.name ? 'category-active' : ''
    },
    makeSearch () {
      if (this.searchTerm === ' ') {
        this.searchTerm = null
      }
      this.resetItems()
    },
    loadMore () {
      if (this.endOfItems) {
        return
      }
      this.loading = true
      let params = {
        type: this.type,
        category: this.activeCategory.id
      }

      if (this.searchTerm) {
        params.search = this.searchTerm
      }
      if (this.displayedItems.length > 0) {
        let lastItem = this.displayedItems[this.displayedItems.length - 1]
        params.createdAtBefore = moment(lastItem.date).toISOString()
      }
      this.$store.dispatch(this.endPoint, params)
      .then((result) => {
        if (result && result.items && result.items.length > 0) {
          this.displayedItems = this.displayedItems.concat(result.items)
        } else {
          this.endOfItems = true
        }
        this.loading = false
      })
      .catch(_ => {
        // TODO: log events
        this.endOfItems = true
        this.loading = false
      })
    },
    resetItems () {
      this.displayedItems = []
      this.endOfItems = false
      this.loading = false
      this.loadMore()
    },
    playPodcast (item) {
      console.log('inside play podacst')
      this.playingItem = item
      console.log(item)
    }
  }
}
</script>

<style lang="stylus">


.categories
  padding-bottom 20px

.category-item
  margin 5px 20px
  display inline-block
  cursor pointer
  &:hover
    text-decoration underline

.category-active
  color orange

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

.item-move, .item-enter-active, .item-leave-active
  transition all .5s cubic-bezier(.55,0,.1,1)

.item-enter
  opacity 0
  transform translate(30px, 0)

.item-leave-active
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
/* Filters */
.filters
  position: relative
  margin-top: 1em
  input
    width: 100%
  button
    background-color: #f60
    color: #fff
    box-shadow: none
    border: none
    font-size: 14px
    height: 30px
    border-radius: 2px

.active-tags
  margin-top: 1em

.active-tag
  padding: .5em
  color: #fff
  background-color: #f60

.remove-tag-button:hover
  cursor: pointer;

.spinner-holder
  width 100%
  text-align center
  margin 10px

.auto-complete
  width: 200px;
  background: #fff;
  padding: 1em;
  position: absolute;
  top: 30px;
  z-index: 1000
  box-shadow: 6px 0px 10px #efefef
  .add-tag-button
    color: #f60
    font-size: 10px
  .add-tag-button:hover
    cursor: pointer;

@media (max-width 600px)
  .category-item
    width 100%
  .news-list
    margin 10px 0

</style>
