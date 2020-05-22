<template>
  <div class="topicpage-revisions">
    <div v-show="saving" class="loading-mask">
      <spinner :show="true"/>
    </div>
    <b-pagination v-model="currentPage" :total-rows="revisions ? revisions.length : 0" :per-page="perPage" align="right"/>
    <div class="topicpage-revisions-event" v-for="revision in revisionsPage" :key="revision._id">
      <div class="time">{{dateFormat(revision.dateCreated)}}</div>
      <avatar width="30px" height="30px" :user="revision.author" />
      <div class="name"> {{revision.author.name}}</div>
      <div class="revision-number">
        v{{revision.revision}}
        <span v-if="isCurrentVersion(revision.revision)">(current)</span>
      </div>
      <div class="actions">
        <template v-if="!isCurrentVersion(revision.revision)">
          <button @click="onShow(revision)">Show</button>
          <button @click="onRecover(revision)">Recover</button>
        </template>
      </div>
    </div>

    <div v-if="showPreview" class="preview-window">
      <button class="btn-close" @click="hidePreviewWindow()"><i class="fa fa-close"/></button>
      <div class="row preview-container">
        <div class="preview-content col-lg-8 col-md-8 col-sm-12">
          <template v-if="loading">
            <spinner :show="true"/>
          </template>
          <template v-else>
            <div class="topicpage-header">
              <h1 class="header-title">{{topic.name}}</h1>
            </div>
            <img v-if="revision.logo" :src="revision.logo" class="topic-logo"/>
            <div class="content-block" v-html="diffContent" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import { diffTrimmedLines } from 'diff'
import { cleanContent } from '@/utils/post.utils'
import Avatar from '@/components/Avatar'
import Spinner from '@/components/Spinner'

export default {
  name: 'topic-page-revisions',
  components: {
    Avatar,
    Spinner
  },
  props: {
    revisions: {
      type: Array
    },
    topic: {
      type: Object
    },
    topicPage: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      saving: false,
      revision: {},
      diffContent: '',
      currentPage: 1,
      perPage: 4,
      showPreview: false
    }
  },
  beforeDestroy () {
    this.hidePreviewWindow()
  },
  computed: {
    revisionsPage () {
      const { revisions, perPage, currentPage } = this
      if (!revisions) return []
      return revisions.slice((currentPage - 1) * perPage, currentPage * perPage)
    }
  },
  methods: {
    ...mapActions(['getTopicPageRevision', 'setTopicPageRevision']),
    onShow (revision) {
      this.loading = true
      this.diffContent = ''

      const options = {
        slug: this.topic.slug,
        revision: revision.revision
      }

      this.showPreviewWindow()

      this.getTopicPageRevision(options).then((data) => {
        this.revision = data
        if (data.content) {
          this.setDiffContent()
        }
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onRecover (revision) {
      this.saving = true

      const options = {
        slug: this.topic.slug,
        revision: revision.revision
      }

      this.setTopicPageRevision(options).then((data) => {
        this.$emit('onRecover', revision)
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    },

    setDiffContent () {
      const diff = diffTrimmedLines(this.revision.content, this.topicPage.content)
      let text = ''
      let lastColor = '<span>'

      diff.forEach((part) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        if (color === lastColor) text += part.value
        else text += `</span><span class="${color}">${part.value}`
      });
      text += '</span>'
      
      this.diffContent = cleanContent(text)
    },

    showPreviewWindow () {
      document.querySelector('body').style.overflow = 'hidden'
      this.showPreview = true
    },
    
    hidePreviewWindow () {
      document.querySelector('body').style.overflow = ''
      this.showPreview = false
    },

    dateFormat (date) {
      if (moment().isSame(date, 'day')) return moment(date).format('[Today, ]HH[h]mm')
      return moment(date).format('MMMM Do, YYYY')
    },

    isCurrentVersion (revision) {
      const { topicPage } = this;
      if (!topicPage.revision) return false
      return topicPage.revision === revision
    },
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/variables'
.topicpage-revisions
  border 1px solid #ddd
  border-radius 4px
  position relative

  .loading-mask
    background-color rgba(255, 255, 255, .8)
    position absolute
    height 100%
    width 100%
    top 0
    left 0
    z-index 10
    display flex

  .spinner
    margin: auto;
    display block

  &-event
    display flex
    line-height 30px
    padding 10px
    align-items center

    .time
      width 120px
      color #6c757d
      font-size 12px

    .name
      margin-left 10px
      flex 1
      color #6c757d

    .revision-number
      flex 1

      span
        color #6c757d
        font-size 12px

    .actions
      flex 1
      text-align center

      button
        border none
        outline 0
        background-color transparent
  
  .preview-window
    position fixed
    background-color #fff
    top 0
    left 0
    height 100vh
    width 100vw
    z-index 1000

    .btn-close
      border none
      outline 0
      background-color transparent
      font-size 28px
      right 0
      position absolute
      margin 20px
      z-index 1001
    
    .preview-container
      max-width 1050px
      margin 0 auto
      height 100%
      overflow auto
      background-color #fff

      .topic-logo
        width 98%
        margin-top 40px

      .preview-content
        margin 0 auto
        margin-top 40px

      .content-block
        margin 40px 0

      >>> .grey
          color #222

      >>> .green
        color green

      >>> .red
        color red
        text-decoration line-through
    
  >>> .pagination
    margin 10px

  >>> .page-link
      color primary-color
      font-size 12px
      padding .3rem .65rem

  >>> .page-item.active .page-link
    z-index 1
    color #fff
    background-color primary-color
    border-color primary-color
</style>
