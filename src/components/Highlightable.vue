<template>
  <div>
    <div
      v-show="showTools"
      class="tools"
      :style="{
        left: `${x}px`,
        top: `${y}px`
      }"
      @mousedown.prevent="">
      <span
        class="item"
        @mousedown.prevent="handleAction('share')">

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
        @mousedown.prevent="handleAction('highlight')">
        <svg viewBox="0 0 512 512">
          <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/>
        </svg>
      </span>
    </div>
    <slot/>
  </div>
</template>

<script>
import SocialSharing from 'vue-social-sharing'
export default {
  components: {
    SocialSharing
  },

  props: {
    contentUrl: {
      type: String,
      required: true
    },
  },

  data () {
    return {
      x: 0,
      y: 0,
      showTools: false,
      selectedText: ''
    }
  },

  computed: {
    highlightableEl () {
      return this.$slots.default[0].elm
    }
  },

  mounted () {
    window.addEventListener('mouseup', this.onMouseup)
  },

  beforeDestroy () {
    this.showTools = false
    window.removeEventListener('mouseup', this.onMouseup)
  },

  beforeRouteUpdate(to, from, next) {
    this.showTools = false
  },

  methods: {
    onMouseup () {
      const selection = window.getSelection()
      const startNode = selection.getRangeAt(0).startContainer.parentNode.parentNode.parentNode
      const endNode = selection.getRangeAt(0).endContainer.parentNode.parentNode.parentNode

      if (!startNode.isSameNode(this.highlightableEl) || !startNode.isSameNode(endNode)) {
        this.showTools = false
        this.$el.style.position = ''
        return
      }

      const { top: parentTop, left: parentLeft } = this.$el.getBoundingClientRect()
      const { x, y, width } = selection.getRangeAt(0).getBoundingClientRect()

      if (!width || selection.toString() === '') {
        this.showTools = false
        this.$el.style.position = ''
        return
      }

      this.$el.style.position = 'relative'

      this.x = x - parentLeft + (width / 2)
      this.y = y - parentTop
      this.showTools = true
      this.selectedText = `"${selection.toString()}"`
    },

    handleAction (action) {
      this.$emit(action, this.selectedText)
    }
  },
  watch: {
    $route(to, from) {
      this.showTools = false
    },
  }
}
</script>

<style lang="stylus" scoped>
.tools
  display: flex
  position: absolute
  height: 30px
  padding: 5px 10px
  background #333
  border-radius 3px
  transform: translate(-50%, -140%)
  justify-content: center
  align-items: center
  z-index 10
  &:after
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
</style>
