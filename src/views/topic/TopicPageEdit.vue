<template>
  <div class="topicpage-edit">
    <Spinner :show="loading"/>
    <div v-if="!editPermission.canEdit" class="no-edit">Can't edit this Topic. <br>{{editPermission.msg}}</div>
    <div v-if="editPermission.canEdit && topicData._id" class="topic-page">
      
      <div class="topicpage-toolbar">
        <h1 class="header-title">{{topicData.name}}</h1>
        <div class="mode-status">
          <button @click='previewEdit' class="button-secundary button-preview">{{buttonPreviewText}}</button>
        </div>
        <div class="right">
          <button @click='save' :disabled="saving" class="button-submit">
            <spinner :show="saving"></spinner>
            Save
          </button>
        </div>
      </div>

      <div class="topicpage-maintainer">
        <Avatar width="60px" :user="topicData.maintainer" />
        Maintained by {{topicData.maintainer.name}}
      </div>

      <div v-if="isPreviewing" class="topicpage-content" v-html="htmlContent"></div>

      <vue-simplemde 
        v-if="!isPreviewing"
        v-model="topicPageData.content" 
        ref="editor"
        :configs="editorConfig"
        @input="handleInput" 
      />

      <div v-if="!isPreviewing" class="topicpage-history">
        <h4>Activities</h4>
        <div class="topicpage-history-event" v-for="event in topicPageData.history" :key="event._id">
          <div class="time">{{dateFormat(event.dateCreated)}}</div>
          <div class="event"> {{getHistoryEvent(event.event)}}</div>
          <Avatar width="30px" :user="event.user" />
          <div class="name"> {{event.user.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
// import { debounce } from 'lodash'
import Spinner from "@/components/Spinner.vue";
import VueSimplemde from 'vue-simplemde'
import Avatar from '@/components/Avatar'

export default {
  name: 'topicpage-edit',
  components: {
    Spinner,
    VueSimplemde,
    Avatar
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
      htmlContent: '',
      editorConfig: {
        status: false,
        spellChecker: false,
        uploadImage: true,
        // hideIcons: ['side-by-side'],
        // TODO: upload images
        // toolbar: ['bold', {
        //     name: "image-import",
        //     action: () => { console.log('action') },
        //     className: "fa fa-picture-o",
        //     title: "Image",
        // }]
      }
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
      return this.$refs.editor.simplemde;
    },

    buttonPreviewText () {
      return !!this.isPreviewing ? 'Edit' : 'Preview'
    }
  },
  methods: {
    ...mapActions(['getTopicPage', 'saveTopicPage']),

    loadTopic () {
      this.loading = true
      this.getTopicPage(this.$route.params.slug).then((data) => {
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

    handleInput (content) {
      
    },

    getHTML () {
      return this.editor.markdown(this.topicPageData.content)
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
      const day = moment(date);
      if (day.format('YYYYMMDD') === moment().format('YYYYMMDD')) return moment(date).format('[Today, ]HH[h]mm')
      return moment(date).format('MMMM Do, YYYY')
    },

    getHistoryEvent (event) {
      switch (event) {
        case 'edit': return 'Edited'
      }
      return ''
    }

  }
}
</script>

<style scoped lang="stylus">
  @import '../../css/variables'
  @import '~simplemde/dist/simplemde.min.css';

  .topicpage-edit
    .spinner
        margin: 0 auto;
        display: inherit;
    
    .no-edit
      padding 20px
      text-align center
      font-size 22px
    
    .topicpage-toolbar
      display flex
      align-items center

      .mode-status
        flex 1
        padding 0 20px
        color #999
        font-size 18px
        font-weight 800
      

    .header-title
      margin 15px 0
      font-weight 800
      font-size 2.7rem
    
    .topicpage-maintainer
      font-size 16px
      margin 20px 0
    
    >>> .fullscreen, 
    >>> .CodeMirror-fullscreen, 
    >>> .editor-preview-active-side
      z-index 11000
    
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

    .button-submit

      .spinner
        width 22px
        height 22px

        >>> circle
          stroke #ffffff

    .topicpage-content
      margin-top 20px
    
    .topicpage-history
      margin-top 30px

      .topicpage-history-event
        display flex
        margin-bottom 15px
        line-height 30px
        background-color #f8f9fa
        padding 10px

        .time
          width 100px
          // text-align center
          color #6c757d
          font-size 12px
        
        .event
          width 100px
          text-align center
          color #6c757d
        
        .name
          margin-left 10px

</style>
