<template>
  <div class="container">
    <template v-if="loading">
      <spinner :show="loading"></spinner>
    </template>
    <template v-else-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </template>
    <template v-else>
      <profile-details
        :userData="me"
        :ownProfile="true"
      ></profile-details>
      <hr>
      <h4 v-if="feed.length > 0" class="row">
        Your Feed
      </h4>
      <div class="row">
        <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem">
        </feed-item>
      </div>
    </template>
  </div>
</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import FeedItem from '@/components/FeedItem.vue'
import ProfileDetails from '@/components/ProfileDetails.vue'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'profile-view',
  components: {
    FeedItem,
    ProfileDetails,
    Spinner
  },
  data () {
    return {
      loading: false,
      error: null
    }
  },

  methods: {
    ...mapActions(['fetchProfileFeed']),
    loadProfileFeed () {
      if (this.me && this.me._id) {
        this.loading = true
        return this
          .fetchProfileFeed({ userId: this.me._id })
          .then(() => {
            this.loading = false
            this.error = null
          })
      }
    }
  },

  watch: {
    me: {
      immediate: 'true',
      handler: 'loadProfileFeed'
    }
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      },
      feed (state) {
        return state.feed
      }
    })
  }
}
</script>
