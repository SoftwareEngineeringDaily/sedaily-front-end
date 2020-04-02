<template>
  <div class="image-edit-thumb" :style="getSize" >
    <div v-if="saving" class="saving"><spinner :show="saving"/></div>
    <img v-if="imgSrc" :src="imgSrc" :style="getSize"/>
    <template v-else>{{placeholder}}</template>
    <button v-if="edit" :disabled="saving" class="action" @click="onClickChange">
      {{buttonText}}
    </button>
    <input
      v-if="edit"
      :accept="mimes"
      ref="input"
      type="file"
      @change="onInputChange"
    >
  </div>
</template>

<script>
import spinner from '@/components/Spinner';

export default {
  name: 'image-edit-thumb',
  components: {
    spinner
  },
  props: {
    value: {
      type: String
    },
    src: {
      type: String
    },
    saving: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'Change'
    },
    edit: {
      type: Boolean,
      default: true
    },
    crop: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: Number,
    },
    maxHeight: {
      type: Number,
    },
    size: {
      type: Object,
    },
    sizeLimit: {
      type: Number,
    },
    mimes: {
      type: String,
      default: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
    },
  },
  data () {
    return {
      fileData: {
        dataUrl: null,
        type: null,
        filename: null,
        width: null,
        height: null,
      },
    }
  },
  computed: {
    imgSrc () {
      return this.fileData.dataUrl || this.value || this.src
    },
    getSize () {
      if (this.maxWidth || this.maxHeight) return { width: '100%' }

      if (this.fileData && this.fileData.width) {
        return {
          width: `${this.fileData.width}px`,
          height: `${this.fileData.height}px`
        }
      }
      if (this.sizeLimit) {
        return {
          width: `${this.sizeLimit}px`,
          height: `${this.sizeLimit}px`
        }
      }
      const squareSize = (this.size.width || this.size.height) ? `${this.size.width || this.size.height}px` : undefined
      return {
        width: squareSize,
        height: squareSize,
      }
    }
  },
  methods: {
    onClickChange () {
      this.$refs.input.click()
    },

    onInputChange (e) {
      const file = e.target.files[0]
      if (!file) return
      this.readFile(file, (error, data) => {
        if (error) return this.$toasted.error('Error reading file', { duration : 0 })
        this.handleUploadInput(data, file) 
      })
    },

    handleUploadInput (data, file) {
      if (!this.crop) {
        this.setFileData(data) //TODO width height
        this.returnImage()
        this.emitFile(file)
      }
      else this.cropImage(data)
    },

    setFileData (data) {
      this.fileData.dataUrl = data.dataUrl
      this.fileData.type = data.type
      this.fileData.filename = data.filename
      this.fileData.width = data.width
      this.fileData.height = data.height
    },

    // for use with v-model in parent (no file, just base64 data)
    returnImage () {
      this.$nextTick(() => {
        this.$emit('input', this.fileData.dataUrl)
      })
    },

    emitFile (file) {
      this.$emit('onChangeFile', file)
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

      const computedWidth = this.maxWidth || this.sizeLimit || this.size.width || undefined
      const computedHeight = (this.size) ? this.size.height : undefined

      if (computedWidth) {        
        if (img.width >= img.height) {
          height *= computedWidth / img.width;
          width = computedWidth;
        }
        if (img.width < img.height) {
          height = computedWidth
          width *= computedWidth / img.height;
        }
      }
      if (computedHeight) {
        if (img.width < img.height) {
          height = computedHeight
          width *= computedHeight / img.height;
        }
        if (img.width >= img.height) {
          width *= computedHeight / img.width;
          height = computedHeight;
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
          this.readFile(file, (error, data) => {
            if (error) return this.$toasted.error('Error reading file', { duration : 0 })
            this.setFileData({ ...data, width, height })
            this.returnImage()
            this.emitFile(file)
          })
        }, data.type, 1);
      }
    }
  },
}

</script>

<style scoped lang="stylus">
  .image-edit-thumb
    display flex
    align-items center
    justify-content center
    color #888
    font-weight 600
    min-height 100px
    position relative

    .saving
      background-color #cecece
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      margin auto
      opacity .8
      display flex
      align-items center
      justify-content center

    .action
      position absolute
      background #f5f5f5
      bottom 0
      width 100%
      text-align center
      padding 5px
      font-size 12px
      color #222
      border 1px solid #f5f5f5
      outline 1px solid #f5f5f5
      opacity .4

      &:hover
        opacity .8
    
    input
      display none
</style>
