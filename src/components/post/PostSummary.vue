<template>
  <div class="news-post">
    <div class="post-summary">
        <div class="title">
          <template v-if="post.url">
            <a
              :href="post.url"
              target="_blank">{{ post.title.rendered | decodeString }}</a>
            <span class="host"> ({{ post.url | host }})</span>
          </template>
          <template v-else>
            <router-link :to="postPrettyUrl">{{ post.title.rendered | decodeString }}</router-link>
          </template>
        </div>
      <div class="post-info">
        <div  v-if='!post.guestImage'><img class="profile-pic" src="../../assets/sedaily-logo.png"/></div>
        <div class="profile-pic" alt="" v-else :style='guestImage'></div>
        <p class="time">{{ date }}</p>
      </div>
      <div class="description">
        <span v-if="post.excerpt.rendered !== '' && metaDescription === ''" v-html="post.excerpt.rendered"></span>
        <p v-else>{{metaDescription}}</p>
        <div class="description__image">
          <img :src="imageStyle" :alt="imageStyle">
        </div>
      </div>
        <voting-arrows
          class="upvote-post"
          :upvoted="post.upvoted"
          :downvoted="post.downvoted"
          :upvote-handler="upvoteHandler"
          :downvote-handler="downvoteHandler"
          :score="post.score" />
    </div>

    <div class="comment-section">
      <comment-compose
        class="comment"
        :entityId="forumThreadId"
        :rootEntityType='"forumthread"' />
    </div>
    <div
    v-if="comments.length > 0"
    class='seeMoreBtn'
    @click='commentsViewToggle(forumThreadId)'>
      <p v-if='this.commentsView !== forumThreadId'>See all comments ({{commentsStoreList}})</p>
      <p v-else-if='this.commentsView === forumThreadId'>Hide comments ({{commentsStoreList}})</p>
    </div>
    <comments-list
      class="comments-list"
      :id="forumThreadId"
      v-if='this.commentsView === forumThreadId'
      :comments='comments'
      :rootEntityType='"forumthread"'
      :loading="isLoadingComments"
    />
  </div>
</template>

<script>
import moment from 'moment'
import CommentCompose from '@/components/comment/CommentCompose'
import CommentsList from '@/components/comment/CommentsList'
import VotingArrows from '@/components/VotingArrows'
import { postPrettyUrl } from '@/utils/post.utils'
import { PlayerState } from '@/utils/playerState'
import { parseIdsIntoComments } from '@/utils/comment.utils'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'PostSummary',
  props: {
    hideVoting: {
      type: Boolean,
      deault: false
    },
    post: {
      type: Object,
      required: true
    }
  },
   data () {
    return {
      isLoadingComments: false,
      showComments: false
    }
  },
  components: { VotingArrows, CommentCompose, CommentsList },
  computed: {
    ...mapState(['activePlayerPost', 'playerState', 'commentsView', 'entityComments']),
    ...mapGetters(['isLoggedIn']),
    forumThreadId () {
      if (!(this.post && this.post.thread)) return false

      if (typeof this.post.thread === 'object' && this.post.thread !== null) {
        return this.post.thread._id
      } else  {
        return this.post.thread
      }
    },

    guestImage () {
      return `background: url('${this.post.guestImage}') center center / cover no-repeat`
    },

    commentsStoreList(id) {
      const storePosts = this.entityComments
      let commentsCountValue = null
      for (let key in storePosts) {
        if (key === id.post.thread._id || key === id.post.thread) {
          commentsCountValue = storePosts[key].length
        }
      }
      return commentsCountValue
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
    },

    comments () {
      if (!(this.post && this.post.thread)) return []
      const parentCommentIds = this.entityComments[this.post.thread._id || this.post.thread] || []
      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
    },
    postPrettyUrl () {
      return postPrettyUrl(this.post)
    },

    featuredImage () {
      return this.post.featuredImage
        ? this.post.featuredImage
        : 'https://softwareengineeringdaily.com/wp-content/uploads/2015/08/sed_logo_updated.png'
    },

    date () {
      return moment(this.post.date).format('MMMM Do, YYYY')
    },

    // content () {
    //   const el = document.createElement('html');
    //   el.innerHTML = this.post.content.rendered;
    //   // console.log(el.getElementsByTagName('span'))

    //   return 1
    // },

    imageStyle () {
      return this.featuredImage
    },

    isActiveEpisode () {
      return this.activePlayerPost && this.activePlayerPost._id === this.post._id
    },

    canPause () {
      return this.isActiveEpisode && this.playerState === PlayerState.PLAYING
    },

    canPlay () {
      return !this.isActiveEpisode || this.playerState !== PlayerState.PLAYING
    },
    ...mapState({
      commentsMap (state) {
        return state.comments
      },
      entityComments (state) {
        return state.entityComments
      }
    })
  },

   beforeMount () {

      this.isLoadingComments = true
      // Fetch comments
      if(this.post.thread) {
        this.commentsFetch({
          entityId: this.post.thread._id || this.post.thread
        }).then(() => {
          this.isLoadingComments = false
        }).catch(() => {
          this.isLoadingComments = false
        })
      } else {
        this.isLoadingComments = false
      }
  },
  methods: {
    ...mapMutations(['commentsToggle']),
    ...mapActions(['playEpisode', 'updatePlayerState', 'commentsFetch']),
    play () {
      if (this.isActiveEpisode) {
        this.updatePlayerState(PlayerState.PLAYING)
      } else {
        this.playEpisode(this.post)
      }
    },
    pause () {
      if (this.isActiveEpisode) {
        this.updatePlayerState(PlayerState.PAUSED)
      }
    },
    commentsViewToggle(post) {
      if (this.commentsView === false ) {
        return this.commentsToggle({id: post})
      } else if (this.commentsView === post){
        return this.commentsToggle({id: false})
      } else {
        return this.commentsToggle({id: post})
      }
    },
      // this.commentsView === '' ? this.commentsToggle({id: idThread}) : this.commentsToggle({id: ''})
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
    },
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'

.news-post
  display flex
  flex-direction column
  align-items flex-start
  background-color #fff
  box-shadow: 0 3px 10px rgb(238, 238, 238), 0 3px 10px rgb(238, 238, 238);
  border-radius 2px
  margin 15px 16%
  max-width: 525px;

.post-summary
  padding: 25px 25px 0 25px
  display flex
  flex-direction column
  max-width: -webkit-fill-available;
  .voting-arrows
    flex 10%
  .image
    height 200px
    width 200px
    margin 7px
  .title
    a
      font-family: 'Open Sans', sans-serif;
      font-size 2em
      font-weight bold
      color black

.news-content
  margin-top 10px
  display flex
  flex-direction row
  justify-content center
  align-items center
  color #999
  background idle-background
  &:hover
    color white
    background primary-color

  .player
    flex 10%
    padding 10px
    .player-controls
      .player-control
        width 25px
        margin 0 10px
        cursor pointer
        &.text-only
          cursor default

      a
        color white
    a
      color idle-foreground
  .time
    flex 90%

.post-info
  margin 2% 0
  height 100%
  display flex
  align-items center
  align-self flex-start

  p
    font-family: 'Roboto', sans-serif;
    padding-left 1rem
    margin 0

.comment-section, .comment
  width 100%
  display flex
  align-items center
  justify-content space-between
  background-color rgba(219, 229, 236, 0.2)

.comment-section
  padding 10px 25px

.seeMoreBtn
  width 100%
  padding 15px
  display flex
  justify-content center
  align-items center
  &:hover
    cursor pointer
  p
    margin 0

.comment
  width 93%
  height inherit

.upvote-post
  padding-bottom 10px

.comments-list
  width 100%
  padding: 0px 20px
  background-color white

.profile-pic
  width 35px
  height 35px
  border-radius 50%
  background-color darken(grey, 10%)

.description
  margin 3% 0
  display flex
  justify-content space-between
  align-items: start;


  .description__image
    width 200px
    height 150px
    position relative
  p, span
    font-family: 'Roboto', sans-serif;
    width 50%
  span
    max-height: 130px;
    overflow: hidden;
  img
    max-height:100%;
    max-width:100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

@media (max-width 400px)
  .description
    flex-direction column
    p, span
      width 100%


@media (max-width 576px)
  .news-post
    width 100%

    .news-content
      margin-top 8%

@media (max-width 900px)
  .description
    flex-direction column
    p, span
      width 100%
  .description__image
      display: none
</style>
