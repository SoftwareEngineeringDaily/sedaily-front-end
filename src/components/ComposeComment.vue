<template>
  <div v-if="me">
    <div v-if="me.name">
      <div v-if="justSubmitted">
          Thanks for commenting!
          <button @click="justSubmitted=false"> Add another </button>
      </div>
      <div v-else="justSubmitted">
        <textarea placeholder='Your comment here...'
        class='comment-box'
        type='text'
        v-model='commentContent' />
        <button class='btn-success' @click='submitComment'>
          Comment
        </button>
      </div>

    </div>
    <div v-else>
      Please make sure to update your profile before you can comment:
      <update-profile  v-if="username" :initialUsername="username"> </update-profile>
    </div>
  </div>
</template>

<script>
/* @flow */
import UpdateProfile from './UpdateProfile.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'compose-comment',
  components: {
    UpdateProfile
  },
  data () {
    return {
      commentContent: '',
      justSubmitted: false,
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
      this.justSubmitted = true
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
  .comment-box {
    width: 100%;
    padding: 20px 10px;
    margin-bottom: 12px;
    border-radius: 7px;
    border-color: #c5c5c5;
  }
</style>
