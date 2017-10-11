<template>
  <div class="news-view">

    <div class="news-list-nav">
      <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
      <a v-else class="disabled">&lt; prev</a>
      <span>{{ page }}/{{ maxPage }}</span>
      <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
      <a v-else class="disabled">more &gt;</a>
    </div>

    <div class='filters'>
      <div>
        <input type='text' v-model='newTag' placeholder='filters & tags'/>
      </div>

      <div class='active-tags'>
        <span v-for='(tag, index) in activeTags' class='active-tag'>
          {{tag.name}}
          <span class='remove-tag-button' @click='removeTag(index)'>x</span>
        </span>
      </div>

      <div class='auto-complete' v-if='suggestedTags.length > 0'>
        <div v-for='tag in suggestedTags'>{{tag.name}}
          <span class='add-tag-button' @click='addTag(tag)'>add</span>
        </div>
      </div>
    </div>

    <div>
      <input type='text' placeholder='Search...' v-model='searchTerm' />
      <button @click='makeSearch'>Search</button>
    </div>


    <transition :name="transition">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
          <transition-group tag="ul" name="item">
            <item v-for="item in displayedItems" :key="item._id" :item="item">
            </item>
          </transition-group>
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
      maxPage: 1,
      displayedPage: Number(this.$store.state.route.params.page) || 1,
      displayedItems: [],
      newTag: '',
      searchTerm: null,
      activeTags: [],
      tags: [
        {
          id: 1200,
          name: '.NET Rocks!'
        } /* ,
        {
          id: 1084,
          name: 'Javascript'
        },
        {
          id: 1080,
          name: 'Machine Learning'
        } */
      ]
    }
  },

  created: function () {
    this.$store.commit('setActiveType', {type: this.type})
  },
  computed: {
    page () {
      return Number(this.$store.state.route.params.page) || 1
    },
    hasMore () {
      return this.page < this.maxPage
    },
    tagIds () {
      let serverTags = this.activeTags.map((tag) => {
        return tag.id
      })
      return serverTags
    },
    suggestedTags () {
      let suggestedTags = []

      if (!this.newTag) return suggestedTags

      this.tags.forEach((tag) => {
        if (tag.name.toLowerCase().indexOf(this.newTag.toLowerCase()) !== -1) suggestedTags.push(tag)
      })

      return suggestedTags
    }
  },

  watch: {
    page (to, from) {
      // this.loadItems(to, from)
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
        type: this.type,
        tags: this.tagIds,
        searchTerm: this.search
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
        this.loading = false
      })
    },
    removeTag (index) {
      this.activeTags.splice(index, 1)
      this.resetItems()
    },
    addTag (tag) {
      this.activeTags.push(tag)
      this.newTag = ''
      this.resetItems()
    },
    resetItems () {
      this.displayedItems = []
      this.endOfItems = false
      this.loading = false
      this.loadMore()
    },
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
</style>
