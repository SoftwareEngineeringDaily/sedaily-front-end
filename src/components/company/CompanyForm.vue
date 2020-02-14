<template>
  <div>

    <h4 class="row" >{{ header }}</h4>
    <form>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Company Name</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          @blur="companyNameBlur"
          placeholder="Company Name"
          id="companyNameInput"
          name="companyName"
          v-model="companyFormData.companyName"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="Description"
          id="descriptionInput"
          name="description"
          v-model="companyFormData.description"
          >
        </div>
      </div>

      <div class="form-group row">
        <div v-if="companyFormData.imageUrl">
          <img :src="companyFormData.imageUrl" />
        </div>

        <div class="form-group">
            <h2>Select an image</h2>
            <input type="file" @change="onFileChange">
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">External Url:</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="https://company.com"
          id="externalUrlInput"
          name="externalUrl"
          v-model="companyFormData.externalUrl"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Local Url:</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="some-company"
          id="localUrlInput"
          name="localUrl"
          v-model="companyFormData.localUrl"
          >
        </div>
      </div>
    </form>
    <button
    class=""
    v-on:click="submit">
    Submit
  </button>
  <button v-if="deleteCallback" @click="deleteCallback">
    Delete
  </button>
  <br />
  <br />
  <p> Jobs will appear here after typing in the company name & pressing tab & pressing tab.</p>

  <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
    <job-summary v-for="job in jobs" :key="job._id" :job="job">
    </job-summary>
  </div>
  </div>
</template>

<script>
import JobSummary from '@/components/job/JobSummary'
import { mapActions } from 'vuex'
export default {
  name: 'company-form',
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
      required: false
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
      reader.readAsDataURL(file)
    },

    removeImage (e) {
      this.file = null
      // this.companyFormData.imageUrl = null
    },

    companyNameBlur () {
      const companyName = this.companyFormData.companyName


      return this.jobsSearch({ companyName })
        .then((jobs) => {
          this.jobs = jobs
        })
        .catch(() => {
          this.$toasted.error('There was an error searching jobs for that company name.', { 
              singleton: true,
              theme: "bubble", 
              position: "bottom-center", 
              duration : 700
          })
        })
    },
    submit () {
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
