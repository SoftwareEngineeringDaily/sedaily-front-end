<template>
  <div v-if="me" class="col-md-10">
    <div class='reply-container'>
      <comment-form
      :isSubmitting="isSubmitting"
      :content="commentContent"
      :submitCallback="submitCallback"
      :cancelPressed="doneCallback"
      :existingMentions="existingMentions"
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
    replyingTo: {
      type: Object,
      required: false
    },
    parentCommentId: {
      type: String,
      required: true
    },
    entityId: {
      type: String,
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
    const commentContent = this.replyingTo? `@${this.replyingTo.name} ` : ''
    const existingMentions = this.replyingTo? [this.replyingTo]:[]
    return {
      commentContent,
      existingMentions,
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
      }
    })
  },

  methods: {
    ...mapActions(['commentsCreate', 'commentsFetch']),
    submitCallback ({ content, mentions }) {
      this.isSubmitting = true
      // First update then change back to empty to clear: this.commentContent = content
      this.commentContent = content
      this.commentsCreate({
        entityId: this.entityId,
        mentions,
        rootEntityType: this.rootEntityType,
        parentCommentId: this.parentCommentId,
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
  .button-submit
    width 20px

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
