<template>
  <div class='profile-details'>
    <!-- <router-link to="/subscribe">Subscribe</router-link> -->
    <br />
    <router-link to="/edit-profile">Edit Profile</router-link>
    <br />
    {{this.me.name}}
    <br />
    {{this.me.bio}}
    <br />
    <!-- <img class="profile-img" src="https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_80%2Cw_300/MTIwNjA4NjMzODIyNjc2NDky/bill-gates-9307520-1-402.jpg"  /> -->

    <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem">
    </feed-item>
  </div>

</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import FeedItem from '@/components/FeedItem.vue'

export default {
  name: 'profile-view',
  components: {
    FeedItem
  },
  data () {
    return {
    }
  },

  beforeMount () {
    this.fetchMyProfileData()
      .then(() => {
        return this.fetchProfileFeed({ userId: this.me._id })
          .then((feedItems) => {
            console.log(feedItems)
            this.loading = false
          })
      })
      .catch((error) => {
        console.log('error', error)
        alert('There was an error fetching your feed')
      })
  },

  methods: {
    ...mapActions(['fetchMyProfileData', 'fetchProfileFeed']),
    image (image) {
      console.log(image)
      return image !== undefined ? image : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'
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
<style scoped lang="stylus">
.profile-details
  padding-top 5px

.profile-img
  width 100px
</style>
