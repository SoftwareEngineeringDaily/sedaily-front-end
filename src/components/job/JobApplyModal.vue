<template>
  <div class="modal-jobapply">
    <modal
      v-show="isModalVisible"
      :showCloseBtn="true"
      @close="onClose">

      <h4 slot="header">Application for {{ title }}</h4>

      <template slot="body">
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
              :disabled="applySucceeded" />
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
              :disabled="applySucceeded || loading" />
          </div>

          <div
            class="row alert alert-danger"
            v-show="errors.has('resume') && error">
            {{ errors.first('resume') }}
          </div>
        </form>
      </template>

      <template slot="footer">
        <div v-if="error" class="bg-danger">
          Error: {{ error }}
        </div>

        <button
          type="button"
          class="btn-modal-secondary"
          @click="onClose">
          Cancel
        </button>

        <button
          v-if="applySucceeded"
          class="btn btn-success"
          data-dismiss="modal"
          @click="onClose">
          Application Succeeded! (Click to Close)
        </button>

        <button
          v-else
          class="btn button-submit"
          @click.prevent="submit">
          Submit Application
        </button>
        <spinner :show="loading"></spinner>
      </template>

    </modal>

    <slot />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Spinner from '@/components/Spinner'
import Modal from '@/components/ModalComponent'

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
    },
    isModalVisible: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
    },
  },

  components: {
    Spinner,
    Modal,
  },

  data () {
    return {
      coveringLetter: '',
      resume: null,
      applySucceeded: false,
      loading: false,
      error: null,
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
              Sentry.captureException(error)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.error = 'Invalid fields on form'
          Sentry.captureMessage(error)
        }
      })
    }
  }
}
</script>

<style scope lang="stylus">
.btn-modal-secondary
  background-color none
  color #222
  margin-right 5px
  padding 5px
  border none
  outline none

</style>
