<template>
  <modal
    id="topic-modal"
    v-show="isModalVisible">
    <!-- header-->
    <h2 slot="header">Add topics that interest you (min 3 topics)</h2>
    <!-- body-->
    <div slot="body">
      <div id="search-container">
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
            <li v-show="this.$store.state.topics.searchedAllTopics === null">
              <label>
                No scores for this request..
              </label>
            </li>
          </ul>
        </div>
        <br>
        <ul class="popular-topics" >
          <li class="popular-topic" v-for="item in modalTopics" :key="item.id">
            <label class="container" :for="item.id">
              {{ item.name }}
              <input type="checkbox" :id="item.id" :value="item._id" v-model="checkedTopics">
              <span class="checkmark"></span>
            </label>
          </li>
          <li class="popular-topic" v-for="item in showModal" :key="item.id">
            <label class="container" :for="item.id">
              {{ item.name }}
              <input type="checkbox" :id="item.id" :value="item._id" v-model="checkedTopics">
              <span class="checkmark"></span>
            </label>
          </li>
        </ul>
        <!-- <span class='no-topic'>Ups! There is no topics added yet..</span> -->
      </div>
    </div>
    <!-- footer-->
    <span slot="footer">
     <button v-if="checkedTopics.length > 2" type="button" class="btn-submit" @click="selectTopicsToUser">Submit</button>
     <button v-else type="button" class="btn-submit-disactive">Submit</button>
    </span>
  </modal>
</template>

<script>
import modal from '@/components/ModalComponent.vue'
import { mapState, mapActions } from 'vuex'
import lodash from 'lodash'

export default {
  name: "first-topics-select",
  components: {
    modal,
  },
  data () {
    return {
      isModalVisible: true,
      allTopics: [],
      searchTopic: '',
      checkedTopics: [],
      topics:[],
      isOpen: false,
      modalTopics: [],
    }
  },
  mounted () {
    $("body").addClass("modal-open")
    this.getTopics()
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  computed: {
    showModal() {
      return this.$store.state.topics.mostPopular
    },
  },
  methods: {
    ...mapActions(['mostPopular','getSearchedTopics','addTopicToUser']),
    setResult(item) {
      const topic = _.find(this.modalTopics, (x) => ( x._id === item._id ))
      if (!topic) { this.modalTopics.push(item) }
    },
    debounceSearchRequest: _.debounce(function () {
      this.getSearchedTopics(this.searchTopic)
    }, 500),
    handleClickOutside(evt) {
      if (this.$el.contains(evt.target)) {
        this.isOpen = false;
      }
    },
    onChange() {
      this.isOpen = true;
      this.getSuggestedTopics()
    },
    getSuggestedTopics() {
      if(this.searchTopic !== '') {
        this.debounceSearchRequest()
      }
    },
    closeModal() {
      this.modalTopics = []
      this.isModalVisible = false
      this.searchTopic = ''
      $("body").removeClass("modal-open")
    },
    getTopics() {
      this.mostPopular().then(this.showModal)
    },
    selectTopicsToUser() {
      const selectedTopics = []
      this.checkedTopics.map((id) => {
        selectedTopics.push(id)
      })
      const allTopics = {
        userId: this.$store.state.me._id,
        topics: selectedTopics
      }
      this.addTopicToUser(allTopics).then(this.closeModal)
    },
    filterItems: function() {
      const app = this
      this.allTopics = this.$store.state.topics.all
      this.topics = this.$store.state.topics.searchedAllTopics
      if(this.topics !== null){
        return this.topics
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import './../css/variables'
  body.modal-open
    overflow hidden
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
  .btn-submit
    background-color primary-color
    color white
    margin-right 5px
    padding 5px
    border-radius 5px
    border 1px solid #c4c4c4
    cursor pointer
    outline none
  .btn-submit-disactive
    background-color #c4c4c4
    color white
    margin-right 5px
    padding 5px
    border-radius 5px
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
    margin 15px 20px
    display flex
    align-items center
    .post-topics
      display flex
      align-items center
      max-width 70%
      flex-wrap wrap
      .topics
        background-color primary-color
        color white
        margin 2px 0
        margin-right 5px
        padding 5px
        border-radius 5px
        border 1px solid #c4c4c4
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
    text-align left
  .popular-topics::-webkit-scrollbar
    width 5px
  .popular-topics::-webkit-scrollbar-track
    background #f1f1f1
  .popular-topics::-webkit-scrollbar-thumb
    background #d0c6ff
  .popular-topics::-webkit-scrollbar-thumb:hover
    background #555
</style>
