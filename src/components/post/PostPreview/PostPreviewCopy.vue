<template>
  <div class="body" :class="{inverse:inverse,featured:featured}" >
    <post-topics-list :post="post" :inverse="inverse" v-if="showTags"/>

    <h3 class="title">
      {{ post.title.rendered | decodeString }}
    </h3>

    <div class="copy" v-if="showCopy">
      <span v-if="post.excerpt.rendered !== '' && metaDescription === ''" v-html="post.excerpt.rendered"></span>
      <p v-else>{{metaDescription}}</p>
    </div>
    <div class="author">
      <post-meta
        :post="post"
        :showDuration="false"
        :isPreview="isPreview" />
      <post-author :post="post" />
    </div>
    <!-- <div class="bottom-bar">
      <voting-arrows
        class="upvote-post"
        :inverse="inverse"
        :upvoted="post.upvoted"
        :downvoted="post.downvoted"
        :upvote-handler="upvoteHandler"
        :downvote-handler="downvoteHandler"
        :score="post.score" />
      <span v-if='showGuest'>
        <div v-if='!post.guestImage'><img class="profile-pic" src="../../../assets/sedaily-logo.png"/></div>
        <div class="profile-pic" alt="" v-else :style='guestImage'></div>
      </span>
    </div> -->
  </div>
</template>

<script>
import { PostMeta, PostTopicsList, PostTopics, PostTitle, PostAuthor } from '@/components/post'
import VotingArrows from '@/components/VotingArrows'
import { postPrettyUrl } from '@/utils/post.utils'

export default {
  components: {
    VotingArrows,
    PostMeta,
    PostTopicsList,
    PostTopics,
    PostTitle,
    PostAuthor
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    inverse: {
      type: Boolean
    },
    isPreview: {
      type: Boolean
    },
    featured: {
      type: Boolean
    },
    showTags: {
      type: Boolean
    },
    showGuest: {
      type: Boolean
    },
    showCopy: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    postPrettyUrl () {
      return postPrettyUrl(this.post)
    },
    guestImage () {
      if (this.featured){
        console.log(this.post)
      }
      return `background: url('${this.post.guestImage}') center center / cover no-repeat`
    },
    metaDescription () {
      const maxLength = 200;
      const el = document.createElement('template')
      el.innerHTML = this.post.content.rendered.trim()
      // spans contain text to extract "summary"
      let paras = el.content.querySelectorAll('span')
      if ( paras.length === 0){
        paras = el.content.querySelectorAll('p')
      }

      let description = '';
      for (let para of paras) {

        if(para.className !== 'powerpress_links powerpress_links_mp3'){
          description += para.innerText + ' ';
        }
        if (description.length >= maxLength) {
          break;
        }
      }
      if (description.length > maxLength) {
        return description.substr(0, maxLength-3) + '...'
      }
      return description;
    }
  },
  methods: {
     upvoteHandler () {
        // TODO: Fix this action, it will error if it's being called
        // and there is no episode stored for this id in the store, which
        // can happen if rendered from forum:
        this.$store.dispatch('upvote', {
          id: this.post._id
        })
      },
      downvoteHandler () {
        this.$store.dispatch('downvote', {
          id: this.post._id
        })
      }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../css/variables'

.body
  padding 2rem
  display flex
  flex-direction column
  text-decoration none !important
  color #222 !important
  &.featured
    justify-content center
  @media (max-width 599px)
    padding: 1.5rem;
  .title
    margin-bottom 1rem
    text-decoration none
    font-size 1.7rem
    font-weight 800
    color inherit
  .tags
    margin 0 0 10px

  &.inverse
    color #fff !important
    .tags
      span
        background-color #fff !important
        color #222 !important
    .title a
      color #fff
  .copy
    margin-bottom 1rem
    p
      margin-bottom .2rem
  .bottom-bar
    display flex
    justify-content space-between
    align-items center
    width 100%
    .upvote-post
      cursor pointer
    .profile-pic
      width 35px
      height 35px
      border-radius 50%
      background-color darken(grey, 10%)
</style>
