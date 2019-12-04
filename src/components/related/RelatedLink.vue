<template>
  <div class='link-holder'>
    <a :href="relatedLink.url | externalUrl" target="_blank"
    rel="external nofollow"
    > {{relatedLink.title || relatedLink.url}} </a>
    <div v-if='myLink'>
      <button @click='remove' class='button-delete'><i class="fa fa-trash"/></button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VotingArrows from '@/components/VotingArrows'
export default {
  name: 'related-link',
  components: { VotingArrows },
  props: {
    relatedLink: {
      type: Object,
      required: true
    }
  },
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
          this.$toasted.error('Error deleting :(', { 
              singleton: true,
              theme: "bubble", 
              position: "bottom-center", 
              duration : 700
          })
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
@import '../../css/variables'
.button-delete
  background none
  outline none
  border none
  color #c4c4c4
.link-holder
  display flex
  align-items center
  a
    font-size 16px
    font-weight normal
    color primary-color
    opacity .7
</style>
