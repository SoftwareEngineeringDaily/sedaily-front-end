<template>
  <div>
    <div class="container">
      <div class="row">
        <div v-if="loading">
          <spinner :show="loading"></spinner>
        </div>
        <div v-else-if="error">
          <div class="bg-danger">Error: {{ error }}</div>
        </div>
        <div v-else-if="job && job.isDeleted">
          <div class="bg-warning">
            You previously deleted the job: {{ job.title }}
          </div>
        </div>
        <div v-else-if="job" class="col-md-10 offset-md-1">
          <h4 class="row">{{ job.title }} - {{ job.employmentType }}</h4>
          <div class="row">
            {{ job.companyName }} - {{ job.location }}
            <span v-if="job.remoteWorkingConsidered">&nbsp;(Remote Ok)</span>
          </div>
          <div class="row">
            <router-link
              v-if="job.topics && job.topics.length"
              v-for="topic in job.topics"
              :to="`/topic/${topic.slug}`"
              :key="topic._id"
              class="topic"
            >
              #{{ topic.name }}
            </router-link>
          </div>
          <br />
          <div class="row job-link">
            <span v-if="!isLoggedIn">
              <router-link to="/login"> Login to Apply </router-link>
            </span>
            <span v-else-if="ownJobPosting">
              <router-link :to="'/edit-job/' + jobId">
                Edit Job Posting
              </router-link>
            </span>
            <span v-else>
              <job-apply-modal
                v-if="job"
                :id="'jobApplyModal'"
                :title="job.title"
                :isModalVisible="isModalVisible"
                :onClose="toggleJobApplyModal"
                :jobId="jobId"
              >
                <button class="btn button-submit" @click="toggleJobApplyModal">
                  Apply to Job
                </button>
              </job-apply-modal>
            </span>
          </div>
          <div class="row job-description">
            {{ job.description }}
          </div>
          <div class="row job-date">Posted on {{ date }}</div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Spinner from "@/components/Spinner";
import JobApplyModal from "@/components/job/JobApplyModal";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "job-view",

  data() {
    return {
      loading: false,
      job: null,
      isModalVisible: false,
      error: null,
    };
  },

  created() {
    this.fetchData();
  },

  watch: {
    // re-fetch if route changes
    $route: "fetchData",
  },

  components: {
    Spinner,
    JobApplyModal,
  },

  methods: {
    // TODO: once profile issue resolved, don't fetch profile here
    // https://github.com/SoftwareEngineeringDaily/sedaily-front-end/issues/239
    ...mapActions(["fetchJob"]),

    toggleJobApplyModal() {
      this.isModalVisible = !this.isModalVisible;
    },

    fetchData() {
      this.loading = true;
      this.fetchJob({ jobId: this.jobId })
        .then((response) => {
          this.job = response.data;
          this.error = null;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },

  computed: {
    ...mapGetters(["isLoggedIn", "metaTag"]),

    ...mapState({
      jobId(state) {
        return state.route.params.id;
      },
      me(state) {
        return state.me;
      },
      ownJobPosting() {
        return this.me._id === this.job.postedUser;
      },
      date() {
        return moment(this.job.postedDate).format("MMMM Do, YYYY");
      },
    }),

    metaDescription() {
      const maxLength = 400;
      const {
        job: { description },
      } = this;
      if (description.length > maxLength) {
        return description.substr(0, maxLength - 3) + "...";
      }
      return description;
    },
  },

  metaInfo() {
    // wait for job before updating meta
    if (!this.job) {
      return {};
    }

    const title = `${this.job.title} | Software Daily`;
    const { metaDescription } = this;

    return {
      title,
      meta: [
        this.metaTag("og:title", title),
        this.metaTag("og:url", location.href),
        this.metaTag("description", metaDescription),
        this.metaTag("og:description", metaDescription),
      ],
    };
  },
};
</script>

<style scoped lang="stylus">
@import '../../css/variables';

.job-link {
  a {
    color: accent-color;
  }
}

.job-description {
  white-space: normal;
}

.job-date {
  font-size: 0.9em;
  color: #999;
}

.divider {
  margin: 0 12px;
}

.topic {
  margin-right: 6px;
  color: #999;
}
</style>
