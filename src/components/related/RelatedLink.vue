<template>
  <div class="link-holder">
    <a
      :href="relatedLink.url | externalUrl"
      :target="relatedLink.target || '_blank'"
      rel="external nofollow">
      <img v-if="relatedLink.icon" :src="relatedLink.icon" class="link-icon" @error.once="faviconFallback" />
      <div class="text-ellipsis">{{relatedLink.title || relatedLink.url}}</div>
    </a>
    <div v-if='myLink'>
      <button @click='remove' class='button-delete'>
        <i class="fa fa-trash"/>
      </button>
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
    ...mapActions([
      'upvoteRelatedLink',
      'downvoteRelatedLink',
      'removeRelatedLink',
      'relatedLinksFetch'
    ]),
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
    },
    faviconFallback ({ target }) {
      target.src = 'https://www.softwaredaily.com/static/favicon.png'
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
  margin-right -0.5rem

  a
    display flex
    align-items center
    width calc(100% - 2rem)
    font-size 16px
    font-weight normal
    color #1a0dab

.text-ellipsis
  overflow hidden
  white-space nowrap
  text-overflow ellipsis

.link-icon
  max-width 16px
  margin-right 0.5rem

</style>
