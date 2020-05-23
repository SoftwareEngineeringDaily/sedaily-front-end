<template>
  <div v-show="show" class="content-editor-image-toolbar">
    <div v-show="loading" class="spinner-container">
      <spinner :show="loading"/>
    </div>

    <div class="buttons-toolbar">
      <button @click="insertEditorImage" :disabled="!selectedImage">Insert</button>
      <button @click="deleteEditorImage" :disabled="!selectedImage">
        <i data-v-b44cbf3e="" class="fa fa-trash"></i> Delete
      </button>
    </div>

    <div class="thumb-container">
      <button class="action" @click="onClickFromURL">FROM URL</button>
      <button class="action" :disabled="saving" @click="onClickUploadNew">
        <div v-show="saving" class="spinner-container">
          <spinner :show="saving"/>
        </div>
        UPLOAD NEW
      </button>

      <div v-for="image in images" :key="image._id" :class="{ 'image-cell': true, selected: image.selected}">
        <div
          class="image"
          :style="{ 'background-image': `url(${image.url})`}"
          @click="onClickImage(image)"
        >
        </div>
      </div>
    </div>
    <input
      :accept="mimes"
      ref="input"
      type="file"
      @change="onInputChange"
    >
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'content-editor-image-toolbar',
  components: {
    Spinner
  },
  data () {
    return {
      show: false,
      loading: true,
      saving: false,
      mimes: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',
      crop: true,
      sizeLimit: 660,
      images: []
    }
  },
  beforeMount () {
    this.loadImages()
  },
  computed: {
    selectedImage() {
      return this.images.find(img => img.selected)
    }
  },
  methods: {
    ...mapActions(['getTopicPageImages', 'saveTopicPageImage', 'deleteTopicPageImage']),

    setShow (val = !this.show) {
      this.show = !!val
    },

    loadImages () {
      this.loading = true
      this.getTopicPageImages(this.$route.params.slug).then((data) => {
        this.images = data.map(img => { img.selected = false; return img })
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.loading = false
        if (this.$refs.input) this.$refs.input.value = ''
      })
    },

    onClickFromURL () {
      this.$emit('action', { method: 'editorReplaceSelection', value: '![](http://)' })
    },

    onClickUploadNew () {
      this.$refs.input.click()
    },

    onClickImage(image) {
      this.images.forEach(img => {
        if (img._id === image._id) image.selected = !image.selected
        else img.selected = false
      })
    },

    insertEditorImage() {
      this.$emit('action', { method: 'editorReplaceSelection', value: `![Image](${this.selectedImage.url})` })
    },

    deleteEditorImage() {
      this.loading = true
      this.deleteTopicPageImage({ slug: this.$route.params.slug, imageId: this.selectedImage._id} ).then((data) => {
        this.loadImages()
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onInputChange (e) {
      const file = e.target.files[0]
      if (!file) return
      this.readFile(file, (error, data) => {
        if (error) return this.$toasted.error('Error reading file', { duration : 0 })
        this.handleUploadInput(data)
      })
    },

    handleUploadInput (data) {
      this.cropImage(data)
    },

    saveImage (file) {
      this.saving = true
      this.saveTopicPageImage({slug: this.$route.params.slug, file }).then(() => {
        this.loadImages()
      }).catch((e) => {
        this.$toasted.error((e && e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    },

    readFile (file, callback) {
      const reader = new FileReader()
      reader.onerror = error => callback(error)
      reader.onload = e => {
        const data = {
          dataUrl: e.target.result,
          type: file.type,
          filename: file.name || 'unknown'
        }
        callback(null,data)
      }
      reader.readAsDataURL(file)
    },

    getNewSize (img) {
      let width = img.width
      let height = img.height

      if (this.sizeLimit < img.width) {
        if (img.width >= img.height) {
          height *= this.sizeLimit / img.width;
          width = this.sizeLimit;
        }
        if (img.width < img.height) {
          height = this.sizeLimit
          width = this.sizeLimit / img.height;
        }
      }

      return { width, height }
    },

    cropImage (data) {
      const img = new Image();
      img.src = data.dataUrl;

      img.onload = () => {
        const { width, height } = this.getNewSize(img)
        const elem = document.createElement('canvas');
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob((blob) => {
          const file = new File([blob], data.filename, {
            type: data.type,
            lastModified: Date.now()
          });
          this.saveImage(file)
        }, data.type, 1);
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~@/css/variables'

  .content-editor-image-toolbar
    border-top 1px solid #ddd
    border-left 1px solid #ddd
    border-right 1px solid #ddd
    background-color #fbfbfb
    position relative

    .spinner-container
      position absolute
      top 0
      left 0
      z-index 1
      width 100%
      height 100%
      display flex
      background-color #ffffff
      opacity .8

      .spinner
        margin auto
        display: block
        width 40px
        height 40px

    .buttons-toolbar
      padding 2px
      text-align center

      button
        background-color inherit
        border 0
        padding 5px 10px
        font-size 12px
        color #222
        border-radius 30px

      button:hover
        outline none

      button:focus
        outline none

      button:disabled
        color #cecece

    .thumb-container
      position relative
      display flex
      height 120px
      overflow-x scroll
      overflow-y hidden
      padding 0 10px 10px 10px

      .action
        background #f5f5f5
        height 100px
        text-align center
        font-size 12px
        color #222
        border 2px solid #f5f5f5
        outline 0px solid #f5f5f5
        margin-right 5px
        position relative
        flex: 0 0 100px;

      .image-cell
        margin-right 5px
        background #f5f5f5
        border 2px solid #f5f5f5
        width 100px
        height 100px
        cursor pointer

        .image
          width 96px
          height 100%
          background-repeat no-repeat
          background-position center center
          background-size contain

      .image-cell.selected
        border 2px solid main-purple


    input
      display none

</style>
