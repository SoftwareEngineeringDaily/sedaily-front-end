<template>
  <div class="post-topics-header">
    <div class="post-topics">
      <span class="topics" v-for="item in items" :key="item.id">{{ item.message }}</span>
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
        <div class='search-bar'>
          <input id="search" class='search-bar-input' type='text' placeholder='Search...' v-model='searchTopic' debounce="900"/>
        </div>
        <br>
        <br>
        <div class="popular-topics">
          <div class="popular-topic" v-for="item in filterItems(items)" :key="item.id">
            <label class="container" :for="item.id">
              {{ item.message }}
              <input type="checkbox" :id="item.id" :value="item.message" v-model="checkedTopics">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      <!-- footer-->
      <span slot="footer">
        <button type="button">Submit</button>
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
      items: [
        { message: 'Javascript' },
        { message: 'Technology' }
      ],
      searchTopic: '',
      checkedTopics: [],
    }
  },
  mounted () {
    this.getTopics()
  },
  methods: {
    ...mapActions(['getPostTopics']),
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    getTopics() {
      this.getPostTopics({ postId: this.post._id })
    },
    filterItems: function(items) {
      const app = this
      return items.filter(function(item) {
        let regex = new RegExp('(' + app.searchTopic + ')', 'i');
        return item.message.match(regex);
      })
    }
  },
}
</script>

<style lang="stylus" scoped>
  @import './../../css/variables'
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
      .topics
        background-color primary-color
        color white
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
  .search-bar
    justify-content center
    flex 1
    display flex
    align-items center
    margin-right 15px
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
        color: #495057;
        background-color: #fff;
        border-color: #edeaff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(133, 106, 255, 0.25);
  .container
    width auto
    display flex
    align-items center
    position relative
    padding-left 35px
    margin-bottom 12px
    cursor pointer
    font-size 22px
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
      height 25px
      width 25px
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
    left 9px
    top 3px
    width 8px
    height 15px
    border solid white
    border-width 0 3px 3px 0
    -webkit-transform rotate(45deg)
    -ms-transform rotate(45deg)
    transform rotate(45deg)
  .popular-topics
    .popular-topic
      display flex
      flex-direction column
      justify-content center
</style>
