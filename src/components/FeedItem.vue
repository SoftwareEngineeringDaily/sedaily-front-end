<template>
  <div class='item-container row'>
    <span class="profile-avatar">
      <div class='feed-image' :style="imageStyle">
      </div>
    </span>

    <span class='votes-container'>
      <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="feedItem.upvoted"
        :score="feedItem.score">
      </voting-arrows>
    </span>

    <span class="content-holder">
      <span class='item-title'>
        <router-link :to="'/link/' + feedItem._id"> {{feedItem.title}} </router-link>
      </span>

      <div class='item-misc'>
        <div class='episode-info'>
          Episode: {{ feedItem.post.title.rendered | decodeString }}
        </div>
        Added by
        <span>
          <router-link :to="'/profile/' + feedItem.author._id">
            {{feedItem.author.name}}
          </router-link>
        </span>
        <div class="bullet-point">&#9679;</div>
        <span class='misc-detail'>{{lastAcitivityDate}}</span>

      </div>
    </span>
</div>
</template>

<script>
/*

<template>
  <div class="feed-item">
    <span class='votes-container'>
      <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="feedItem.upvoted"
        :score="feedItem.score">
      </voting-arrows>
    </div>
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

 */
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
     imageStyle () {
      const image = this.feedItem.image !== undefined
        ? this.feedItem.image
        : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'
      return `background: url('${image}') center center / cover no-repeat; background-size: 100% 100%;
`
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.feed-image
  width 30px


.item-container
  font-family inherit
  .item-title a
    color #000
    font-weight 300
    font-size 1.0rem
    &:visited
      color #a9a9a9
  .item-title a:hover
    text-decoration none
    color primary-color

.item-misc
  font-size 0.8rem
  color darkgrey
  margin-top 3px
  margin-bottom 1rem

.item-misc a
  text-decoration none

.content-holder
  max-width 83%
.misc-detail a
  color #a9a9a9
  &:hover
    color idle-foreground
.bullet-point
  display inline-flex
  font-size 0.65em
  min-height 20px
  margin-left 5px
  margin-right 5px
.profile-avatar
  padding-left 20px
  padding-top 12px

.votes-container
  padding-top 3px
.episode-info
  margin 8px 0

@media (min-width: 576px)
  .votes-container
    padding 0px 10px
    padding-left 15px
@media (max-width: 576px)
  .content-holder
    max-width 63%



</style>
