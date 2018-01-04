<template>
  <div v-if="me">
    <div v-if="me.name">
        <textarea placeholder='Your comment here...'
        class='comment-box'
        :disabled="isSubmitting"
        type='text'
        v-model='commentContent' />
        <div v-if="isSubmitting">
          <spinner :show="true"></spinner>
        </div>
        <div v-else="isSubmitting">
          <button class='submit-btn'
          :disabled="isSubmitting"
          @click='submitComment'>
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
import Spinner from './Spinner'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'comment-compose',
  components: {
    UpdateProfile,
    Spinner
  },
  data () {
    return {
      commentContent: '',
      isSubmitting: false,
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
    ...mapActions(['commentsCreate', 'fetchMyProfileData', 'commentsFetch']),
    submitComment () {
      this.isSubmitting = true
      this.commentsCreate({
        postId: this.postId,
        content: this.commentContent
      })
      .then((response) => {
        this.commentContent = ''
        this.isSubmitting = false
        // Fetch comments
        this.commentsFetch({
          postId: this.postId
        })
      })
      .catch((error) => {
        this.isSubmitting = false
        alert(error.response.data.message)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

primary-color = #856AFF
secondary-color = #FF8B6A

.submit-btn {

}
.comment-box {
  width: 100%;
  padding: 20px 10px;
  margin-bottom: 12px;
  border-radius: 7px;
  border-color: #c5c5c5;
}
</style>
