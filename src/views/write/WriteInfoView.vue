<template>
  <div class="write-view">
    <h1>Write on Software Daily</h1>
    <p>
      We are looking for volunteer writers to summarize the topics on Software Daily.
      If you want to write about one of the following topics, select one of the topics below or suggest your own topic.
    </p>

    <button class="learn" @click="toggleLearn">Learn more</button>

    <spinner :show="loading"/>
    
    <div v-if="!me || !me._id" class="display-content">You need to login first</div>
    <template v-else>
      
      <form class="display-content" v-on:submit.prevent="selectNewTopic">
        <input type="text"
          v-model="newTopic"
          class="form-control"
          placeholder="Suggest new topic">
      </form>  
      
      <div class="display-content topics-block">
        <button
          v-for="topic in topics" 
          :key="topic._id"
          @click="onClickTopic(topic)">
          {{topic.name}}
        </button>
      </div>

    </template>

    <modal v-show="showLearn">
      <h2 slot="header"></h2>
      <div slot="body">
        <div>
          <p>If you are listening to lots of episodes of Software Daily, you can write about the topics in the show. It will help us grow our content, and help you retain information.</p>
          <p>A topic page should be:</p>
          <ul>
            <li>brief (2-3 pages; you would want to read it on an airplane or on a short 15 minute commute)</li>
            <li>high-level (it should read like an executive summary, not a tutorial)</li>
            <li>informative (an unbiased presentation of the topic)</li>
          </ul>
          <p>Here are a few examples:</p>
          <router-link to="/topic/container-orchestration-wars">Container Orchestration Wars</router-link><br>
          <router-link to="/topic/apache-spark">Apache Spark</router-link>
        </div>        
      </div>
      <div slot="footer">
        <button class="cancel" @click="showLearn=false">Close</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import spinner from '@/components/Spinner.vue'
import modal from '@/components/ModalComponent'
export default {
  components: {
    spinner,
    modal
  },
  data () {
    return {
      loading: false,
      saving: false,
      showLearn: false,
      topics: [],
      newTopic: '',
      selectedTopic: ''
    }
  },
  mounted() {
    this.loadTopics()
  },
  computed: {
    ...mapState({    
      me (state) {
        return state.me
      },
    })
  },
  methods: {
    ...mapActions(['getTopTopics', 'setMaintainerInterest']),

    toggleLearn() {
      this.showLearn = !this.showLearn;
    },

    cancelSelection() {
      this.selectedTopic = ''
      this.newTopic = ''
    },

    loadTopics() {
      this.loading = true
      this.getTopTopics(200).then((data) => {
        this.topics = data
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onClickTopic(topic) { 
      this.selectedTopic = topic.name
      this.$nextTick(() => {
        this.submit()
      })
    },

    selectNewTopic() {
      this.selectedTopic = (''.trim) ? this.newTopic.trim() : this.newTopic
      if (!this.selectedTopic) return

      this.$nextTick(() => {
        this.submit();
      })
    },

    submit() {
      if (this.saving) return
      
      this.saving = true
      const data = {
        topicName: this.selectedTopic,
        userName: this.me.name,
        userEmail: this.me.email
      }
      this.setMaintainerInterest(data).then((data) => {
        this.$toasted.success('Great! We will be in touch with you.', { duration : 8000 })
        this.cancelSelection()
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .write-view
    padding 20px

    h1,h2,h3,h4
      font-weight 200
      margin-bottom 30px
    
    .spinner
      margin 0 auto
      display block

    .learn
      color #a591ff
      font-weight 600
      margin 0
      padding 0
      border 0
      background-color transparent
      font-size 16px

      &:hover
        color #222
        text-decoration underline

    .cancel
      font-weight 600
      color #9b9b9b
      margin 0
      padding 0
      border 0
      background-color transparent
      font-size 16px
  
    >>> .modal
      height unset
      min-height unset

      .modal-header
        display none 

      .modal-body
        padding 30px
        overflow auto

      a
        color #1a0dab

    .topic
      color #a591ff

    .button-submit
      margin-left 20px
    
    .display-content
      padding 20px
      background-color #f8f9fa
      margin 10px auto
      text-align center
      
    .topics-block
      
      button
        border 0
        background-color transparent
        display block
        margin 10px auto
        font-size 16px
        text-transform uppercase
        color #1a0dab

</style>
