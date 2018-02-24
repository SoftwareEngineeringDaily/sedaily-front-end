<template>
  <div>
    <h1>Forum</h1>
    <div class="thread-detail">
      <div class="thread-title">
        <voting-arrows
          :score="thread.score">
        </voting-arrows>
        <h3>{{ thread.title.rendered | decodeString }}</h3>
      </div>
      <div class="thread-conent">
        {{ thread.content.rendered }}
        <div class="thread-meta">
          <div class="author meta-item">
            <img class="author-avatar" v-bind:src="authorAvatar" v-bind:alt="thread.author.name">
            <router-link :to="'/users/' + thread.author._id + '/' + thread.author.username">{{ thread.author.name }}</router-link>
          </div>
          <div class="comment-count meta-item">
            {{ thread.comments.length }} comments
          </div>
        </div>
        <div class="thread-comments">
          <comment-compose></comment-compose>
          <comments-list :comments="thread.comments"></comments-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VotingArrows from '@/components/VotingArrows.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import CommentReply from '@/components/CommentReply.vue'
import CommentsList from '@/components/CommentsList.vue'

export default {
  name: 'thread-detail-view',
  components: { VotingArrows, CommentCompose, CommentReply, CommentsList },
  data () {
    return {
      loading: true
    }
  },
  beforeMount () {
    const id = this.$route.params.id
    this.fetchThread({ threadId: id }).then(thread => {
      this.loading = false
    }).catch(err => {
      console.log(err)
      this.loading = false
    })
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchThreadComments'])
  },
  computed: {
    ...mapState({
      thread (state) {
        return state.thread
      }
    }),
    authorAvatar () {
      if (this.thread.author.avatar) return this.thread.author.avatar
      return require('../assets/default_avatar.svg')
    }
  }
}
</script>

<style lang="stylus" scoped>
.thread-detail
  margin 30px 0
  .thread-title
    .voting
      float left
    h3
      font-weight 200
  .thread-conent
    padding 10px 10px 10px 55px
    .thread-meta
      margin 20px 0
      .meta-item
        float left
        display block
        margin-right 10px
        color #999999
      &:after
        clear both
        content ''
        display table
      a
        color #999999
      .author
        .author-avatar
          width 28px
          border-radius 14px
          border 1px solid #f4f4f4
</style>


