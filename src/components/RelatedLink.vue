<template>
  <v-layout row class="ml-2">
    <v-flex xs1>
      <span class="score">
        <span class='arrow' v-bind:class="{ active: relatedLink.upvoted }"
        @click='upvoteHandler'>▲</span>
        <br>
        {{ relatedLink.score || 0 }}
        <br />
        <span class='arrow' v-bind:class="{ active: relatedLink.downvoted }"
      @click='downvoteHandler'>▼</span>

      </span>
    </v-flex>
    <v-flex xs11>
      <a :href="relatedLink.url | externalUrl" target="_blank"
    rel="external nofollow"
    > {{relatedLink.title || relatedLink.url}} </a>

     <v-btn v-if='myLink' @click.prevent='remove'>Delete</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'related-link',
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

<style lang="stylus" scoped>
.row
  justify-content center
  align-items center
.voting 
  display inline-block
  height 100%
.arrow
  color #888
  margin-left -2px
  &:hover
    cursor pointer
    color #3F58AF

  &.active
    color #3F58AF !important
    &:hover
      cursor pointer
      color #888

  .link-holder
    padding-bottom 20px
    border-bottom 1px solid #e8e8e8
</style>
