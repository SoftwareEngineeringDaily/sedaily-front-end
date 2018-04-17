<template>
  <div>
    <div v-if="loading" class="spinner-holder">
      <spinner :show="loading" />
    </div>
    <div v-else-if="emptyComments" class='no-comments'>
      There are no comments.
    </div>
    <div v-else v-for="comment in comments" :key="comment._id">
      <div class='row'>
        <div class='col-md-12'>
          <comment-view
            :rootEntityType='rootEntityType'
            :comment='comment'
            :isParentComment="true" />
        </div>
      </div>
        <div class='replies'>
          <div v-for="replyComment in comment.replies" :key="replyComment._id">
            <comment-view :comment='replyComment' />
            <br />
          </div>
        </div>
      <br />
    </div>
  </div>
</template>

<script>
import CommentView from 'components/CommentView.vue'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'comments-list',
  props: {
    comments: {
      type: Array,
      required: true
    },
    rootEntityType: {
      type: String,
      required: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  beforeMount () {
    console.log('rootEntityType--list', this.rootEntityType)
  },

  components: { CommentView, Spinner },
  computed: {
    emptyComments () {
      if (!this.comments || this.comments.length === 0) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped lang="stylus">
.replies
  margin-top 45px
  margin-left 45px
.no-comments
  padding-top 20px
  color #ccc

</style>
