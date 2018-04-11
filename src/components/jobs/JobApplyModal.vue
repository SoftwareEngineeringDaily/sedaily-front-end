
<template>
  <div class="modal fade" role="dialog" v-bind:id="id">
    <div class="modal-dialog" role="document">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title"> Application for {{ title }} </h5>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
           <span aria-hidden="true">&times;</span>
         </button>
       </div>
       <div class="modal-body">
        <form enctype="multipart/form-data">
          <div class="form-group">
             <textarea
               class="form-control"
               rows="10"
               cols="120"
               placeholder="Cover Letter"
               name="coveringLetter"
               v-model="coveringLetter"
               v-validate="'required'"
               :disabled="applySucceeded"
             ></textarea>
          </div>
          <div
              class="row alert alert-danger"
              v-show="errors.has('coveringLetter')">
              {{ errors.first('coveringLetter') }}
          </div>
          <div class="form-group">
            <label for="resumeInput">Resume (PDF)</label>
            <input
              type="file"
              class="form-control-file"
              id="resumeInput"
              accept="application/pdf"
              @change="onFileChange"
              name="resume"
              v-validate="'required|ext:pdf|size:1024'"
              :disabled="applySucceeded || loading"
            >
          </div>
          <!--TODO: determine why error shows after selecting file until users clicks in modal -->
          <div
            class="row alert alert-danger"
            v-show="errors.has('resume') && error">
            {{ errors.first('resume') }}
          </div>
        </form>
       </div>
       <div class="modal-footer">
         <div v-if="error" class="bg-danger">
           Error: {{ error }}
         </div>
          <button
            v-if="applySucceeded"
            class="btn btn-success"
            data-dismiss="modal"
          >Application Succeeded! (Click to Close)
          </button>
          <button
              v-else
              class="btn button-submit"
              @click.prevent="submit"
            >Submit Application
          </button>
         <spinner :show="loading"></spinner>
       </div>
     </div>
    </div>
  </div>
</template>

<script>
import Spinner from 'components/Spinner'
import { mapActions } from 'vuex'

export default {
  name: 'job-apply-modal',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    jobId: {
      type: String,
      required: true
    }
  },
  components: {
    Spinner
  },
  data () {
    return {
      coveringLetter: '',
      resume: null,
      applySucceeded: false,
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions(['applyToJob']),
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.resume = null
        return
      }
      this.resume = files[0]
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          this.error = null
          const { jobId, coveringLetter, resume } = this
          return this.applyToJob({ jobId, coveringLetter, resume })
            .then(() => {
              this.applySucceeded = true
            })
            .catch((error) => {
              this.error = error.response.data.message
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.error = 'Invalid fields on form'
        }
      })
    }
  }
}
</script>

