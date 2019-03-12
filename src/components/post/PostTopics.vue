<template>
  <div class="post-topics-header">
    <div class="post-topics">
      <span class="topics" v-for="item in items" :key="item.id">{{ item.name }}</span>
    </div>
    <div class="add-topics">
      <button class="add-topics-btn" type="button" @click="showModal"><i class="fa fa-pencil"/></button>
    </div>
    <modal
      v-show="isModalVisible"
      @close="closeModal">
      <!-- header-->
      <h2 slot="header">{{ post.title.rendered }}</h2>
      <!-- body-->
      <div slot="body">
        <div v-if="isAddTopic">
          <div class='add-bar'>
            <input id="add-topic" class='add-bar-input' type='text' placeholder='Place for your own topic...' v-model='newTopic' debounce="900"/>
            <button type="button" class="btn-modal" @click="createNewTopic">Create Topic</button>
          </div>
        </div>
        <div v-else>
          <div class='search-bar'>
            <input id="search" class='search-bar-input' type='text' placeholder='Search...' v-model='searchTopic' debounce="900"/>
          </div>
          <br>
          <ul class="popular-topics" >
            <li class="popular-topic" v-for="item in filterItems(topics)" :key="item.id">
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
          <button type="button" class="btn-submit" @click="selectTopicsToPost">Submit</button>
      </span>
    </modal>
  </div>
</template>

<script>
import modal from '@/components/ModalComponent.vue'
import { mapState, mapActions } from 'vuex'

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
      newTopic: '',
      items: [],
      searchTopic: '',
      checkedTopics: [],
      topics:[],
      itemsExist: false,
    }
  },
  mounted () {
    this.getTopics()
  },
  methods: {
    ...mapActions(['getPostTopics','createTopic','getAllTopics','addTopicsToPost']),
    addTopic() {
      if(this.isAddTopic === false){
        this.isAddTopic = true
      } else {
        this.searchTopic = ''
        this.isAddTopic = false
      }
    },
    showModal() {
      this.checkedTopics = []
      this.$store.state.topics.post.map((item) => {
        this.checkedTopics.push(item._id)
      })
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    createNewTopic() {
      if(this.newTopic !== ''){
        const data = {
          name: this.newTopic,
          postId: this.post._id,
        }
        this.createTopic({ data }).then(this.getTopics)
        this.newTopic = ''
        this.checkedTopics = "created"
        this.addTopic()
      }
    },
    getTopics() {
      this.getAllTopics()
      this.getPostTopics({ postId: this.post._id }).then(this.updateTopicsChecked)
    },
    updateTopicsChecked() {
      if(this.checkedTopics === "created"){
        this.checkedTopics = []
        this.$store.state.topics.post.map((item) => {
          this.checkedTopics.push(item._id)
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
      this.addTopicsToPost({ topics: selectedTopics })
      this.getTopics()
    },
    filterItems: function() {
      const app = this
      this.items = this.$store.state.topics.post
      this.topics = this.$store.state.topics.all
      if(this.topics !== null){
        return this.topics.filter(function(item) {
          let regex = new RegExp('(' + app.searchTopic + ')', 'i');
          return item.name.match(regex);
        })
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
  @import './../../css/variables'
  .btn-submit
    background-color primary-color
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
    .add-topics
      .add-topics-btn
        border none
        background none
        cursor pointer
        outline none
        color #c4c4c4
        font-size 18px
        margin-left 5px
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
  .popular-topics::-webkit-scrollbar
    width 5px
  .popular-topics::-webkit-scrollbar-track
    background #f1f1f1
  .popular-topics::-webkit-scrollbar-thumb
    background #d0c6ff
  .popular-topics::-webkit-scrollbar-thumb:hover
    background #555
</style>
