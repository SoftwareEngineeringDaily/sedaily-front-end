<template>
  <div class="feed-item">
      <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="feedItem.upvoted"
        :score="feedItem.score">
      </voting-arrows>
    <img class="feed-image" :src="imageSrc" />
    <div class="feed-item-title">
      <a :href="feedItem.url | externalUrl" target="_blank"
            rel="external nofollow" class="link">
         <span class='title'>{{feedItem.title || feedItem.url}}</span>
       </a>
    </div>
    <div class="feed-item-description simple-text">{{feedItem.description}}</div>
  </div>
</template>

<script>
import VotingArrows from '@/components/VotingArrows.vue'
import { mapActions } from 'vuex'

export default {
  name: 'FeedItem',
  components: {
    VotingArrows
  },
  props: {
    feedItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['upvoteRelatedLink']),
    upvoteHandler () {
      this.upvoteRelatedLink({
        id: this.feedItem._id,
        postId: this.feedItem.post._id
      }).then(({data}) => {
        const relatedLink = data.entity;
        this.feedItem.score = relatedLink.score;
        this.feedItem.upvoted = relatedLink.upvoted;
      })
    }
  },
  computed: {
    imageSrc () {
      const image = this.feedItem.image !== undefined
        ? this.feedItem.image
        : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'

      return image
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.feed-image
  max-width 80px

.feed-item
  margin 10px 30px
  border 1px solid very-light-grey


.feed-item-title a
    color #000
    font-weight 300
    font-size 1.0rem
    &:visited
      color #a9a9a9
  .feed-item-title a:hover
    text-decoration none
    color primary-color



.simple-text
  padding 10px


.votes
  padding-top 5px

</style>
