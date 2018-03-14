<template>
  <div v-if="me" >
    <div v-if="me.name">
      <div
        v-if="expanded"
        class="reply-container">
        <div v-if="justSubmitted">
          Thanks for submitting!
          <spinner :show="true" />
        </div>
        <div v-else>
          <textarea
            v-model="commentContent"
            placeholder="Your message here..."
            class="reply-box"
            type="text" />
          <button
            class="button-submit-small"
            @click="submitComment">
            Reply
          </button>
          <span
            class="link"
            @click="expanded=!expanded">Cancel</span>
        </div>

      </div>
      <div
        v-else
        class="collapsed-area">
        <span
          class="link"
          @click="expanded=!expanded">Reply</span>
      </div>
    </div>
  </div>
</template>

<script>
import UpdateProfile from '~/components/UpdateProfile.vue'
import Spinner from '~/components/Spinner.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    UpdateProfile,
    Spinner
  },
  props: {
    parentComment: {
      type: Object,
      required: true
    },
    postId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      commentContent: '',
      justSubmitted: false,
      expanded: false,
      username: null,
      loading: true
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.auth.user
      }
    })
  },

  methods: {
    async submitComment () {
      this.justSubmitted = true

      try {
        await this.$axios.post(`/posts/${this.postId}/comment`, {
          content: this.commentContent,
          parentCommentId: this.parentComment._id
        })

        this.commentContent = ''
        this.$emit('commentCreated')
      } finally {
        this.justSubmitted = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.reply-container
  margin-left 50px
  margin-top 10px

.collapsed-area
  margin-left 20px
  margin-top 10px

.link
  color primary-color
  cursor pointer
  padding 5px 8px

.reply-box
  width 100%
  padding 5px 5px
  margin-bottom 12px
  border-radius 2px
  border-color #c5c5c5
</style>
