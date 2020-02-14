<template>
  <div>
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
            :autoFocus="true"
            :onSubmit="resetTools" />
        </div>
        <div class="tools-comment-reply">
          <comment-reply
            :entityId="entityId"
            :doneCallback="resetTools"
            :highlight="selectedText"
            :parentCommentId="parentCommentId"
            :rootEntityType="'forumthread'" />
        </div>
      </div>
      <div class="tools-actions">
        <span class="item">
          <social-sharing
            v-if="contentUrl"
            :url="contentUrl"
            :href="contentUrl"
            :title="selectedText"
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
import isString from 'lodash/isString'
import CommentHighlight from '@/components/comment/CommentHighlight'
import CommentReply from '@/components/comment/CommentReply'
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
    isWithin (className, target) {
      return new Promise((resolve, reject) => {
        const parentEl = this.$slots.default[0].elm
        const findParent = (element) => {
          if (!element) {
            return resolve(false)
          }

          let hasClass = (element.classList && element.classList.contains(className))
          let ieSupport = (isString(element.className) && element.className.indexOf(className) >= 0)

          if (hasClass || ieSupport) {
            return resolve(true)
          }

          if (element == parentEl.parentElement) {
            return resolve(false)
          }

          findParent(element.parentElement)
        }

        findParent(target)
      })
    },

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
      this.selectedText = ''
      this.parentCommentId = ''
      this.entityId = ''

      this.$el.style.position = ''
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

        return this.onReply()
      }
    },

    async onMouseUp ({ target }) {
      this.preselectText(target)

      const selection = window.getSelection()
      const isQuote = (target.tagName === 'MARK')
      const { entityId, parentCommentId } = target.dataset
      const startNode = selection.getRangeAt(0).startContainer.parentNode.parentNode.parentNode
      const endNode = selection.getRangeAt(0).endContainer.parentNode.parentNode.parentNode
      const isWithinTools = await this.isWithin('tools', target)
      const blurSelection = (!startNode.isSameNode(this.highlightableEl) || !startNode.isSameNode(endNode))

      if ((this.isHighlighting || this.isReplying) && isWithinTools) {
        return
      }

      if (isQuote) {
        this.entityId = entityId
        this.parentCommentId = parentCommentId
        this.isReplying = true
      }

      if (blurSelection) {
        return this.resetTools()
      }

      const { top: parentTop, left: parentLeft } = this.$el.getBoundingClientRect()
      const { x, y, width } = selection.getRangeAt(0).getBoundingClientRect()

      if (!width || selection.toString() === '') {
        return this.resetTools()
      }
      else if (this.selectedText && selection.toString() !== this.selectedText) {
        this.resetTools()
      }

      this.$el.style.position = 'relative'

      this.x = x - parentLeft + (width / 2)
      this.y = y - parentTop
      this.showTools = true
      this.selectedText = selection.toString()
      this.selectedWidth = width
    },

    onReply () {
      this.isReplying = true
    },

    onHighlight () {
      this.isHighlighting = true
    },
  },
  watch: {
    $route(to, from) {
      this.showTools = false
      this.isHighlighting = false
    },

    x () {
      this.$nextTick(this.setMobileToolsPosition)
    },

    isHighlighting () {
      this.$nextTick(this.setMobileToolsPosition)
    }
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
    width 30vw
    min-width 340px

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
