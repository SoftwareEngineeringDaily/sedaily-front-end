<template>
  <div class="feed-item">
    <v-card>
      <v-card-media :src="image(feedItem.image)" height="200px">
      </v-card-media>
      <div class='feed-item-holder'>
        <a :href="feedItem.url | externalUrl" target="_blank"
        rel="external nofollow">
         <span class='title'>
         {{feedItem.title || feedItem.url}}
         </span>
       </a>
        <div>{{feedItem.description}}</div>
        <p class='votes'>
        Votes: {{feedItem.score}}
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
export default {
  name: 'FeedItem',
  props: {
    feedItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    image (image) {
      console.log(image)
      return image !== undefined ? image : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'
    }
  }
}
</script>
<style >

.feed-item-holder {
  padding: 10px;
}

.feed-item-holder .title {
  font-size: 2rem;
  color: #856AFF;
}



.feed-item-holder .votes{
  padding-top: 20px;
  color: #706F6F;
}

.card__media__background {
  width: 100%;
  height: 100%;
}

</style>
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
