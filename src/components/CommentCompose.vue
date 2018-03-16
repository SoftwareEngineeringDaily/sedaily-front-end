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
      <div v-else>
        <button class='button-submit'
          :disabled="isSubmitting"
          @click='submitComment'>Add Comment</button>
      </div>
    </div>
    <div v-else>
      <h3> Please make sure to update your profile before you can comment: </h3>
      <update-profile  v-if="username" :initialUsername="username"> </update-profile>
    </div>
  </div>
</template>

<script>
import UpdateProfile from 'components/UpdateProfile.vue'
import Spinner from 'components/Spinner'
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

<style scoped lang="stylus">
@import './../css/variables'

.comment-box
  width 100%
  padding 20px 10px
  margin-bottom 12px
  border-radius 4px
  border-color #c5c5c5
</style>
