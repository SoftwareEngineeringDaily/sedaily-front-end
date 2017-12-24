<template>
  <div v-if="me && me.name" >
    <div v-if="expanded" class='reply-container'>
      <div v-if="justSubmitted">
        Thanks for submitting!
        <spinner :show="true"></spinner>
      </div>
      <div v-else>
        <v-text-field
          autofocus
          v-model="commentContent"          
          textarea          
          label="Your message here..."
        />
        
        <v-btn @click.prevent="submitComment">Reply</v-btn>
        <span class='link' @click="expanded=!expanded">Cancel</span>
      </div>

    </div>
    <div v-else class='collapsed-area'>
      <span class='link' @click="expanded=!expanded">Reply</span>
    </div>
  </div>
</template>

<script>
/* @flow */
import UpdateProfile from './UpdateProfile.vue'
import Spinner from './Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'comment-reply',
  props: {
    parentComment: {
      type: Object,
      required: true
    }
  },
  components: {
    UpdateProfile,
    Spinner
  },
  data () {
    return {
      commentContent: '',
      justSubmitted: false,
      expanded: false,
      username: null,
      loading: true
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      },
      postId (state) {
        return state.route.params.id
      }
    })
  },

  methods: {
    ...mapActions([
      'commentsCreate',
      'commentsFetch',
      'fetchMyProfileData'
    ]),
    submitComment () {
      this.justSubmitted = true

      this.commentsCreate({
        postId: this.postId,
        parentCommentId: this.parentComment._id,
        content: this.commentContent
      })
        .then((response) => {
          this.commentContent = ''
          // NOTE: this won't work too well once we are paginating comments:
          this.justSubmitted = false
          this.commentsFetch({
            postId: this.postId
          })
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>

.reply-container 
  margin-left 50px
  margin-top 10px

.collapsed-area
  margin-left 20px
  margin-top 10px

.link 
  color green
  cursor pointer

.reply-box 
  width 100%
  padding 5px 5px
  margin-bottom 12px
  border-radius 2px
  border-color #c5c5c5

</style>
