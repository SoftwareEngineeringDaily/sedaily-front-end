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
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import VueSimplemde from 'vue-simplemde'

export default {
  name: 'content-editor',
  components: {
    Spinner,
    VueSimplemde,
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
  beforeMount () {
    this.content = this.value
  },
  computed: {
    editor () {
      return this.$refs.editor.simplemde;
    }
  },
  methods: {
    onContentChange () {
      this.$emit('input', this.content)
    },

    getHTML () {
      return this.editor.markdown(this.value)
    },

    editorReplaceSelection (content) {
      this.editor.codemirror.doc.replaceSelection(content)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../css/variables'
  @import '~simplemde/dist/simplemde.min.css';

  .content-editor
    margin-top 5px
    
    .spinner
        margin: 0 auto;
        display: inherit;
    
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
