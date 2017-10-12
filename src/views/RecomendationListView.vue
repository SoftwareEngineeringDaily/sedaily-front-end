<script>
import BaseListView from './BaseListView.vue'
/*
    <div v-if='this.displayedItems.length === 0' class='alert alert-info'>
      We are building recommendations for you. Please ensure you are logged in and
      have voted on podcasts :D
    </div>
*/
export default {
  extends: BaseListView,

  data () {
    return {
      type: 'recommendation',
      endPoint: 'fetchRecommendations'
    }
  },

  methods: {
    loadMore () {
      // TODO: note that we have to override this method
      // because it seems like fetchRecommendations /
      // /posts/recommendations? does not resport createdAtBefore
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

      this.$store.dispatch(this.endPoint, params)
      .then((result) => {
        if (result && result.items && result.items.length > 0) {
          this.displayedItems = this.displayedItems.concat(result.items)
        }
        this.endOfItems = true
        this.loading = false
      })
      .catch(_ => {
        // TODO: log events
        this.endOfItems = true
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
