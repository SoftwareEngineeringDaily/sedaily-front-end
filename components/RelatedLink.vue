<template>
  <div class="link-holder">
    <voting-arrows
      :upvoted="relatedLink.upvoted"
      :downvoted="relatedLink.downvoted"
      :upvote-handler="upvoteHandler"
      :downvote-handler="downvoteHandler"
      :score="relatedLink.score" />

    <a
      :href="relatedLink.url | externalUrl"
      target="_blank"
      rel="external nofollow"> {{ relatedLink.title || relatedLink.url }} </a>

    <div
      v-if="myLink"
      @click="remove">
      <br>
      <button class="button-delete"> Delete Link </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VotingArrows from '~/components/VotingArrows.vue'
export default {
  components: { VotingArrows },
  props: {
    relatedLink: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      me (state) {
        return state.auth.user
      }
    }),
    myLink () {
      return this.me && this.me._id === this.relatedLink.author
    }
  },
  methods: {
    ...mapActions(['upvoteRelatedLink', 'downvoteRelatedLink']),
    async remove () {
      await this.$axios.delete(`/related-links/${this.relatedLink._id}`)
      this.$emit('relatedLinkDeleted')
    },
    upvoteHandler () {
      this.upvoteRelatedLink({
        id: this.relatedLink._id,
        postId: this.relatedLink.post
      })
    },
    downvoteHandler () {
      this.downvoteRelatedLink({
        id: this.relatedLink._id,
        postId: this.relatedLink.post
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.link-holder
  padding-bottom 20px
</style>
