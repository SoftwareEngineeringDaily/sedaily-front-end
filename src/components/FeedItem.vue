<template>
  <div class='item-container card mb-2'>
    <div class="card-header">
      <span class="profile-avatar">
        <div>
          <img class="feed-image" :src="imageSrc" />
        </div>
      </span>

      <span class='item-title'>
        <a :href="feedItem.url | externalUrl" target="_blank">
          Related link: {{feedItem.title}}
        </a>
      </span>
    </div>

    <span class="content-holder card-body">
      <span class='votes-container'>
        <voting-arrows
          :upvoteHandler="upvoteHandler"
          :upvoted="feedItem.upvoted"
          :score="feedItem.score">
        </voting-arrows>
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
        <span class='misc-detail'>{{hostname}}</span>

      </div>
    </span>
</div>
</template>

<script>

import VotingArrows from '@/components/VotingArrows.vue'
import { mapActions } from 'vuex'
import { extractHostname } from '@/utils/link.utils'

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
    hostname () {
      try {
        return  extractHostname(this.feedItem.url)
      } catch (e) {
        console.log('error extracting host', e)
        return '--'
      }
    },
    imageSrc () {
      const placeholder = 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png';
      const image = this.feedItem.image !== undefined
        ? this.feedItem.image
        :  placeholder;
      if(image[0] === '/') {
        return placeholder;
      }
      return image
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.feed-image
  max-width 30px


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
  .card-header
    display flex
    align-items center

.item-misc
  font-size 0.8rem
  color darkgrey
  margin-top 3px
  margin-bottom 0.2rem

.item-misc a
  text-decoration none

.content-holder
  max-width 83%
  display flex
  align-items center

.card-body
  padding-top 0.25rem
  padding-bottom 0.25rem


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
  padding-right 20px

.votes-container
  padding-top 3px
.episode-info
  margin 8px 0

@media (min-width: 576px)
  .votes-container
    padding 0px 10px
    padding-left 8px
@media (max-width: 576px)
  .content-holder
    max-width 63%



</style>
