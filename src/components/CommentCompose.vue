
<template>
  <comment-form
    :rootEntityType="rootEntityType"
    :isSubmitting="isSubmitting"
  >
  </comment-form>
</template>

<script>
import CommentForm from '@/components/CommentForm.vue'
import { mapState, mapActions } from 'vuex'
export default  {
  name: 'comment-compose',
  props: {
    rootEntityType: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      isSubmitting: false
    }
  },
  components: {
    CommentForm
  },
  computed: {
    ...mapState({
      entityId (state) {
        return state.route.params.id // TODO: pass into component
      }
    })
  },
  methods: {
    ...mapActions(['commentsCreate', 'commentsFetch']),
    submitCallback () {
      this.isSubmitting = true
      this.commentsCreate({
        entityId: this.entityId,
        rootEntityType: this.rootEntityType,
        content: this.commentContent
      })
        .then((response) => {
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
