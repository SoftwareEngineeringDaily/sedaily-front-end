<template>
  <div v-if="me">
    <div v-if="me.name">
      <textarea
        :disabled="isSubmitting"
        v-model="commentContent"
        placeholder="Your comment here..."
        class="comment-box"
        type="text" />
      <div v-if="isSubmitting">
        <spinner :show="true" />
      </div>
      <div v-else>
        <button
          :disabled="isSubmitting"
          class="button-submit"
          @click="submitComment">Add Comment</button>
      </div>
    </div>
    <div v-else>
      <h3> Please make sure to update your profile before you can comment: </h3>
      <update-profile
        v-if="username"
        :initial-username="username" />
    </div>
  </div>
</template>

<script>
import UpdateProfile from '~/components/UpdateProfile.vue'
import Spinner from '~/components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    UpdateProfile,
    Spinner
  },
  data () {
    return {
      commentContent: '',
      isSubmitting: false,
      loading: true
    }
  },
  computed: {
    // local computed methods +
    ...mapState({
      username () {
        return this.me.username
      },
      me (state) {
        return state.auth.user
      }
    }),
    postId () {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions(['commentsCreate', 'commentsFetch']),
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
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../assets/stylus/variables'

.comment-box
  width 100%
  padding 20px 10px
  margin-bottom 12px
  border-radius 4px
  border-color #c5c5c5
</style>
