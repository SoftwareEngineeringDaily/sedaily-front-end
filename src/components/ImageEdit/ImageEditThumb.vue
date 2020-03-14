<template>
  <div class="image-edit-thumb" :style="getSize" >
    <img v-if="value" :src="value" :style="getSize"/>
    <template v-else>{{placeholder}}</template>
    <button v-if="edit" class="action" @click="onClickChange">
      Change
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

export default {
  name: 'image-edit-thumb',
  props: {
    value: {
      type: String
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
    getSize () {
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
      return {
        width: (this.size.width || this.size.height) ? `${this.size.width || this.size.height}px` : undefined,
        height: (this.size.width || this.size.height) ? `${this.size.width || this.size.height}px` : undefined,
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
        this.handleUploadInput(data) 
      })
    },

    handleUploadInput (data) {
      if (!this.crop) {
        this.setFileData(data) //TODO width height
        this.returnImage()
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

    returnImage () {
      this.$nextTick(() => {
        this.$emit('input', this.fileData.dataUrl)
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

      const computedWidth = this.sizeLimit || this.size.width || undefined
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
    position relative

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
      opacity .8
    
    input
      display none
</style>
