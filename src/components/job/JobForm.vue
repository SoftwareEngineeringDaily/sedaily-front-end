<template>
  <div class="container">
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <h4 class="row" >{{ header }}</h4>
        <br />

        <form>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Topics:</label>
            <div class="col-sm-10">
              <topics-auto-complete v-model="jobFormData.topics" />
            </div>
          </div>

          <div class="form-group row">
            <label for="companyNameInput" class="col-sm-2 col-form-label">Company</label>
            <div class="col-sm-10">
              <input
                class="form-control"
                type="text"
                placeholder="Company/Employer"
                id="companyNameInput"
                name="companyName"
                v-model="jobFormData.companyName"
                v-validate="'required'">
              <div
                class="alert alert-danger"
                v-show="errors.has('companyName')">
                {{ errors.first('companyName') }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="locationInput" class="col-sm-2 col-form-label">Location</label>
            <div class="col-sm-6">
              <input
                class="form-control"
                type="text"
                placeholder="City, State, Country OR Worldwide"
                id="locationInput"
                name="location"
                v-model="jobFormData.location"
                v-validate="'required'" />
            </div>
            <div
              class="hidden-sm-up alert alert-danger"
              v-show="errors.has('location')">
              {{ errors.first('location') }}
            </div>
            <div class="form-check mt-1 col-sm-4">
              <label class="form-check-label">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="remoteWorkingConsidered"
                  v-model="jobFormData.remoteWorkingConsidered"
                > Remote Ok?
              </label>
            </div>
          </div>
          <div class="form-group row">
            <label for="titleInput" class="col-sm-2 col-form-label">Title</label>
            <div class="col-sm-10">
              <input
                class="form-control"
                type="text"
                placeholder="Job Title"
                id="titleInput"
                name="title"
                v-model="jobFormData.title"
                v-validate="'required'" />
              <div
                class="alert alert-danger"
                v-show="errors.has('title')">
                {{ errors.first('title') }}
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Type</label>
            <div class="col-sm-8 mt-1">
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input
                    v-validate.employmentType="'required'"
                    class="form-check-input"
                    type="radio"
                    name="employmentType"
                    value="Permanent"
                    v-model="jobFormData.employmentType"
                  > Permanent
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input
                    v-validate.employmentType="'required'"
                    class="form-check-input"
                    type="radio"
                    name="employmentType"
                    value="Contract"
                    v-model="jobFormData.employmentType"
                  > Contract
                </label>
              </div>
            </div>
          </div>

          <div class="row">
            <div
              class="col-sm-10 offset-sm-2 alert alert-danger"
              v-show="errors.has('employmentType')">
              {{ errors.first('employmentType') }}
            </div>
          </div>

          <div class="form-group row">
            <div class="col-sm-12">
              <textarea
                class="form-control"
                rows="10"
                cols="120"
                placeholder="Job Description"
                name="description"
                v-model="jobFormData.description"
                v-validate="'required'"
              ></textarea>
              <div
                v-show="errors.has('description')"
                class="alert alert-danger"
                style="flex-grow:1; margin-top:10px;">
                {{ errors.first('description') }}
              </div>
            </div>
          </div>
            <div class="form-group row">
              <label for="applicationEmailAddressInput" class="col-sm-2 col-form-label">Apply-to Email</label>
              <div class="col-sm-10">
                <input
                  class="form-control"
                  type="email"
                  placeholder="recruiting@company.com"
                  id="applicationEmailAddressInput"
                  name="applicationEmailAddress"
                  v-model="jobFormData.applicationEmailAddress"
                  v-validate="'required|email'" />
              </div>
              <div
                class="col-sm-10 offset-sm-2 alert alert-danger"
                v-show="errors.has('applicationEmailAddress')">
                {{ errors.first('applicationEmailAddress') }}
              </div>
            </div>
          <div class="form-group row">
            <div class="pl-2 col-4">
              <button
                class="btn button-submit"
                @click.prevent="submit">
                <span v-if="editingJob">Update</span>
                <span v-else>Post</span>
              </button>
            </div>
            <div v-if="editingJob" class="col-4 offset-4">
              <button
                class="btn button-delete"
                @click.prevent="del">
                Delete
              </button>
            </div>
          </div>
          <div class="row">
            <spinner :show="loading"></spinner>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Spinner from '@/components/Spinner'
import { TopicsAutoComplete } from '@/components/topic'

export default {
  name: 'job-form',

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
    deleteCallback: Function,
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
          topics: [],
          tags: [],
        }
      }
    }
  },

  components: {
    Spinner,
    TopicsAutoComplete,
  },

  mounted () {
    const { topicId } = this.$router.history.current.query
    this.setInitTopic(topicId)
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
    },
  },

  methods: {
    ...mapActions([
      'getTopic',
    ]),

    async setInitTopic (topicId) {
      if (!topicId) {
        return
      }

      try {
        const topic = await this.getTopic({ topicId })

        if (topic) {
          this.jobData.topics.push(topic);
        }
      }
      catch (e) {
        console.error('Unable to find topic with id: ', topicId)
      }
    },

    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const {
            title,
            description,
            employmentType,
            location,
            remoteWorkingConsidered,
            applicationEmailAddress,
            companyName,
            topics,
            tags
          } = this.jobFormData

          return this.submitCallback({
            title,
            description,
            employmentType,
            location,
            remoteWorkingConsidered,
            applicationEmailAddress,
            companyName,
            topics,
            tags
          })
        } else {
          this.$toasted.error('Invalid fields on form :(')
        }
      })
    },

    del () {
      return this.deleteCallback()
      // this.$toasted.error('TODO: implement delete')
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="stylus">
.alert
  margin-top 10px
</style>
