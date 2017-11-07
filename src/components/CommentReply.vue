<template>
  <div v-if="me" >
    <div v-if="me.name">
      <div v-if="expanded" class='reply-container'>
        <div v-if="justSubmitted">
          Thanks for submitting!
          <button @click="justSubmitted=false"> Add another </button>
        </div>
        <div v-else="justSubmitted">
          <input placeholder='Your message here...'
          class='reply-box'
          type='text'
          v-model='commentContent' />
          <button class='btn-success' @click='submitComment'>
            Reply
          </button>
          <span class='link' @click="expanded=!expanded">Cancel</span>
        </div>

      </div>
      <div v-else class='collapsed-area'>
        <span class='link' @click="expanded=!expanded">Reply</span>
      </div>
    </div>
  </div>
</template>

<script>
/* @flow */
import UpdateProfile from './UpdateProfile.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'comment-reply',
  props: ['parentComment'],
  components: {
    UpdateProfile
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
    ...mapActions(['commentsCreate', 'commentsFetch', 'fetchMyProfileData']),
    submitComment () {
      this.justSubmitted = true
      this.commentsCreate({
        postId: this.postId,
        parentCommentId: this.parentComment._id,
        content: this.commentContent
      })
      .then((response) => {
        this.commentContent = ''
        // TODO Should also refetch all comments!
        this.justSubmitted = false
        this.commentsFetch({
          postId: this.postId
        })
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
    } }
}
</script>

<style scoped>
  .reply-container {
    margin-left: 50px;
    margin-top: 10px;
  }
  .collapsed-area{
    margin-left: 20px;
    margin-top: 10px;
  }

  .link {
    color: green;
    cursor: pointer;
  }

  .reply-box {
    width: 100%;
    padding: 5px 5px;
    margin-bottom: 12px;
    border-radius: 2px;
    border-color: #c5c5c5;
  }
</style>
