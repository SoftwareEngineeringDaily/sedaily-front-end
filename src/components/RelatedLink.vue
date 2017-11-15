<template>
  <div class='link-holder'>

    <div class='voting' style='display:inline-block; height: 100%;'>
      <span class="score">
        <span class='arrow' v-bind:class="{ active: relatedLink.upvoted }"
        style='margin-left: 1px;' @click='upvoteHandler'>▲</span>
        <br>
        {{ relatedLink.score || 0 }}
        <br />
        <span class='arrow' v-bind:class="{ active: relatedLink.downvoted }"
      @click='downvoteHandler'>▼</span>

      </span>
    </div>

    <a :href="url" target="_blank"
    rel="external nofollow"
    > {{relatedLink.title}} </a>

    <div v-if='myLink' @click='remove'> <button> delete </button> </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'related-link',
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
    },
    url () {
      // Turn url into clickable
      const {url} = this.relatedLink
      let newUrl = url
      if (url.indexOf('://') === -1) {
        newUrl = '//' + url
      }
      return newUrl
    }
  }
}
</script>

<style scoped lang="stylus">

.arrow
  color #888
  &:hover
    cursor pointer
    color #3F58AF

  &.active
    color #3F58AF !important
    &:hover
      cursor pointer
      color #888

  .link-holder {
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

  }
</style>
