<template>
  <div class='profile-details'>
    <router-link to="/subscribe">Sbuscribe</router-link>
    <br />
    <router-link to="/edit-profile">Edit Profile</router-link>
    </br>
    {{this.me.name}}
    </br>
    {{this.me.bio}}
    </br>
    <!-- <img class="profile-img" src="https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_80%2Cw_300/MTIwNjA4NjMzODIyNjc2NDky/bill-gates-9307520-1-402.jpg"  /> -->

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
  </div>

</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'

export default {
  name: 'profile-view',
  data () {
    return {
    }
  },

  beforeMount () {
    this.fetchMyProfileData().then(() => {
      this.fetchProfileFeed({userId: this.me._id})
        .then((feedItems) => {
          console.log(feedItems)
          this.loading = false
        })
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
<style scoped>
  .profile-details {
    padding-top: 5px;
  }
  .profile-img {
    width:  100px;
  }
</style>
