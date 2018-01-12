<script>
import BaseListView from '@/components/BaseListView.vue'
import RecommendationSnippet from '@/components/RecommendationSnippet.vue'

export default {
  extends: BaseListView,

  components: {
    instructions: RecommendationSnippet
  },
  data () {
    return {
      type: 'recommendation',
      showFilteringElements: false,
      endPoint: 'fetchRecommendations'
    }
  },

  methods: {
    loadMore () {
      // TODO: note that we have to override this method
      // because it seems like fetchRecommendations /
      // /posts/recommendations? does not resport createdAtBefore
      if (this.endOfPosts) {
        return
      }
      this.loading = true
      const params = {
        type: this.type,
        category: this.activeCategory.id
      }

      if (this.searchTerm) {
        params.search = this.searchTerm
      }

      this.$store.dispatch(this.endPoint, params)
        .then((result) => {
          if (result && result.posts && result.posts.length > 0) {
            this.displayedPosts = this.displayedPosts.concat(result.posts)
          }
          this.endOfPosts = true
          this.loading = false
        })
        .catch(_ => {
        // TODO: log events
          this.endOfPosts = true
          this.loading = false
        })
    }
  }
}
</script>
