<template>
  <div class="news-view">
    <div class='search-bar'>
      <input type='text' placeholder='Search...' v-model='searchTerm' debounce="900"/>
    </div>

    <transition :name="transition">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <item v-for="item in displayedItems" :key="item._id" :item="item">
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

export default {
  name: 'top-list',

  components: {
    Spinner,
    Item
  },

  data () {
    return {
      type: 'new',
      loading: false,
      endOfItems: false,
      transition: 'slide-up',
      displayedItems: [],
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
        type: this.type
      }

      if (this.searchTerm) {
        params.search = this.searchTerm
      }
      if (this.displayedItems.length > 0) {
        let lastItem = this.displayedItems[this.displayedItems.length - 1]
        params.createdAtBefore = moment(lastItem.date).toISOString()
      }
      this.$store.dispatch('fetchListData', params)
      .then((result) => {
        this.displayedItems = this.displayedItems.concat(result.items)
        if (result.items && result.items.length > 0) {
        } else {
          this.endOfItems = true
        }

        this.loading = false
      })
      .catch(_ => {
        // TODO: log events
        this.loading = false
      })
    },
    resetItems () {
      this.displayedItems = []
      this.endOfItems = false
      this.loading = false
      this.loadMore()
    }
  }
}
</script>

<style lang="stylus">
.news-view
  padding-top 10px

.news-list-nav, .news-list
  background-color #fff
  border-radius 2px

.news-list-nav
  padding 15px 30px
  position fixed
  text-align center
  top 55px
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
  .news-list
    margin 10px 0

</style>
