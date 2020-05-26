<template>
  <div class="post-topics-header">
    <div class="post-topics">
      <router-link class="topics" v-for="item in postTopics" :key="item.id" :to="getTopicPath(item)">
        {{ item.name }}
      </router-link>
    </div>
    <div v-if="isLoggedIn" class="add-topics">
      <button class="add-topics-btn" type="button" @click="showModal">
        <i class="fa fa-pencil"/>
      </button>
    </div>

    <modal v-if="isModalVisible" @close="cancel" class="modal-edit" showCloseBtn="true">
      <h4 slot="header">Edit Topics</h4>
      <template slot="body">
        <div class="title">
          Search for a existing topic or create a new one <button @click="promptNewTopic()">here</button>.
        </div>
        <div class="search-container">
          <b-input
            autocomplete="off"
            :autofocus="true"
            type="search"
            placeholder="Search topics"
            v-model="searchText" @input="onSearch" />
          <div v-if="searchTopics && searchTopics.length" class="search-panel">
            <button v-for="topic in searchTopics" @click="onClickSearchTopic(topic)" :key="topic.name">
              {{topic.name}}
            </button>
          </div>
        </div>
        <div class="edit-topic-list">
          <b-form-checkbox v-for="topic in editTopics" :key="topic.name" v-model="topic.selected">
            {{topic.name}}
          </b-form-checkbox>
        </div>
      </template>
      <template slot="footer">
        <button type="button" class="btn-modal-secondary" :disabled="saving" @click="cancel">Cancel</button>
        <button type="button" class="button-submit" @click="onSubmit">
          <spinner :show="saving"/>
          Submit
        </button>
      </template>
    </modal>

    <modal v-if="isPromptVisible" @close="showModal" class="modal-prompt" showCloseBtn="true">
      <h4 slot="header">New topic</h4>
      <template slot="body">
        <b-input
          autocomplete="off"
          :autofocus="true"
          @keyup.enter="onNewTopic"
          placeholder="New topic name"
          v-model="newTopicText" />
      </template>
      <template slot="footer">
        <button type="button" class="btn-modal-secondary" @click="showModal">Cancel</button>
        <button type="button" class="button-submit" @click="onNewTopic">Ok</button>
      </template>
    </modal>

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Spinner from '@/components/Spinner.vue'
import modal from '@/components/ModalComponent'

export default {
  name: "post-topics-header",
  props: {
    post: {
      type: Object,
      required: true
    },
  },
  components: {
    modal,
    Spinner
  },
  data () {
    return {
        postTopics: [],
        editTopics: [],
        addedTopics: [],
        isModalVisible: false,
        isPromptVisible: false,
        saving: false,
        searchText: '',
        newTopicText: ''
    }
  },
  beforeMount () {
    this.$store.commit('setPostTopics', [])
  },
  mounted () {
    this.getTopics()
  },
  computed: {
    ...mapGetters(['isLoggedIn']),

    searchTopics () {
      return this.$store.state.topics.searchedAllTopics
    }
  },
  methods: {
    ...mapActions(['getPostTopics','getSearchedTopics','updatePostTopics']),

    getTopicPath(topic) {
      return (topic.topicPage && topic.maintainer) ? `/topic/${topic.slug}` : `/posts/${topic.slug}`
    },

    getTopics() {
      this.$store.commit('setPostTopics', [])
      this.getPostTopics({ postId: this.post._id }).then((response) => {
        this.postTopics = response.data
        this.$store.commit('setPostTopics', this.postTopics)
        this.setEditTopics()
      })
    },

    onSubmit() {
      const selectedTopics = this.editTopics.filter(t => t.selected)

      this.saving = true

      this.updatePostTopics({ topics: selectedTopics, postId: this.post._id }).then((response) => {
          this.postTopics = response.data
          this.$store.commit('setPostTopics', this.postTopics)
          this.cancel()
        })
        .catch((e) => {
          this.$toasted.error((e.response) ? msg : e.response.data, { duration : 0 })
        })
        .finally(() => {
          this.saving = false
        })
    },

    setEditTopics() {
      this.editTopics = this.addedTopics.concat(this.postTopics.map(t => ({ ...t, selected: true })))
    },

    onSearch: _.debounce(function (text) {
      if (!text) return this.clearSearchTopics()
      this.getSearchedTopics(this.searchText)
    }, 500),

    onClickSearchTopic(topic) {
      const find = this.editTopics.find(t => t._id === topic._id)
      if (!find) {
        this.addedTopics.unshift({ ...topic, selected: true })
        this.setEditTopics()
      }
      this.searchText = ''
      this.clearSearchTopics()
    },

    onNewTopic() {
      const name = this.newTopicText.trim()
      if (!name) return

      if (this.editTopics.find(t => t.name === name)) return

      this.addedTopics.unshift({
        name: name,
        selected: true,
        new: true
      })
      this.setEditTopics()
      this.showModal()
    },

    clearSearchTopics() { this.$store.commit('setSearchedAllTopics', []) },

    showModal() {
      this.isModalVisible = true
      this.isPromptVisible = false
      this.newTopicText = ''
    },

    promptNewTopic() {
      this.isModalVisible = false
      this.isPromptVisible = true
    },

    cancel() {
      this.searchText = ''
      this.clearSearchTopics()
      this.newTopicText = ''
      this.addedTopics = []
      this.isModalVisible = false
      this.setEditTopics()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../css/variables'

.post-topics-header
  display flex
  align-items center

  .post-topics
    display flex
    align-items center
    flex-wrap wrap

    .topics
      cursor pointer
      margin 2px 10px 8px 0
      padding 3px 9px
      font-size .8rem
      text-transform uppercase
      color #666
      background-color #f7f7f7
      border-radius 2px

      &:hover
          color #a591ff
          text-decoration none

  .add-topics
    .add-topics-btn
      border none
      background none
      cursor pointer
      outline none
      color #c4c4c4
      font-size 18px
      margin-left 5px

  >>> .modal
    .btn-close
      font-size 18px

    .modal-body
      padding 15px
      display flex
      flex-direction column
      min-height 0

    input
      outline none
      font-size 14px

      &:focus
        outline none
        border 0
        -webkit-box-shadow 0 0 3px 3px rgba(165,145,255,0.4)
        box-shadow 0 0 3px 3px rgba(165,145,255,0.4)

    .btn-modal-secondary
      background-color none
      color #222
      margin-right 5px
      padding 5px
      border none
      outline none

  >>> .modal-prompt .modal
    height auto
    min-height 0

  >>> .modal-edit .modal
    height 70vh

    .modal-body
      .title
        margin-bottom 10px

        button
          background none
          border 0
          padding 0
          color main-purple
          font-weight 500
          outline 0

      .search-container
        position relative

      .search-panel
        background-color #f8f9fa
        border 1px solid #edeaff
        position absolute
        margin-top 2px
        width 100%
        max-height 150px
        overflow auto
        z-index 10

        button
          display block
          width 100%
          background none
          outline none
          border 0
          border-bottom 1px solid #edeaff
          text-align left
          padding 10px

    .edit-topic-list
      margin-top 15px
      flex 1
      overflow auto
      padding 0 3px

      .custom-control-label
        margin 2px 10px 8px 0
        padding 3px 9px
        font-size .8rem
        text-transform uppercase
        color #666
        background-color #f7f7f7
        border-radius 2px

      .custom-control-input:checked~.custom-control-label::before
        background-color #222
        border-color #222

  .button-submit
    .spinner
      width 18px
      height 18px

      >>> circle
        stroke #ffffff
</style>
