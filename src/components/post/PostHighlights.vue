<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-content">
      <div class="modal-header">
        <strong class="title">{{ commentCount || 0 }}  {{commentCount == 1 ? 'highlight' : 'highlights'}}</strong>
        <div class="cursor-pointer" @click="onClose">
          <i class="fa fa-lg fa-close"></i>
        </div>
      </div>
      <div ref="modal-body" class="modal-body">

        <comment-highlight
          v-if="canComment"
          :forumThreadId="threadId"
          :highlight="highlight"
          :autoFocus="true" />

        <comments-list
          :filter="'highlight'"
          :post="post"
          :forumThreadId="threadId"
          :commentCount="commentCount"
          :comments="commentsSorted" />

      </div>
      <div class="modal-footer">
        <button class="btn-close" @click="onClose">
          Close
        </button>
      </div>
    </div>
    <div class="modal-overlay" @click="onClose" />
  </div>
</template>

<script>
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import CommentHighlight from '@/components/comment/CommentHighlight'
import CommentsList from '@/components/comment/CommentsList'

export default {
  props: {
    post: {
      type: Object
    },
    comments: {
      type: Array,
      default: () => [],
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: String,
      defaults: '',
    }
  },

  components: {
    CommentsList,
    CommentHighlight,
  },

  data () {
    return {
      isActive: false,
      commentId: null,
      threadId: null,
    }
  },

  watch: {
    $route (to, from) {
      const isActive = (to.query.thread_id || to.query.comment_id)
      const element = this.$el.querySelector(`[data-selector="c${to.query.comment_id}"]`)
      const modalBodyEl = this.$refs['modal-body']

      if (!isEqual(to.query, from.query)) {
        this.isActive = isActive
        this.commentId = to.query.comment_id
        this.threadId = to.query.thread_id
      }

      if (element) {
        return this.$nextTick(() => {
          // Reset scroll position
          modalBodyEl.scrollTo(0, 0)

          const offset = 20
          const modalBodyTop = modalBodyEl.getBoundingClientRect().top
          const scrollTop = Math.round(element.getBoundingClientRect().top || 0)

          modalBodyEl.scrollTo(0, scrollTop - modalBodyTop - offset)
        })
      }

      this.$nextTick(() => modalBodyEl.scrollTo(0, 0))
    },

    isActive(value) {
      const scrollTop = window.scrollY

      document.body.style.overflow = value ? 'hidden' : ''

      requestAnimationFrame(() => {
        return window.scrollTo(0, scrollTop)
      }, 1)
    },
  },

  computed: {
    canComment () {
      return (!this.comments.filter(c => c.highlight === this.highlight).length)
    },

    commentsSorted () {
      return clone(this.comments).sort((a, b) => {
        return new Date(b.dateCreated) - new Date(a.dateCreated)
      })
    },
  },

  methods: {
    onClose () {
      const modalBodyEl = this.$refs['modal-body']
      const query = {
        thread_id: undefined,
        comment_id: undefined,
      }

      if (this.$router.currentRoute.query.thread_id ||
          this.$router.currentRoute.query.comment_id) {
        this.$router.push({ query })
      }
    },
  },
}
</script>

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}

.modal {
  pointer-events: none;
  display: block;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: opacity 0.12s ease-out 0s;
  opacity: 0;

  .modal-content {
    display: none;
    flex-direction: column;
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    max-width: 50vw;
    max-height: 80vh;
    background-color: #ffffff;
    transform: translate3d(-50%, -50%, 0);
    box-shadow: 0 2px 16px rgba(0,0,0, 0.15);
  }

  .modal-header {
    align-items: center;
    text-transform: uppercase;

    .title {
      flex-grow: 1;
    }
  }

  .modal-body {
    overflow: auto;
    padding: 1rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0, 0);
    transition: background-color 0.12s ease-out 0s;
  }

  .btn-close {
    cursor: pointer;
    min-width: 70px;
    padding: 7px 10px;
    font-size: 12px;
    text-align: center;
    appearance: none;
    color: #fff;
    background: #222;
    border: none;
    border-radius: 4px;
    transition: background-color 0.12s ease-out 0s;
    white-space: nowrap;
    outline: none;

    &:hover {
      background-color: #a591ff;
    }
  }

  &.is-active {
    pointer-events: auto;
    opacity: 1.0;

    .modal-content {
      display: flex;
    }

    .modal-overlay {
      background-color: rgba(0,0,0, 0.2);
    }
  }

  @media screen and (max-width: 600px) {
    .modal-content {
      max-width: 90vw;
      max-height: 90vh;
    }
  }
}
</style>
