<template>
  <topic-page-template>
    <template v-slot:content>
      <div class="topicpage-edit">
        <spinner :show="loading"/>
        <div v-if="!editPermission.canEdit" class="no-edit">Can't edit this Topic. <br>{{editPermission.msg}}</div>
        <div v-if="editPermission.canEdit && topicData._id" class="topic-page">

          <div class="topicpage-header">
            <h1 class="header-title">{{topicData.name}}</h1>
            <button @click="previewEdit" class="button-secondary button-preview">{{buttonPreviewText}}</button>
            <router-link
              :to="`/topic/${topicData.slug}`"
              target="_blank"
              class="button-secondary button-preview">
              View Page
            </router-link>
          </div>

          <topic-page-maintainer :user="topicData.maintainer" />

          <div v-if="!me.avatarUrl" class="alert-block">
            <router-link to="/edit-profile">Add a picture</router-link> to your profile if you would like us to
            share your writing
          </div>
           <div v-if="!me.lastName" class="alert-block">
            <router-link to="/edit-profile">Add a Last Name</router-link> to your profile if you would like us to
            share your writing
          </div>

          <ImageEditThumb
            v-if="showThumb"
            :saving="savingLogo"
            buttonText="Change (1200x628)"
            :class="['topic-logo', !isPreviewing ? 'topic-logo-edit' : '']"
            :edit="!isPreviewing"
            :crop="true"
            :maxWidth="1200"
            :src="topicPageData.logo"
            @onChangeFile="onLogoChange"
            placeholder="Topic logo" />

          <div v-if="isPreviewing" class="content-block" v-html="htmlContent"></div>

          <content-editor
            v-show="!isPreviewing"
            v-model="topicPageData.content"
            @onChange="onContentChange"
            ref="editor" />

          <div v-if="draft" class="draft-warning">
            This is not saved. Remember to save before you leave.
            <button @click="discardDraft">Discard draft</button>
          </div>

          <div v-show="!isPreviewing" class="button-bar">
            <div :class="['left-items', topicPublishStatus ? 'published' : 'unpublished']">Status: {{topicPublishMsg}}</div>
            <div class="center-items">
              <button @click="save" :disabled="disabledSave" :class="['button-submit button-save', disabledClass]">
                <spinner :show="saving"></spinner>
                Save
              </button>
            </div>
            <div class="right-items">
              <button @click="onClickPublish" :disabled="publishing" class="button-submit">
                <spinner :show="publishing"></spinner>
                {{(topicPublishStatus) ? 'Unpublish' : 'Publish'}}
              </button>
            </div>
          </div>

          <div v-if="!me.twitter" class="alert-block">
            <router-link to="/edit-profile">Add a Twitter account</router-link> to your profile if you would like us to
            share your writing
          </div>

          <div v-if="!isPreviewing" class="topicpage-history">
            <h4>Activities</h4>
            <div class="topicpage-history-event" v-for="event in topicPageData.history" :key="event._id">
              <div class="time">{{dateFormat(event.dateCreated)}}</div>
              <div class="event"> {{getHistoryEvent(event.event)}}</div>
              <avatar width="30px" :user="event.user" />
              <div class="name"> {{event.user.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </topic-page-template>
</template>

<script>
import { isArray, find } from 'lodash'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import { debounce } from 'lodash'
import Spinner from '@/components/Spinner'
import { TopicPageTemplate, TopicPageMaintainer } from '@/views/topic'
import ContentEditor from '@/components/contentEditor/ContentEditor'
import Avatar from '@/components/Avatar'
import { ImageEditThumb } from '@/components/ImageEdit'

const eventListener =  (e) => {
  e.preventDefault();
  e.returnValue = '';
}

export default {
  name: 'topicpage-edit',
  components: {
    Spinner,
    TopicPageMaintainer,
    TopicPageTemplate,
    ContentEditor,
    Avatar,
    ImageEditThumb,
  },
  beforeMount () {
    this.loadTopic()
  },
  data () {
    return {
      loading: false,
      saving: false,
      savingLogo: false,
      publishing: false,
      topicData: {},
      topicPageData: {},
      savedContent: '',
      draft: false,
      isPreviewing: false,
      htmlContent: '',
      hasChanges: false,
      alerts: [1,2,3]
    }
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    }),

    editPermission () {
      const maintainers = (this.topicData && isArray(this.topicData.maintainers)) ? this.topicData.maintainers : []
      const user = (this.$store.state.me && this.$store.state.me._id) ? this.$store.state.me : {}
      const canEdit = find(maintainers, { _id: user._id })
      const msg = !maintainers.length ? 'This topic has no maintainer.' : !canEdit ? 'No permission to edit.' : ''

      return { canEdit, msg }
    },

    editor () {
      return this.$refs.editor;
    },

    disabledSave () {
      return this.saving || !this.hasChanges
    },

    disabledClass () {
      return this.disabledSave ? 'disabled' : ''
    },

    buttonPreviewText () {
      return !!this.isPreviewing ? 'Edit' : 'Preview'
    },

    showThumb () {
      if (this.topicPageData.logo) return true
      if (!this.topicPageData.logo && !this.isPreviewing) return true
      return false
    },

    topicPublishStatus () {
      return !(!this.topicPageData || !this.topicPageData.published)
    },

    topicPublishMsg () {
      if (!this.topicPageData) return ''
      if (!this.topicPageData.published) return 'This topic is not published'
      return 'Published'
    }
  },
  watch: {
    hasChanges (value) {
      if (value) {
        window.addEventListener('beforeunload', eventListener);
      } else {
        window.removeEventListener('beforeunload', eventListener)
      }
    }
  },
  methods: {
    ...mapActions(['getTopicPageEdit', 'saveTopicPage', 'saveTopicPageLogo', 'publishTopicPage', 'unpublishTopicPage']),

    loadTopic () {
      this.loading = true
      this.getTopicPageEdit(this.$route.params.slug).then((data) => {
        this.topicData = data.topic
        data.topicPage.history.sort((o1, o2) => {
          return o1.dateCreated >= o2.dateCreated ? -1 : 1;
        });
        this.topicPageData = data.topicPage
        this.savedContent = this.topicPageData.content
        this.loadDraft()
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    getHTML () {
      return this.editor.getHTML()
    },

    previewEdit () {
      if (this.isPreviewing) this.setEditMode()
      else this.setPreviewMode()
    },

    setEditMode () {
      this.isPreviewing = false
    },

    onContentChange (content) {
      if (this.savedContent === content ) return
      this.hasChanges = true
      this.saveDraft()
    },

    localStorage () {
      const { localStorage } = window
      const name = `edit.topicpage.${this.topicData.slug}`
      if (!localStorage) return { localStorage: false, name }
      return { localStorage, name }
    },

    saveDraft: debounce( function(value)  {
      const { localStorage, name } = this.localStorage()
      if (!localStorage) return
      localStorage.setItem(name, this.topicPageData.content)
      this.draft = true
    },500),

    loadDraft () {
      const { localStorage, name } = this.localStorage()
      if (!localStorage) return

      const draft = localStorage.getItem(name)
      if (!draft || this.savedContent === draft) return
      this.draft = true
      this.topicPageData.content = draft
      this.$toasted.success('A local draft was been recovered', { duration : 4000 })
    },

    discardDraft () {
      this.clearDraft()
      this.topicPageData.content = this.savedContent
      this.hasChanges = false
    },

    clearDraft () {
      this.draft = false
      const { localStorage, name } = this.localStorage()
      if (!localStorage) return
      localStorage.setItem(name, '')
    },

    setPreviewMode () {
      this.htmlContent = this.getHTML()
      this.$nextTick(() => {
        this.isPreviewing = true
      })
    },

    save (callback) {
      this.saving = true

      const saveData = {
        slug: this.topicData.slug,
        data: {
          content: this.topicPageData.content,
          event: 'edit',
          published: this.topicPageData.published
        }
      }

      this.saveTopicPage(saveData).then((response) => {
        this.hasChanges = false
        this.clearDraft()
        if (typeof callback === 'function') return callback()
        this.$toasted.success('Saved!', { duration : 4000 })
        this.loadTopic()
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    },

    onLogoChange (file) {
      this.saveLogoImage(file)
    },

    onClickPublish () {
      this.publishing = true

      const method = (this.topicPageData.published) ? 'unpublishTopicPage' : 'publishTopicPage'

      const saveData = {
        slug: this.topicData.slug
      }
      this.save(() => {
        this[method].apply(this, [saveData]).then((response) => {
          this.$toasted.success('Topic updated', { duration : 4000 })
          this.loadTopic()
        }).catch((e) => {
          this.$toasted.error(e.response.data, { duration : 0 })
        }).finally(() => {
          this.publishing = false
        })
      })
    },

    saveLogoImage (file) {
      this.savingLogo = true
      this.saveTopicPageLogo({slug: this.$route.params.slug, file }).then(() => {

      }).catch((e) => {
        this.$toasted.error((e && e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.savingLogo = false
      })
    },

    dateFormat (date) {
      if (moment().isSame(date, 'day')) return moment(date).format('[Today, ]HH[h]mm')
      return moment(date).format('MMMM Do, YYYY')
    },

    getHistoryEvent (event) {
      switch(event) {
        case 'edit': return 'Edited'
        case 'publish': return 'Published'
        case 'unpublish': return 'Unpublished'
      }
      return '-'
    },

    editorReplaceSelection (content) {
      this.editor.codemirror.doc.replaceSelection(content)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/variables'
@import '~simplemde/dist/simplemde.min.css';

.topicpage-edit

  .topicpage-header
    display flex
    align-items flex-start

    .header-title
      flex-grow 1
      margin 0

    .button-secondary
      margin-top 8px
      margin-bottom 8px

  .spinner
    margin: 0 auto;
    display block

  .no-edit
    padding 20px
    text-align center
    font-size 22px

  .button-bar
    display flex
    justify-content space-between
    padding 20px 0

    div
      flex 1
      display flex
      align-items: center;

    .left-items
      justify-content flex-start
      font-weight 600
      padding 0 5px

    .center-items
      justify-content center

    .right-items
      justify-content flex-end

    .published
      color #6c757d

    .unpublished
      color #b35454

  .button-save
    width 120px

  .button-secondary
    background-color inherit
    border 1px solid #222
    padding 7px 10px
    font-size 12px
    color #222
    border-radius 30px

  .button-secondary:hover
    outline none

  .button-secondary:focus
    outline none

  .button-preview
    margin-left 10px
    padding-right 12px
    padding-left 12px

  button
    .spinner
      width 22px
      height 22px
      display inline-block

      >>> circle
        stroke #ffffff

  .button-submit.disabled
    background-color #c4c4c4

  .draft-warning
    margin 3px 0
    font-size 12px
    text-align center
    background-color #f4f4f4
    color #8c3939

    button
      background none
      border none
      outline none
      color #8c3939
      text-decoration underline

  .alert-block
    background-color #ececec
    padding 10px
    margin 5px 0
    color #6c757d

    a
      color main-purple

  .topicpage-history
    margin 30px 0

    h4
      margin-bottom 20px
      padding 0 10px

    .topicpage-history-event
      display flex
      margin-bottom 15px
      line-height 30px
      background-color #f8f9fa
      padding 10px

      .time
        width 120px
        color #6c757d
        font-size 12px

      .event
        width 100px
        text-align center
        color #6c757d

      .name
        margin-left 10px

</style>
