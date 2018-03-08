<template>
  <div>

    <h4 class="row" >{{ header }}</h4>
    <form>

      <div class="form-group row">
        <label
          for="companyNameInput"
          class="col-sm-2 col-form-label">Company Name</label>
        <div class="col-sm-10">
          <input
            id="companyNameInput"
            v-model="companyFormData.companyName"
            class="form-control"
            type="text"
            placeholder="Company Name"
            name="companyName"
            @blur="companyNameBlur">
        </div>
      </div>

      <div class="form-group row">
        <label
          for="companyNameInput"
          class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <input
            id="descriptionInput"
            v-model="companyFormData.description"
            class="form-control"
            type="text"
            placeholder="Description"
            name="description">
        </div>
      </div>

      <div class="form-group row">
        <div v-if="companyFormData.imageUrl">
          <img :src="companyFormData.imageUrl" >
        </div>

        <div class="form-group">
          <h2>Select an image</h2>
          <input
            type="file"
            @change="onFileChange">
        </div>
      </div>

      <div class="form-group row">
        <label
          for="companyNameInput"
          class="col-sm-2 col-form-label">External Url:</label>
        <div class="col-sm-10">
          <input
            id="externalUrlInput"
            v-model="companyFormData.externalUrl"
            class="form-control"
            type="text"
            placeholder="https://company.com"
            name="externalUrl" >
        </div>
      </div>

      <div class="form-group row">
        <label
          for="companyNameInput"
          class="col-sm-2 col-form-label">Local Url:</label>
        <div class="col-sm-10">
          <input
            id="localUrlInput"
            v-model="companyFormData.localUrl"
            class="form-control"
            type="text"
            placeholder="some-company"
            name="localUrl" >
        </div>
      </div>
    </form>
    <button
      class=""
      @click="submit">
      Submit
    </button>
    <button
      v-if="deleteCallback"
      @click="deleteCallback">
      Delete
    </button>
    <br>
    <br>
    <div> Jobs will appear here after typing in the company name &amp; pressing tab &amp; pressing tab.</div>

    <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
      <job-summary
        v-for="job in jobs"
        :key="job._id"
        :job="job" />
    </div>
  </div>
</template>

<script>
import JobSummary from '@/components/JobSummary.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    JobSummary
  },
  props: {
    header: {
      type: String,
      required: true
    },
    submitCallback: {
      type: Function,
      required: true
    },
    deleteCallback: {
      type: Function,
      required: false,
      default: () => {}
    },
    companyData: {
      type: Object,
      default: function () {
        return {
          companyName: '',
          description: '',
          imageUrl: null,
          externalUrl: '',
          localUrl: ''

        }
      }
    }
  },
  data () {
    return {
      file: null,
      companyFormData: this.companyData,
      jobs: []
    }
  },
  // but update from parent also, e.g. if route changes
  watch: {
    companyData: function () {
      this.companyFormData = this.companyData
      this.companyNameBlur()
    }
  },
  methods: {
    ...mapActions(['jobsSearch', 'companiesUploadImage']),
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.file = null
        return
      }
      const file = files[0]
      this.file = file
      this.createImage(file)
    },

    createImage (file) {
      var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.companyFormData.imageUrl = e.target.result
      }
      console.log(image)
      reader.readAsDataURL(file)
    },

    removeImage (e) {
      this.file = null
      // this.companyFormData.imageUrl = null
    },

    companyNameBlur () {
      const companyName = this.companyFormData.companyName
      console.log(companyName)

      return this.jobsSearch({ companyName })
        .then((jobs) => {
          console.log('jobs', jobs)
          this.jobs = jobs
        })
        .catch(() => {
          this.$toast.error('There was an error searching jobs for that company name.')
        })
    },
    submit () {
      console.log('Submitting')
      console.log(this.companyFormData)
      var vm = this
      if (this.file) {
        return this.companiesUploadImage({ imageFile: this.file })
          .then((imageSuccess) => {
            this.companyFormData.imageUrl = imageSuccess.imageUrl
            return vm.submitCallback(this.companyFormData)
          })
      } else {
        return this.submitCallback(this.companyFormData)
      }
    }
  }
}
</script>
