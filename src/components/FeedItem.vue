<template>
  <div class="feed-item">
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
</template>

<script>
export default {
  name: 'FeedItem',
  props: ['feedItem'],

  methods: {
    image: function (image) {
      console.log(image)
      return image !== undefined ? image : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'
    }
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
