<template>
  <div class="feed-item">
    <div class="feed-image" :style="imageStyle" />
    <div class="feed-item-title">
      <a :href="feedItem.url | externalUrl" target="_blank"
            rel="external nofollow" class="link">
         <span class='title'>{{feedItem.title || feedItem.url}}</span>
       </a>
    </div>
    <div class="feed-item-description simple-text">{{feedItem.description}}</div>
    <div class="feed-item-votes simple-text">Votes: {{feedItem.score}}</div>
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
  computed: {
    imageStyle () {
      const image = this.feedItem.image !== undefined
        ? this.feedItem.image
        : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'

      return `background: url('${image}') center center / cover no-repeat`
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.feed-image
  height 200px

.feed-item
  margin 10px 30px
  border 1px solid very-light-grey

.feed-item-title
  padding 10px
  font-size 2.1em
  .link
    color primary-color
.simple-text
  padding 10px


.votes
  padding-top 5px

</style>
