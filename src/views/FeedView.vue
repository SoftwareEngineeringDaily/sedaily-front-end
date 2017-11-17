
<template>
  <div>
    <br />
        <h1>My Feed </h1>
        <br />
        <br />
        <div v-for="feedItem in feed">
          <a :href="feedItem.url | externalUrl" target="_blank"
          rel="external nofollow">
          <img class="feed-item-img":src="image(feedItem.image)"  />
           <span class='title'>
           {{feedItem.title || feedItem.url}}
           </span>
         </a>
         <br />
           <p class='votes'>
           Votes:{{feedItem.score}}
           </p>
          <hr />
        </div>
    <br />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'feed-view',
  data () {
    return {
      loading: true
    }
  },

  beforeMount () {
    this.fetchMyProfileData()
    .then(() => {
      this.fetchMyFeed({userId: this.me._id})
        .then((feedItems) => {
          console.log(feedItems)
          this.loading = false
        })
    })
  },
  methods: {
    ...mapActions([ 'fetchMyProfileData', 'fetchMyFeed' ]),
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

<style scoped>
.title {
  margin-left: 10px;
}
.votes {
  padding-top: 5px;
}
.feed-item-img {
  width:  100px;
}
</style>
