<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <div class="news-view">
    <div v-if="showFilteringElements">
      <v-text-field 
        label="Search..."
        class="search-box"
        prepend-icon="search"
        v-model="searchTerm"
        debounce="900" />
    </div>
    <div v-else>
      <br />
      <br />
    </div>

    <v-tabs v-if="showFilteringElements">
      <v-tabs-bar>
        <v-tabs-item v-for="category in categories" 
          @click.prevent="setSelectedCategory(category)"
          :key="category.id">{{category.name}}</v-tabs-item>
      </v-tabs-bar>
    </v-tabs>

    <instructions :displayedPosts="displayedPosts" />

    <transition :name="transition">
      <div fluid grid-list-xs v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm6
              v-for="post in displayedPosts" 
              :key="post._id">
              <post-summary             
                :post="post"  
                @play-podcast="playPodcast" />
            </v-flex>
          </v-layout>

          <div >        
            <div class="spinner-holder">
              <spinner :show="loading" />
            </div>
          </div>
        </v-container>  
      </div>
          
    </transition>
  </div>
</v-flex>
</template>

<script>

import moment from 'moment'
import Spinner from '@/components/Spinner.vue'
import PostSummary from '@/components/PostSummary.vue'
import Blank from '@/components/Blank.vue'
import { mapActions } from 'vuex'

export default {
  name: 'top-list',

  components: {
    instructions: Blank,
    Spinner,
    PostSummary
  },

  data () {
    return {
      playingPost: {title: 'starting title'},
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
      activeCategory: {name: 'All', id: null},
      searchTerm: null
    }
  },

  created: function () {
    this.setActiveType({type: this.type})
  },

  watch: {
    searchTerm () {
      this.makeSearch()
    }
  },

  methods: {
    ...mapActions(['setActiveType']),
    setSelectedCategory (category) {
      this.activeCategory = category
      this.resetPosts()
    },
    getClassForCategory (categoryName) {
      return categoryName === this.activeCategory.name ? 'category-active' : ''
    },
    makeSearch () {
      if (this.searchTerm === ' ') {
        this.searchTerm = null
      }
      this.resetPosts()
    },
    loadMore () {
      if (this.endOfPosts) {
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
      if (this.displayedPosts.length > 0) {
        let lastPost = this.displayedPosts[this.displayedPosts.length - 1]
        params.createdAtBefore = moment(lastPost.date).toISOString()
      }
      this.$store.dispatch(this.endPoint, params)
        .then((result) => {
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
      this.loadMore()
    },
    playPodcast (post) {
      this.playingPost = post
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-box
  max-width 400px
  float right
</style>

