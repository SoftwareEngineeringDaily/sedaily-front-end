
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <h4 class="row" >{{ header }}</h4>
        <br>
        <form>
          <div class="form-group row">
            <label
              for="companyNameInput"
              class="col-sm-2 col-form-label">Company</label>
            <div class="col-sm-10">
              <input
                v-validate="'required'"
                id="companyNameInput"
                v-model="jobFormData.companyName"
                class="form-control"
                type="text"
                placeholder="Company/Employer"
                name="companyName"
              >
            </div>
            <div
              v-show="errors.has('companyName')"
              class="col-sm-10 offset-sm-2 alert alert-danger">
              {{ errors.first('companyName') }}
            </div>
          </div>
          <div class="form-group row">
            <label
              for="locationInput"
              class="col-sm-2 col-form-label">Location</label>
            <div class="col-sm-6">
              <input
                v-validate="'required'"
                id="locationInput"
                v-model="jobFormData.location"
                class="form-control"
                type="text"
                placeholder="City, State, Country OR Worldwide"
                name="location"
              >
            </div>
            <div
              v-show="errors.has('location')"
              class="hidden-sm-up alert alert-danger">
              {{ errors.first('location') }}
            </div>
            <div class="form-check mt-1 col-sm-4">
              <label class="form-check-label">
                <input
                  v-model="jobFormData.remoteWorkingConsidered"
                  class="form-check-input"
                  type="checkbox"
                  name="remoteWorkingConsidered"
                > Remote Ok?
              </label>
            </div>
            <div
              v-show="errors.has('location')"
              class="hidden-xs-down col-sm-6 offset-sm-2 alert alert-danger">
              {{ errors.first('location') }}
            </div>
          </div>
          <div class="form-group row">
            <label
              for="titleInput"
              class="col-sm-2 col-form-label">Title</label>
            <div class="col-sm-10">
              <input
                v-validate="'required'"
                id="titleInput"
                v-model="jobFormData.title"
                class="form-control"
                type="text"
                placeholder="Job Title"
                name="title"
              >
            </div>
            <div
              v-show="errors.has('title')"
              class="col-sm-10 offset-sm-2 alert alert-danger">
              {{ errors.first('title') }}
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Type</label>
            <div class="col-sm-8 mt-1">
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input
                    v-validate.employmentType="'required'"
                    v-model="jobFormData.employmentType"
                    class="form-check-input"
                    type="radio"
                    name="employmentType"
                    value="Permanent"
                  > Permanent
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input
                    v-validate.employmentType="'required'"
                    v-model="jobFormData.employmentType"
                    class="form-check-input"
                    type="radio"
                    name="employmentType"
                    value="Contract"
                  > Contract
                </label>
              </div>
              <div
                v-show="errors.has('employmentType')"
                class="row alert alert-danger">
                {{ errors.first('employmentType') }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <textarea
              v-validate="'required'"
              v-model="jobFormData.description"
              class="form-control"
              rows="10"
              cols="120"
              placeholder="Job Description"
              name="description" />
            <div
              v-show="errors.has('description')"
              class="row alert alert-danger">
              {{ errors.first('description') }}
            </div>
          </div>
          <div class="form-group row">
            <label
              for="applicationEmailAddressInput"
              class="col-sm-2 col-form-label">Apply-to Email</label>
            <div class="col-sm-10">
              <input
                v-validate="'required|email'"
                id="applicationEmailAddressInput"
                v-model="jobFormData.applicationEmailAddress"
                class="form-control"
                type="email"
                placeholder="recruiting@company.com"
                name="applicationEmailAddress"
              >
            </div>
            <div
              v-show="errors.has('applicationEmailAddress')"
              class="col-sm-10 offset-sm-2 alert alert-danger">
              {{ errors.first('applicationEmailAddress') }}
            </div>
          </div>
          <div class="form-group row">
            <div class="pl-2 col-4">
              <button
                class="btn button-submit"
                @click.prevent="submit"
              >
                <span v-if="editingJob">Update</span>
                <span v-else>Post</span>
              </button>
            </div>
            <div
              v-if="editingJob"
              class="col-4 offset-4">
              <button
                class="btn button-delete"
                @click.prevent="del"
              >
                Delete
              </button>
            </div>
          </div>
          <div class="row">
            <spinner :show="loading" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Spinner
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      required: true
    },
    editingJob: {
      type: Boolean,
      default: false
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
    jobData: {
      type: Object,
      default: function () {
        return {
          title: '',
          description: '',
          employmentType: '',
          location: '',
          remoteWorkingConsidered: false,
          receivingEmail: '',
          companyName: '',
          tags: []
        }
      }
    }
  },
  data () {
    return {
      // use locally scoped data when updating form
      jobFormData: this.jobData
    }
  },
  // but update from parent also, e.g. if route changes
  watch: {
    jobData: function () {
      this.jobFormData = this.jobData
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const { title, description, employmentType, location, remoteWorkingConsidered, applicationEmailAddress, companyName, tags } = this.jobFormData
          return this.submitCallback({
            title,
            description,
            employmentType,
            location,
            remoteWorkingConsidered,
            applicationEmailAddress,
            companyName,
            tags
          })
        } else {
          this.$toast.error('Invalid fields on form :(')
        }
      })
    },
    del () {
      return this.deleteCallback()
    }
  }
}
</script>
