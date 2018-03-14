
<template>
  <div
    :id="id"
    class="modal fade"
    role="dialog">
    <div
      class="modal-dialog"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"> Application for {{ title }} </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form enctype="multipart/form-data">
            <div class="form-group">
              <textarea
                v-validate="'required'"
                v-model="coveringLetter"
                :disabled="applySucceeded"
                class="form-control"
                rows="10"
                cols="120"
                placeholder="Cover Letter"
                name="coveringLetter" />
            </div>
            <div
              v-show="errors.has('coveringLetter')"
              class="row alert alert-danger">
              {{ errors.first('coveringLetter') }}
            </div>
            <div class="form-group">
              <label for="resumeInput">Resume (PDF)</label>
              <input
                v-validate="'required|ext:pdf|size:1024'"
                id="resumeInput"
                :disabled="applySucceeded || loading"
                name="resume"
                type="file"
                class="form-control-file"
                accept="application/pdf"
                @change="onFileChange">
            </div>
            <!--TODO: determine why error shows after selecting file until users clicks in modal -->
            <div
              v-show="errors.has('resume') && error"
              class="row alert alert-danger">
              {{ errors.first('resume') }}
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div
            v-if="error"
            class="bg-danger">
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
            @click.prevent="submit">Submit Application</button>
          <spinner :show="loading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    Spinner
  },
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
    async submit () {
      const valid = await this.$validator.validateAll()

      if (valid) {
        this.loading = true
        this.error = null
        const { jobId, coveringLetter, resume } = this

        try {
          await this.applyToJob({ jobId, coveringLetter, resume })
          this.applySucceeded = true
        } catch (err) {
          this.error = err.response.data.message
        }

        this.loading = false
      } else {
        this.error = 'Invalid fields on form'
      }
    }
  }
}
</script>
