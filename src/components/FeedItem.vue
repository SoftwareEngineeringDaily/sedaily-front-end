<template>
  <div class="feed-item">
    <v-card>
      <v-card-media :src="image(feedItem.image)" height="200px">
      </v-card-media>
      <div>
        <a @click="userClickedLink" :href="feedItem.url | externalUrl" target="_blank"
        rel="external nofollow">
         <span class='title'>
         {{feedItem.title || feedItem.url}}
         </span>
       </a>
        <div>{{feedItem.description}}</div>
        <p class='votes'>
        Votes:{{feedItem.score}}
        </p>
      </div>
      <v-card-title primary-title>
      </v-card-title>
    </v-card>
    <br />
    <hr />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'FeedItem',
  props: ['feedItem'],
  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      }
    })
  },
  methods: {
    ...mapActions(['linkUserClicked']),
    image: function (image) {
      console.log(image)
      return image !== undefined ? image : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'
    },
    userClickedLink: function () {
      console.log('FEED ITEM ', this.feedItem)
      console.log('User ', this.me._id)
      this.linkUserClicked({
        linkId: this.feedItem._id,
        userId: this.me._id
      })
    }
  }

}
</script>
<style src="../../static/vuetify.min.css"></style>
<style scoped>
.feed-item {
  margin-left: 30px;
  margin-right: 30px;
}
.votes {
  padding-top: 5px;
}
.feed-item-img {
  width:  100px;
}
</style>
