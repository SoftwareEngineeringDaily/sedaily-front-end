<template>
  <div class="modal" tabindex="-1" role="dialog" id="firstTopicsSelect">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select Topics</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-check form-check-inline" v-for="topic in showTopics" :key="topic._id">
            <input class="form-check-input" type="checkbox" :id="topic._id" :value="topic._id" v-model="selectedTopics">
            <label class="form-check-label" :for="topic._id">{{ topic.name }}</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click='assignTopicsToUser' :disabled="selectedTopics.length !== 5">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "first-topics-select",
  data() {
    return  {
    selectedTopics: []
  }},
  props: {},
  computed: {
    ...mapState(["topics"]),
    showTopics() {
      if (this.$store.getters.getUserTopics === null) {
         return $("#firstTopicsSelect").modal('hide')
      } else if (this.$store.getters.getUserTopics.length === 0) {
        $("#firstTopicsSelect").modal('show')
          return this.topics.all
      } 
    }
  },
  methods: {
    ...mapActions(['addTopicToUser']),
    assignTopicsToUser() {
      const userTopics = {
        userId: this.$store.state.me._id,
        topics: this.selectedTopics
      }

      this.addTopicToUser(userTopics);
      $("#firstTopicsSelect").modal('hide')
    }
  },
  created () {
    this.$store.dispatch('getAllTopics')
  },
};
</script>

<style lang="stylus" scoped>
</style>