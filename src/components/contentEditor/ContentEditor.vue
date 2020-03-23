<template>
  <div class="content-editor">
    <Spinner :show="loading"/>
    <vue-simplemde
      v-show="!loading"
      v-model="content"
      ref="editor"
      :configs="editorConfig"
      @input="onContentChange"
    />
    <content-editor-image-toolbar ref="imageToolbar" @action="onImageAction" />
  </div>
</template>

<script>
import Vue from 'vue'
import Spinner from '@/components/Spinner.vue'
import VueSimplemde from 'vue-simplemde'
import ContentEditorImageToolbar from './ContentEditorImageToolbar'

const toolbarIcons = ['bold','italic','strikethrough', '|', 'heading-smaller', 'heading-bigger', '|', 'code', 'quote', 'unordered-list', 'ordered-list', 'clean-block', 
  'link', 'table' , '|', 'fullscreen', 'guide', '|']

export default {
  name: 'content-editor',
  components: {
    Spinner,
    VueSimplemde,
    ContentEditorImageToolbar
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      content: '',
      editorConfig: {
        status: false,
        spellChecker: false,
        uploadImage: true,
        toolbar: [ ...toolbarIcons,  {
            name: "image-import",
            action: this.goAddImage,
            className: "fa fa-picture-o",
            title: "Image",
        }]
      }
    }
  },
  beforeMount () {
    this.content = this.value
  },
  mounted () {
    this.moveImageToolbar()
  },
  computed: {
    editor () {
      return this.$refs.editor.simplemde;
    }
  },
  methods: {

    moveImageToolbar () {
      // move the element of imageToolbar to between editor elements
      this.$el.querySelector('.vue-simplemde .editor-toolbar').insertAdjacentElement('afterend',this.$refs.imageToolbar.$el);
    },

    onContentChange () {
      this.$emit('input', this.content)
    },

    getHTML () {
      return this.editor.markdown(this.value)
    },

    onImageAction (options) {
      if (!options.method) return
      if (!this[options.method]) return

      this[options.method].apply(this, [options.value])
    },

    editorReplaceSelection (content) {
      this.editor.codemirror.doc.replaceSelection(content)
    },

    goAddImage () {
      this.$refs.imageToolbar.setShow()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../css/variables'
  @import '~simplemde/dist/simplemde.min.css'

  .content-editor
    margin-top 5px
    
    .spinner
        margin 0 auto
        display inherit
    
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
    
</style>
