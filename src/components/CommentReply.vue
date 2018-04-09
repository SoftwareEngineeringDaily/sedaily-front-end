<template>
  <div v-if="me" class="col-md-8">
    <div class='reply-container'>
      <comment-form
      :isSubmitting="isSubmitting"
      :content="commentContent"
      :submitCallback="submitCallback"
      :cancelPressed="doneCallback"
      :showCancel="true"
      :submitButtonText="'Reply'"
      >
      </comment-form>
    </div>
  </div>
</template>

<script>
import CommentForm from '@/components/CommentForm.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'comment-reply',
  props: {
    parentComment: {
      type: Object,
      required: true
    },
    doneCallback: {
      type: Function,
      required: true
    },
    rootEntityType: {
      type: String,
      required: false
    }
  },
  components: {
    CommentForm
  },
  beforeMount () {
    console.log('rootEntityType--reply', this.rootEntityType)
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
    submitCallback ({ content }) {
      this.isSubmitting = true
      // First update then change back to empty to clear: this.commentContent = content
      this.commentContent = content
      this.commentsCreate({
        entityId: this.entityId,
        rootEntityType: this.rootEntityType,
        parentCommentId: this.parentComment._id,
        content
      })
        .then((response) => {
          this.isSubmitting = false
          this.commentContent = ''
          this.commentsFetch({
            entityId: this.entityId
          })
          this.doneCallback()
        })
        .catch((error) => {
          this.$toasted.error(error.response.data.message)
        })
    } }
}
</script>

<style scoped lang="stylus">
.reply-container
  margin-left 40px
  margin-top 15px

.collapsed-area
  margin-left 20px
  margin-top 10px

.reply-box
  width 100%
  padding 5px 5px
  margin-bottom 12px
  border-radius 2px
  border-color #c5c5c5
</style>
