<template>
  <div class="post-topics-header">
    <div class="post-topics">
      <div class="topics" v-for="item in postTopics" :key="item.id" @click="goTo(item.slug)">{{ item.name }}</div>
    </div>
    <div v-if="isLoggedIn" class="add-topics">
      <button class="add-topics-btn" type="button" @click="showModal"><i class="fa fa-pencil"/></button>
    </div>
    <modal
      id="topic-modal"
      v-show="isModalVisible"
      @close="closeModal"
      showCloseBtn="true">
      <!-- header-->
      <h2 slot="header" v-if="post.title">{{ post.title.rendered }}</h2>
      <!-- body-->
      <div slot="body">
        <div v-if="isAddTopic">
          <div class='add-bar'>
            <input id="add-topic" class='add-bar-input' type='text' placeholder='Place for your own topic...' v-model='newTopic' debounce="900"/>
            <button type="button" class="btn-modal" @click="createNewTopic">Create Topic</button>
          </div>
          <div class='add-bar message-error' v-if="createError === 422">
            <p>This topic is already exist</p>
          </div>
        </div>
        <div id="search-container" v-else>
          <div class='search-bar'>
            <input
              id="search"
              class='search-bar-input'
              type='text'
              @input="onChange"
              placeholder='Search...'
              v-model='searchTopic'
              debounce="900"
              autocomplete="off"
            />
          </div>
          <div v-show="isOpen" class="autocomplete">
            <ul class="popular-topics absolute">
              <li class="popular-topic" v-for="(item, i) in filterItems(topics)" :key="i">
                <label class="search-label" @click="setResult(item)" :for="item.id">
                  {{ item.name }}
                </label>
              </li>
              <li v-if="this.$store.state.topics.searchedAllTopics === null">
                <label>
                  No scores for this request..
                </label>
              </li>
            </ul>
          </div>
          <br>
          <ul v-if="modalTopics.length > 0" class="popular-topics" >
            <li class="popular-topic" v-for="item in modalTopics" :key="item.id">
              <label class="container" :for="item.id">
                {{ item.name }}
                <input type="checkbox" :id="item.id" :value="item._id" v-model="checkedTopics">
                <span class="checkmark"></span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <!-- footer-->
      <span slot="footer">
        <button v-if="isAddTopic" type="button" class="btn-modal-secondary" @click="addTopic">Back</button>
        <button v-else type="button" class="btn-modal-secondary" @click="addTopic">Add Topic</button>
        <button v-if="checkedTopics.length > 0" type="button" class="button-submit" @click="selectTopicsToPost">Submit</button>
        <button v-else type="button" class="btn-submit-disactive">Submit</button>
      </span>
    </modal>
  </div>
</template>

<script>
import modal from '@/components/ModalComponent'
import { mapGetters, mapState, mapActions } from 'vuex'

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
  },
  data () {
    return {
      isModalVisible: false,
      isAddTopic: false,
      isOpen: false,
      newTopic: '',
      postTopics: [],
      modalTopics: [],
      searchTopic: '',
      checkedTopics: [],
      topics:[],
      createError: null,
    }
  },
  mounted () {
    this.getTopics()
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['showTopic','getPostTopics','createTopic','getSearchedTopics','addTopicsToPost']),
    handleClickOutside(evt) {
      if (this.$el.contains(evt.target)) {
        this.isOpen = false;
      }
    },
    goTo(slug){
      this.$router.push({ path: `/topics/${slug}` });
    },
    setResult(item) {
      const topic = _.find(this.modalTopics, (x) => ( x._id === item._id ))
      if (!topic) { this.modalTopics.push(item) }
    },
    debounceSearchRequest: _.debounce(function () {
      this.getSearchedTopics(this.searchTopic)
    }, 500),
    onChange() {
      this.isOpen = true;
      this.getSuggestedTopics()
    },
    getSuggestedTopics() {
      if(this.searchTopic !== '') {
        this.debounceSearchRequest()
      }
    },
    addTopic() {
      if(this.isAddTopic === false){
        this.isAddTopic = true
      } else {
        this.searchTopic = ''
        this.isAddTopic = false
        this.createError = null
      }
    },
    showModal() {
      this.checkedTopics = []
      this.postTopics.map((item) => {
        this.modalTopics.push(item)
      })
      this.$store.state.topics.post.map((item) => {
        this.checkedTopics.push(item._id)
      })
      this.isModalVisible = true;
      $("body").addClass("modal-open")
    },
    closeModal() {
      this.modalTopics = []
      this.isModalVisible = false
      this.searchTopic = ''
      $("body").removeClass("modal-open")
    },
    createNewTopic() {
      if(this.newTopic !== ''){
        const data = {
          name: this.newTopic,
          postId: this.post._id,
        }
        const aaa = null
        this.createTopic({ data }).catch((error) => {
          this.createError = error.response.status
        }).then(this.getTopics).then(() => {
          if(this.createError !== 422) {
            this.newTopic = ''
            this.checkedTopics = "created"
            this.addTopic()
          }
        })
      }
    },
    getTopics() {
      this.getPostTopics({ postId: this.post._id }).then(this.updateTopicsChecked)
    },
    updateTopicsChecked() {
      if(this.checkedTopics === "created"){
        this.checkedTopics = []
        this.modalTopics = []
        this.$store.state.topics.post.map((item) => {
          this.checkedTopics.push(item._id)
          this.modalTopics.push(item)
        })
      }
    },
    selectTopicsToPost() {
      const selectedTopics = {
        topics: [],
        postId: this.post._id,
      }
      this.checkedTopics.map((id) => {
        selectedTopics.topics.push(id)
      })
      this.addTopicsToPost({ topics: selectedTopics }).then(this.getTopics).then(this.closeModal)
    },
    filterItems: function() {
      const app = this
      this.postTopics = this.$store.state.topics.post
      this.topics = this.$store.state.topics.searchedAllTopics
      if(this.topics !== null){
        return this.topics
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
  @import './../../css/variables'
  .autocomplete
    max-width 500px
    margin auto
    .absolute
      background white
      z-index 1000
      height auto!important
      position absolute
  .search-label
    width 100%
    cursor pointer
    &:hover
      color primary-color
  body.modal-open
    overflow hidden
  .btn-submit-disactive
    padding 7px
    font-size 12px
    white-space nowrap
    color #fff
    min-width 70px
    border none
    border-radius 30px
    text-align center
    -webkit-transition all 0.15s ease
    transition all 0.15s ease
    background-color #c4c4c4
    border 1px solid #c4c4c4
    cursor pointer
    outline none
  .btn-modal
    background-color primary-color
    color white
    margin-right 5px
    padding 5px
    border-radius 0 5px 5px 0
    border 1px solid #c4c4c4
    cursor pointer
    outline none
  .btn-modal-secondary
    background-color white
    color black
    margin-right 5px
    padding 5px
    border none
    cursor pointer
    outline none
  h2
    margin 0
    color black
    font-size 1.5rem
  .post-topics-header
    display flex
    align-items center
    .post-topics
      display flex
      align-items center
      flex-wrap wrap
      .topics
        background-color #f7f7f7
        color #666
        text-transform uppercase
        font-size .8rem
        margin 2px 10px 8px 0
        padding 3px 9px
        border-radius 2px
        cursor pointer
        &:hover
          color #a591ff
    .add-topics
      .add-topics-btn
        border none
        background none
        cursor pointer
        outline none
        color #c4c4c4
        font-size 18px
        margin-left 5px
  .message-error
    margin 15px 0
  .add-bar
    justify-content center
    flex 1
    display flex
    align-items center
    margin-right 15px
    input
      max-width 300px
      flex 1
      border-radius 5px 0 0 5px
      padding 5px
      font-weight 100
      color #C4C4C4
      border 1px solid #ccc
      &:focus
        outline none
        color #495057
        background-color #fff
  .search-bar
    justify-content center
    flex 1
    display flex
    align-items center
    input
      max-width 500px
      flex 1
      border-radius 5px
      padding 5px
      font-weight 100
      color #C4C4C4
      border 1px solid #ccc
      &:focus
        outline none
        color #495057
        background-color #fff
        border-color: #edeaff
        outline 0
        box-shadow 0 0 0 0.2rem rgba(133, 106, 255, 0.25)
  .container
    width auto
    display flex
    align-items center
    position relative
    padding-left 35px
    margin-bottom 12px
    margin-top 12px
    cursor pointer
    font-size 16px
    -webkit-user-select none
    -moz-user-select none
    -ms-user-select none
    input
      position absolute
      opacity 0
      cursor pointer
      height 0
      width 0
    .checkmark
      position absolute
      left 0
      height 20px
      width 20px
      background-color #eee
  .container:hover input ~ .checkmark
    background-color #ccc
  .container input:checked ~ .checkmark
    background-color primary-color
  .checkmark:after
    content ""
    position absolute
    display none
  .container input:checked ~ .checkmark:after
    display block
  .container .checkmark:after
    left 7px
    top 3px
    width 6px
    height 12px
    border 2px solid white
    border-width 0 3px 3px 0
    -webkit-transform rotate(45deg)
    -ms-transform rotate(45deg)
    transform rotate(45deg)
  .no-topic
    display flex
    flex-direction column
    overflow auto
    overflow-x hidden
    width 100%
    height 100%
    max-height 250px
    max-width 500px
    margin auto
    padding 0
    padding 5px
  .popular-topics
    list-style none
    display flex
    flex-direction column
    overflow auto
    overflow-x hidden
    width 100%
    height 100%
    max-height 250px
    max-width 500px
    margin auto
    padding 0
    border-radius 5px
    border 1px solid #c4c4c4
    padding 10px
    list-style none
      .popular-topic
        justify-content center
  .popular-topics::-webkit-scrollbar
    width 5px
  .popular-topics::-webkit-scrollbar-track
    background #f1f1f1
  .popular-topics::-webkit-scrollbar-thumb
    background #d0c6ff
  .popular-topics::-webkit-scrollbar-thumb:hover
    background #555

</style>
