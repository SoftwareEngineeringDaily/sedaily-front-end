
<template>
  <comment-form
    :highlight="highlight"
    :isSubmitting="isSubmitting"
    :initialComment="initialComment"
    :submitCallback="submitCallback"
  />
</template>

<script>
import isFunction from 'lodash/isFunction'
import CommentForm from './CommentForm'
import { mapState, mapActions, mapMutations } from 'vuex'

export default  {
  name: 'comment-compose',
  props: {
    rootEntityType: {
      type: String,
      required: false
    },
    entityId: {
      required: true
    },
    initialComment: {
      type: String,
    },
    highlight: {
      type: String,
    },
    onSubmit: {
      type: Function,
    },
  },
  data () {
    return {
      isSubmitting: false,
      commentContent: this.comment || ''
    }
  },
  components: {
    CommentForm
  },
  methods: {
    ...mapActions([
      'commentsCreate',
      'commentsFetch'
    ]),
    ...mapMutations(['commentsToggle']),
    submitCallback ({ content, highlight, mentions }) {
      const data = {
        entityId: this.entityId,
        rootEntityType: this.rootEntityType,
        mentions,
        highlight,
        content,
      }

      this.isSubmitting = true

      // First update then change back to empty to clear: this.commentContent = content
      // this.commentContent = content
      this.commentsToggle({ id: this.entityId })
      this.commentsCreate(data)
        .then((response) => {
          this.isSubmitting = false

          // Fetch comments
          this.commentsFetch({
            entityId: this.entityId
          })

          if (isFunction(this.onSubmit)) {
            this.onSubmit(data)
          }
        })
        .catch((error) => {
          this.isSubmitting = false
          this.$toasted.error(error.response.data.message, {
              singleton: true,
              theme: "bubble",
              position: "bottom-center",
              duration : 700
          })
        })

    },
  }
}
</script>
