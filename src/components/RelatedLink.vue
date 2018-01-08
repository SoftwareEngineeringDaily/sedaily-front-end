<template>
  <div class='link-holder'>
    <voting-arrows
      :upvoted="relatedLink.upvoted"
      :downvoted="relatedLink.downvoted"
      :upvoteHandler="upvoteHandler"
      :downvoteHandler="downvoteHandler"
      :score="relatedLink.score">
    </voting-arrows>

    <a :href="relatedLink.url | externalUrl" target="_blank"
    rel="external nofollow"
    > {{relatedLink.title || relatedLink.url}} </a>

    <div v-if='myLink' @click='remove'>
      <br />
      <button class='button-delete'> Delete Link </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VotingArrows from '@/components/VotingArrows.vue'
export default {
  name: 'related-link',
  components: { VotingArrows },
  props: ['relatedLink'],
  methods: {
    ...mapActions(['upvoteRelatedLink', 'downvoteRelatedLink', 'removeRelatedLink', 'relatedLinksFetch']),
    remove () {
      this.removeRelatedLink({
        id: this.relatedLink._id
      })
        .then(() => {
          this.relatedLinksFetch({
            postId: this.relatedLink.post
          })
        })
        .catch((error) => {
          console.log(error)
          alert('Error deleting :(')
        })
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
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    }),
    myLink () {
      if (!this.me._id) return false
      return this.me._id === this.relatedLink.author
    }
  }
}
</script>

<style scoped lang="stylus">
  .link-holder {
    padding-bottom: 20px;
  }
</style>
