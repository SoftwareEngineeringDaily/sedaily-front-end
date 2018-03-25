<template>
  <div v-if="me">
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
</template>

<script>
import UpdateProfile from 'components/UpdateProfile.vue'
import Spinner from 'components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'comment-compose',
  props: {
    rootEntityType: {
      type: String,
      required: false
    }
  },
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

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      },
      entityId (state) {
        return state.route.params.id // TODO: pass into component
      }
    })
  },
  methods: {
    ...mapActions(['commentsCreate', 'commentsFetch']),
    submitComment () {
      this.isSubmitting = true
      console.log('this.entityId', this.entityId)
      this.commentsCreate({
        entityId: this.entityId,
        rootEntityType: this.rootEntityType,
        content: this.commentContent
      })
        .then((response) => {
          this.commentContent = ''
          this.isSubmitting = false
          // Fetch comments
          this.commentsFetch({
            entityId: this.entityId
          })
        })
        .catch((error) => {
          this.isSubmitting = false
          this.$toasted.error(error.response.data.message)
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
