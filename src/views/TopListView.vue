<template>
  <div class="news-view">
    <spinner :show="loading"></spinner>

    <div class='alert alert-info'>
      This page will display new items while we are waiting for users to start voting.
      Come back soon for top podcasts!
    </div>

    <div class="news-list-nav">
      <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
      <a v-else class="disabled">&lt; prev</a>
      <span>{{ page }}/{{ maxPage }}</span>
      <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
      <a v-else class="disabled">more &gt;</a>
    </div>

    <transition :name="transition">
      <div class="news-list" :key="displayedPage" v-if="displayedPage > 0">
        <transition-group tag="ul" name="item">
          <item v-for="item in displayedItems" :key="item.id" :item="item">
          </item>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import Item from '@/components/Item.vue'
import moment from 'moment'

export default {
  name: 'top-list',

  components: {
    Spinner,
    Item
  },

  data () {
    return {
      type: 'top',
      loading: false,
      transition: 'slide-up',
      maxPage: 1,
      displayedPage: Number(this.$store.state.route.params.page) || 1,
      displayedItems: []
    }
  },

  created: function () {
    this.$store.commit('setActiveType', {type: this.type})
    this.$store.dispatch('fetchListData', {
      type: this.type
    }).then((result) => {
      this.displayedItems = result.items.slice(0, this.$store.state.itemsPerPage)
      this.maxPage = result.maxPage
    })
  },

  computed: {
    page () {
      return Number(this.$store.state.route.params.page) || 1
    },
    hasMore () {
      return this.page < this.maxPage
    }
  },

  watch: {
    page (to, from) {
      this.loadItems(to, from)
    }
  },

  methods: {
    loadItems (to = this.page, from = -1) {
      this.loading = true
      let params = {
        type: this.type,
        page: this.page
      }

      if (to > from) {
        let lastItem = this.displayedItems[this.displayedItems.length - 1]
        params.createdAtBefore = moment(lastItem.date).toISOString()
      } else if (to < from) {
        let firstItem = this.displayedItems[0]
        params.createdAfter = moment(firstItem.date).toISOString()
      }

      this.$store.dispatch('fetchListData', params).then((result) => {
        if (this.page < 0 || this.page > this.maxPage) {
          this.$router.replace(`/${this.type}/1`)
          return
        }

        this.transition = from === -1
          ? null
          : to > from ? 'slide-left' : 'slide-right'
        this.displayedPage = to

        this.displayedItems = result.items // this.$store.getters.activeItems(to)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus">
.news-view
  padding-top 45px

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
</style>
