<template>
  <topic-page-template>
    <template v-slot:content>
      <div class="topicpage-edit">
        <spinner :show="loading"/>
        <div v-if="!editPermission.canEdit" class="no-edit">Can't edit this Topic. <br>{{editPermission.msg}}</div>
        <div v-if="editPermission.canEdit && topicData._id" class="topic-page">
        
          <div class="topicpage-header">
            <h1 class="header-title">{{topicData.name}} 
              <button @click="previewEdit" class="button-secundary button-preview">{{buttonPreviewText}}</button>
            </h1>
            <ImageEditThumb
              v-if="showThumb"
              :class="['topic-logo', !isPreviewing ? 'topic-logo-edit' : '']"
              :edit="!isPreviewing"
              :crop="true"
              :sizeLimit="100"
              v-model="topicPageData.logo"
              placeholder="Topic logo" />
          </div>

          <topic-page-maintainer :user="topicData.maintainer" />

          <div v-if="isPreviewing" class="content-block" v-html="htmlContent"></div>

          <content-editor
            v-show="!isPreviewing"
            v-model="topicPageData.content" 
            ref="editor"
          />

          <button v-show="!isPreviewing" @click="save" :disabled="saving" class="button-submit button-save">
            <spinner :show="saving"></spinner>
            Save
          </button>

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
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import Spinner from '@/components/Spinner';
import { TopicPageTemplate, TopicPageMaintainer } from '@/views/topic';
import ContentEditor from '@/components/contentEditor/ContentEditor'
import Avatar from '@/components/Avatar'
import { ImageEditThumb } from '@/components/ImageEdit'

export default {
  name: 'topicpage-edit',
  components: {
    Spinner,
    TopicPageMaintainer,
    TopicPageTemplate,
    ContentEditor,
    Avatar,
    ImageEditThumb
  },
  beforeMount () {
    this.loadTopic()
  },
  data () {
    return {
      loading: false,
      saving: false,
      topicData: {},
      topicPageData: {},
      isPreviewing: false,
      htmlContent: ''
    }
  },
  computed: {
    editPermission () {
      if (!this.topicData || !this.$store.state.me || !this.$store.state.me._id) return { canEdit: true }
      if (!this.topicData.maintainer || !this.topicData.maintainer._id) {
        return { canEdit: false, msg: 'This topic has no maintainer.' }
      }
      if (this.topicData.maintainer._id !== this.$store.state.me._id) {
        return { canEdit: false, msg: 'No permission to edit.' }
      }
      return { canEdit: true }
    },

    editor () {
      return this.$refs.editor;
    },

    buttonPreviewText () {
      return !!this.isPreviewing ? 'Edit' : 'Preview'
    },

    showThumb () {
      if (this.topicPageData.logo) return true
      if (!this.topicPageData.logo && !this.isPreviewing) return true
      return false
    }
  },
  methods: {
    ...mapActions(['getTopicPageEdit', 'saveTopicPage']),

    loadTopic () {
      this.loading = true
      this.getTopicPageEdit(this.$route.params.slug).then((data) => {
        this.topicData = data.topic
        data.topicPage.history.sort((o1, o2) => {
          return o1.dateCreated >= o2.dateCreated ? -1 : 1;
        });
        this.topicPageData = data.topicPage
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

    setPreviewMode () {
      this.htmlContent = this.getHTML()
      this.$nextTick(() => {
        this.isPreviewing = true
      })
    },

    save () {
      this.saving = true

      const saveData = {
        slug: this.topicData.slug,
        data: {
          content: this.topicPageData.content,
          logo: this.topicPageData.logo,
          event: 'edit'
        }
      }

      this.saveTopicPage(saveData).then((response) => {
        this.$toasted.success('Saved!', { duration : 4000 })
        this.loadTopic()
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    },

    dateFormat (date) {
      if (moment().isSame(date, 'day')) return moment(date).format('[Today, ]HH[h]mm')
      return moment(date).format('MMMM Do, YYYY')
    },

    getHistoryEvent (event) {      
      if (event === 'edit') return 'Edited'
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
    
    .spinner
      margin: 0 auto;
      display block
    
    .no-edit
      padding 20px
      text-align center
      font-size 22px
    
    .button-save
      display block
      margin 20px auto
      width 120px
      
    .button-secundary
      background-color inherit
      border 1px solid #222
      padding 7px 10px
      font-size 12px
      color #222
      border-radius 30px
    
    .button-secundary:hover
      outline none

    .button-secundary:focus
      outline none
    
    .button-preview
      width 80px
      margin-left 10px

    .button-submit

      .spinner
        width 22px
        height 22px
        display inline-block

        >>> circle
          stroke #ffffff

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
