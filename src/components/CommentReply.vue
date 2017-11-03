<template>
  <div v-if="me" class='reply-container'>
    <div v-if="me.name">
      <input placeholder='Your comment here...'
      class='reply-box'
      type='text'
      v-model='commentContent' />
      <button class='btn-success' @click='submitComment'>
        Reply
      </button>
    </div>
  </div>
</template>

<script>
/* @flow */
import UpdateProfile from './UpdateProfile.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'comment-reply',
  props: ['comment'],
  components: {
    UpdateProfile
  },
  data () {
    return {
      commentContent: '',
      username: null,
      loading: true
    }
  },
  beforeMount () {
    this.fetchMyProfileData()
    .then(() => {
      this.loading = false
      this.username = this.me.username
    })
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
    ...mapActions(['commentsCreate', 'fetchMyProfileData']),
    submitComment () {
      this.commentsCreate({
        postId: this.postId,
        content: this.commentContent
      })
      .then((response) => {
        this.commentContent = ''
      })
      .catch((error) => {
        alert(error.response.data.message)
      })
    } }
}
</script>

<style scoped>
  .reply-container {
    margin-left: 20px;
  }
  .reply-box {
    width: 100%;
    padding: 5px 5px;
    margin-bottom: 12px;
    border-radius: 2px;
    border-color: #c5c5c5;
  }
</style>
