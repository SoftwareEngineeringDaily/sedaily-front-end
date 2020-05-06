<template>
  <div class="highlightable">
    <div
      v-show="showTools"
      class="tools"
      ref="tools"
      :class="{
        'is-highlight': isHighlighting,
        'is-logged-out': !(isLoggedIn),
        'is-reply': isReplying
      }"
      :style="{
        top: `${y}px`,
        left: `${toolsX}px`,
      }">

      <div class="tools-comment">
        <div class="tools-comment-highlight">
          <comment-highlight
            :forumThreadId="forumThreadId"
            :highlight="selectedText"
            :rootEntityType="rootEntityType"
            :autoFocus="true"
            :onSubmit="resetTools" />
        </div>
        <div class="tools-comment-reply">
          <comment-reply
            :entityId="entityId"
            :doneCallback="resetReply"
            :highlight="selectedText"
            :parentCommentId="parentCommentId"
            :rootEntityType="rootEntityType" />
        </div>
      </div>

      <div class="tools-actions">
        <span class="item">
          <social-sharing
            v-if="contentUrl"
            :url="contentUrl"
            :href="contentUrl"
            :title="twitterContent"
            twitter-user="software_daily"
            inline-template>
            <network network="twitter">
              <i class="fa fa-twitter"></i>
            </network>
          </social-sharing>
        </span>
        <span
          class="item"
          @mousedown.prevent="onHighlight">
          <svg viewBox="0 0 512 512">
            <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/>
          </svg>
        </span>
      </div>

      <div class="arrow" :style="{ left: `${arrowX}px` }" />
    </div>
    <slot/>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import CommentHighlight from '@/components/comment/CommentHighlight'
import CommentReply from '@/components/comment/CommentReply'
import { isWithin } from '@/utils/post.utils'
import { mapState, mapActions, mapGetters } from 'vuex'
import SocialSharing from 'vue-social-sharing'

export default {
  components: {
    SocialSharing,
    CommentHighlight,
    CommentReply,
  },

  props: {
    contentUrl: {
      type: String,
      required: true
    },
    forumThreadId: {
      type: String
    },
    rootEntityType: {
      type: String,
      default: 'forumthread'
    },
    socialShareUsers: {
      type: Array,
    }
  },

  data () {
    return {
      x: 0,
      y: 0,
      arrowX: 0,
      toolsX: 0,
      showTools: false,
      isHighlighting: false,
      isReplying: false,
      selectedText: '',
      selectedWidth: 0,

      // Reply
      entityId: '',
      parentCommentId: '',
    }
  },

  computed: {
    ...mapGetters([ 'isLoggedIn' ]),

    highlightableEl () {
      return this.$slots.default[0].elm
    },

    twitterContent () {
      let users = ''

      if (this.socialShareUsers) {
        users = this.socialShareUsers.reduce((prev, user) => {
          if (!user) return prev
          prev += user.twitter ? ` @${user.twitter}` : ''
          return prev
        }, users)
      }

      return `${this.selectedText}${users}`
    }
  },

  mounted () {
    window.addEventListener('mouseup', this.onMouseUp)
  },

  beforeDestroy () {
    this.showTools = false
    window.removeEventListener('mouseup', this.onMouseUp)
  },

  beforeRouteUpdate(to, from, next) {
    this.showTools = false
  },

  methods: {
    setMobileToolsPosition () {
      const parentWidth = this.$el.offsetWidth
      const toolsWidth = this.$refs.tools.offsetWidth
      const toolsCenter = toolsWidth / 2
      const arrowOffset = 6

      if ((this.isHighlighting || this.isReplying) && window.innerWidth > 990) {
        return this.arrowX = arrowOffset * -1
      }

      // Handle arrows position
      this.arrowX = Math.max(this.selectedWidth / 2, arrowOffset)

      if (this.x >= (parentWidth - toolsCenter)) {
        this.arrowX = Math.max((toolsWidth + this.x - (this.selectedWidth / 2)) - this.x - arrowOffset, toolsCenter)
      }
      else if (this.x >= toolsCenter) {
        this.arrowX = Math.max(toolsCenter, arrowOffset)
      }

      // Handle tools positions
      this.toolsX = Math.min(Math.max(this.x, this.$refs.tools.offsetWidth / 2), parentWidth - toolsCenter)
    },

    resetTools () {
      this.showTools = false
      this.isHighlighting = false
      this.isReplying = false

      this.$el.style.position = ''
    },

    resetReply () {
      this.parentCommentId = ''
      this.entityId = ''
      this.resetTools()
    },

    // Selects previously highlighted quotes
    preselectText (target) {
      const selection = window.getSelection()
      const isQuote = (target.tagName === 'MARK')
      let range

      if (selection && document.createRange && isQuote) {
        if (selection.toString() !== '') {
          return
        }

        range = document.createRange()
        range.selectNodeContents(target)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    },

    async onMouseUp ({ target }) {
      this.preselectText(target)
      const selection = window.getSelection()

      if (!selection.anchorNode) {
        return
      }

      const isQuote = (target.tagName === 'MARK')
      const { entityId, parentCommentId } = target.dataset
      const validStartNode = selection.getRangeAt(0).startContainer.parentNode.closest('.highlightable')
      const validEndNode = selection.getRangeAt(0).endContainer.parentNode.closest('.highlightable')
      const parentEl = this.$slots.default[0].elm
      const isWithinTools = await isWithin(parentEl, 'tools', target)
      const blurSelection = (!validStartNode || !validEndNode)

      if ((this.isHighlighting || this.isReplying) && isWithinTools) {
        return
      }

      // If we have reply info, set it
      this.entityId = entityId || this.forumThreadId
      this.parentCommentId = parentCommentId || ''

      if (blurSelection) {
        return this.resetTools()
      }

      const { top: parentTop, left: parentLeft } = this.$el.getBoundingClientRect()
      const { x, y, width } = selection.getRangeAt(0).getBoundingClientRect()

      // If nothing is selected, stop and clear.
      if (!width || selection.toString() === '') {
        return this.resetTools()
      }

      // If clicking a highlight, let's display the highlight modal
      if (this.entityId && this.parentCommentId) {
        return this.$router.push(`?thread_id=${this.entityId}&comment_id=${this.parentCommentId}`)
      }

      if (this.selectedText && selection.toString() !== this.selectedText) {
        this.resetTools()
      }

      this.$el.style.position = 'relative'

      this.x = x - parentLeft + (width / 2)
      this.y = y - parentTop
      this.showTools = true
      this.selectedText = selection.toString()
      this.selectedWidth = width

      this.$emit('highlight', this.selectedText)
    },

    onReply () {
      const query = {
        thread_id: this.entityId,
        comment_id: this.parentCommentId,
      }

      this.$router.push({ query })
    },

    onHighlight () {
      if (this.parentCommentId && this.entityId) {
        return this.onReply()
      }

      const query = {
        thread_id: this.entityId,
        comment_id: undefined,
      }

      this.$router.push({ query })
    },
  },

  watch: {
    $route(to, from) {
      this.showTools = false
      this.isHighlighting = false

      if (!to.query.thread_id) {
        this.$emit('highlight', '')
      }
    },

    x () {
      this.$nextTick(this.setMobileToolsPosition)
    },

    isHighlighting () {
      this.$nextTick(this.setMobileToolsPosition)
    },

    isReplying () {
      this.$nextTick(this.setMobileToolsPosition)
    },
  }
}
</script>

<style lang="stylus" scoped>
.tools
  position: absolute
  z-index 10
  margin-top -10px
  background #333
  transform: translate(-50%, -100%)
  border-radius 3px

  &.is-reply,
  &.is-highlight
    width 28vw
    min-width 280px

  &.is-highlight
    .tools-comment
      display block

    .tools-actions,
    .tools-comment-reply
      display none

  &.is-reply
    .tools-comment
      display block

    .tools-actions,
    .tools-comment-highlight
      display none

  &.is-logged-out
    text-align center
    color #fff
    p
      margin-bottom 0

  .tools-actions
    display: flex
    justify-content: center
    align-items: center
    padding: 0 10px

  .tools-comment
    display none
    padding: 10px

  .arrow
    content: ''
    position: absolute
    left: 50%
    bottom: -5px
    transform: translateX(-50%)
    width: 0
    height: 0
    border-left: 6px solid transparent
    border-right: 6px solid transparent
    border-top: 6px solid #333
  .item
    cursor: pointer
    display flex
    font-size 1.25rem
    color: #FFF
    svg
      height 18px
      width 18px
    &:hover svg,
    &:hover .fa
      transform: translateY(-5%)
  .item + .item
    margin-left: 10px

@media (min-width: 990px) {
  .tools {
    &.is-reply,
    &.is-highlight {
      left 100% !important
      margin-left 2rem
      transform none

      .arrow {
        top: 16px
        left: -5px
        border-top: 6px solid transparent
        border-bottom: 6px solid transparent
        border-right: 6px solid #333
      }
    }
  }
}

</style>
