<template>
  <div>
    <div class="row">
      <div class="col-sm-1">
        <voting-arrows
          :upvoteHandler="upvoteHandler"
          :upvoted="thread.upvoted"
          :score="thread.score">
        </voting-arrows>
      </div>
      <div class="col-sm-8">
        <div class='forum-thread-title'>
          {{thread.title}}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-9">
        <div class='forum-thread-content'>
          <div v-html="compiledMarkdown" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import { mapActions } from 'vuex'
import VotingArrows from 'components/VotingArrows'

export default {
  name: 'form-thread-body',
  components: {
    VotingArrows
  },
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    compiledMarkdown () {
      marked.setOptions({
        breaks: true
      })
      return marked(this.thread.content)
    }
  },
  methods: {
    ...mapActions(['forumThreadLike']),
    upvoteHandler () {
      this.forumThreadLike({
        id: this.thread._id
      })
    }
  }
}
/* The /deep/ below is needed because of v-html not having CSS applied to it:*/
</script>

<style lang="stylus" scoped>
@import '../../css/variables'

div.forum-thread-content {
  /deep/ a {
    color: primary-color;
  }
}

.forum-thread-title
  font-size 2.6rem
  font-weight 200

.forum-thread-content
  font-size 1.1rem
  word-break break-word
  font-weight 200

</style>
