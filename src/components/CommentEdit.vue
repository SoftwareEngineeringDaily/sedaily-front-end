<template>
  <comment-form
      :isSubmitting="isSubmitting"
      :content="commentContent"
      :submitCallback="submitCallback"
      :cancelPressed="doneCallback"
      :existingMentions="originalMentions"
      :showCancel="true"
      :submitButtonText="'Edit'"
      >
    </comment-form>
</template>

<script>
import CommentForm from '@/components/CommentForm.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'comment-edit',
  props: {
    id: {
      type: String,
      required: true
    },
    originalContent: {
      type: String,
      required: true
    },
    originalMentions: {
      type: Array,
      required: true
    },
    doneCallback: {
      type: Function,
      required: true
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
      commentContent: this.originalContent,
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
    ...mapActions(['editComment', 'commentsFetch']),
    submitCallback ({ content, mentions }) {
      this.isSubmitting = true
      // First update then change back to empty to clear: this.commentContent = content
      this.commentContent = content
      this.editComment({
        id: this.id,
        mentions,
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
