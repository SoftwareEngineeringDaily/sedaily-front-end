<template>
  <div class="write-view">
    <h1>Write on Software Daily</h1>
    <p>
      We are looking for volunteer writers to summarize the topics on Software Daily.
      If you want to write about a topic, you can select one or suggest your own topic.
    </p>
    <button class="learn" @click="toggleModal">Learn more</button>

    <modal v-show="isModalVisible" class="test" showCloseBtn="true">
      <h2 slot="header"></h2>
      <!-- Selection -->
      <div v-if="!selectedTopic" slot="body">
        <div>
          <p>If you are listening to lots of episodes of Software Daily, you can write about the topics in the show. It will help us grow our content, and help you retain information.</p>
          <p>A topic page should be:</p>
          <ul>
            <li>brief (2-3 pages; you would want to read it on an airplane or on a short 15 minute commute)</li>
            <li>high-level (it should read like an executive summary, not a tutorial)</li>
            <li>informative (an unbiased presentation of the topic)</li>
          </ul>
          <p>Here are a few examples:</p>
        </div>
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
      </div>
      <!-- Confirmation -->
      <div v-if="selectedTopic" slot="body">
        Confirm selection of <span class="topic">{{selectedTopic}}</span> topic?
      </div>  
      <div slot="footer">
        <button class="cancel" @click="cancelModal">Cancel</button>
        <button v-if="selectedTopic" :disabled="saving" class="button-submit" @click="submit">Submit</button>
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
      isModalVisible: false,
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

    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },

    cancelModal() {
      this.isModalVisible = false
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
    },

    selectNewTopic() {
      this.selectedTopic = (''.trim) ? this.newTopic.trim() : this.newTopic
    },

    submit() {
      this.saving = true
      const data = {
        topicName: this.selectedTopic,
        userName: this.me.name,
        userEmail: this.me.email
      }

      this.setMaintainerInterest(data).then((data) => {
        this.$toasted.success('Great! We will be in touch with you.', { duration : 8000 })
        this.cancelModal()
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
      height 70 vh
      .modal-header
        display none 

      .modal-body
        padding 30px
        overflow auto
    
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
