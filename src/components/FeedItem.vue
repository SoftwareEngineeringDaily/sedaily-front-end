<template>
  <div class="feed-item">
      <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="feedItem.upvoted"
        :score="feedItem.score">
      </voting-arrows>
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
      console.log('upvoteHandler')
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
