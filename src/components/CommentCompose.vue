<template>
  <div v-if="me">
    <div v-if="me.name">
      <v-text-field
        v-model="commentContent"
        textarea
        :disabled="isSubmitting"     
        label="Your comment here..."
      />

      <div v-if="isSubmitting">
        <spinner :show="true"></spinner>
      </div>

      <div v-else class="text-xs-right">
        <v-btn
          :disabled="isSubmitting"
          @click.prevent='submitComment'>
          Submit
        </v-btn>
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
    ...mapActions([
      'commentsCreate',
      'fetchMyProfileData',
      'showErrorMessage',
      'commentsFetch'
    ]),
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
          this.showErrorMessage(error.response.data.message)
        })
    }
  }
}
</script>
