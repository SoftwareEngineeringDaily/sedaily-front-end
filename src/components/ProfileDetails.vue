<template>
  <div class="profile">
    <div class="col-md-6 wrapper">
      <div class="display-details">
        <div class="user-details">
          <div class="row-name">
            <h3 class="display-name">
              {{displayName}}
            </h3>
            <button
            v-if="ownProfile"
            class='button-submit button-submit-reverse'
            @click='profileEdit'>
              Edit Profile
            </button>
          </div>
          <p class="display-bio text-muted">
            {{displayBio}}
          </p>
          <p class="display-website" v-if="userData.website">
            <a :href="userData.website | externalUrl" target="_blank"
            rel="external nofollow"
            > {{ userData.website | host }} </a>
          </p>
        </div>
        <div class="crop-image" v-if="!ownProfile">
          <img v-if="ownProfile" class="profile-img" :src="errorImg || avatarUrl" @error="imgOnError">
          <img v-else-if="profileImg" class="profile-img" :src="errorImg || profileImg" @error="imgOnError">
          <img v-else-if="profileImg === undefined" class="profile-img" :src="errorImg" @error="imgOnError">
        </div>
        <div class="crop-image" v-if="ownProfile">
          <img v-if="ownProfile" class="profile-img" :src="errorImg || avatarUrl" @error="imgOnError">
        </div>
      </div>
    </div>
    <!-- <a
      href="/"
      name="logouts-nav-link"
      @click.prevent="logoutHandler">Logout</a> -->
    <div v-if="ownProfile" class="col-md-6 edit-link">
      <hr>
      <h5>My Topics<button class="manage-my-topics btn-link" @click="showModal"><i class="fa fa-pencil"/></button></h5>
      <hr>
      <modal
        id="topic-modal"
        v-show="isModalVisible"
        @close="closeModal"
        showCloseBtn="true">
        <!-- header-->
        <h2 slot="header">Edit Topics</h2>
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
            <ul v-if="modalTopics.length > 0" class="popular-topics" >
              <li class="popular-topic" v-for="item in modalTopics" :key="item.id">
                <label class="container" :for="item.id">
                  {{ item.name }}
                  <input type="checkbox" :id="item.id" :value="item._id" v-model="checkedTopics">
                  <span class="checkmark"></span>
                </label>
              </li>
            </ul>
            <!-- <span v-else class='no-topic'>Ups! There is no topics added yet..</span> -->
          </div>
        </div>
        <!-- footer-->
        <span slot="footer">
          <button type="button" class="button-submit" @click="selectTopicsToUser">Submit</button>
        </span>
      </modal>
      <div class="user-topics-header">
        <div class="user-topics">
          <div class="topics" v-for="item in userTopics" :key="item.id" @click="goTo(item.slug)">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import modal from '@/components/ModalComponent.vue'
  import { mapState, mapActions, mapGetters } from "vuex";
  import lodash from 'lodash'

  export default {
    name: 'profile-details',
    props: {
      userData: {
        type: Object,
        default: function () {
          return {
            _id: '',
            username: '',
            avatarUrl: '',
            bio: '',
            name: '',
            website: ''
          }
        }
      },
      ownProfile: {
        type: Boolean,
        default: false
      }
    },
    components: {
      modal,
    },
    data () {
      return {
        isModalVisible: false,
        userTopics: [],
        searchTopic: '',
        checkedTopics: [],
        topics:[],
        isOpen: false,
        modalTopics: [],
        errorImg: '',
        profileImg: null
      }
    },
    mounted () {
      const userId = this.$route.params.id;
      if(userId) {
        this.fetchPublicProfileData({userId: userId}).then(
          res => this.profileImg = res.data.avatarUrl
        )
      } else {
        this.getTopics()
      }
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside);
    },
    computed: {
      ...mapGetters(["isLoggedIn"]),
      ...mapState({
        displayName () {
          return this.userData.name || this.userData.username
        },
        displayBio () {
          return this.userData.bio || `${this.displayName} is still writing their biography`
        },
        avatarUrl(state) {
          return state.me.avatarUrl || state.placeholderAvatar;
        }
      })
    },
    methods: {
      ...mapActions(['getUserTopics','getSearchedTopics','addTopicToUser', 'fetchPublicProfileData']),
      logoutHandler () {
        this.$auth.logout()
        this.$router.replace('/')
      },
      setResult(item) {
        const topic = _.find(this.modalTopics, (x) => ( x._id === item._id ))
        if (!topic) {
          this.modalTopics.push(item);
          this.checkedTopics.push(item._id);
        }
      },
      profileEdit() {
        this.$router.replace('/edit-profile')
      },
      debounceSearchRequest: _.debounce(function () {
        this.getSearchedTopics(this.searchTopic)
      }, 500),
      handleClickOutside(evt) {
        if (this.$el.contains(evt.target)) {
          this.isOpen = false;
        }
      },
      goTo(slug){
        this.$router.push(`/topics/${slug}`)
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
      imgOnError() {
        this.errorImg = 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
      },
      showModal() {
        this.checkedTopics = []
        this.userTopics.map((item) => {
          this.modalTopics.push(item)
        })
        this.$store.state.topics.user.map((item) => {
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
      getTopics() {
        this.getUserTopics()
      },
      selectTopicsToUser() {
        const selectedTopics = []
        this.checkedTopics.map((id) => {
          selectedTopics.push(id)
        })
        const userTopics = {
          userId: this.$store.state.me._id,
          topics: selectedTopics
        }
        this.addTopicToUser(userTopics).then(this.getTopics).then(this.closeModal)
      },
      filterItems: function() {
        const app = this
        this.userTopics = this.$store.state.topics.user
        this.topics = this.$store.state.topics.searchedAllTopics
        if(this.topics !== null){
          return this.topics
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import './../css/variables'
  .display-details
    display flex
    justify-content space-between
  .row-name
    display flex
    align-items flex-start
    max-width 400px
    .button-submit
      max-height 30px
      margin-left 10px
    .button-submit-reverse
      background-color inherit
      border 1px solid primary-color
      padding 5px 10px
      color primary-color
  @media (max-width 450px)
    .display-details
      flex-direction column-reverse
      justify-content center
    .user-details
      margin 15px 0
      text-align center!important
      .display-name
        margin 0 auto!important
    .crop-image
      margin-left auto!important
      margin auto
    .button-submit
      margin-left auto!important
      margin 10px auto
    .row-name
      flex-direction column-reverse
      justify-content center
  @media (max-width 750px)
    .user-topics
      overflow auto
      white-space nowrap
      flex-wrap nowrap!important
  .user-topics-header
    margin 20px 0
    display flex
    align-items center
    .user-topics
      display flex
      align-items center
      max-width 100%
      flex-wrap wrap
      .topics
        background-color primary-color
        color white
        margin 2px 0
        margin-right 5px
        padding 5px
        border-radius 5px
        cursor pointer
  .btn-link
    color #ccc
    background none
    border none
    outline none
    cursor pointer
    font-weight 500
    padding-left 15px
  .profile
    padding-top 2rem
    justify-content center
  .wrapper
    margin-left auto
    margin-right auto
    padding 10px
  .user-details
    text-align left
    .display-name
      font-weight 600
      margin 0
    .display-website a
      text-decoration none
      color primary-color
      &:hover
        font-weight bold
    .text-muted
      padding-top 15px
      font-weight 400
      max-width 400px
  .crop-image
    background-position center
    background-size: cover
    background-repeat no-repeat
    border-radius 50%
    min-width 100px
    width 100px
    height 100px
    margin-left 15px
    overflow hidden
    transition all .5s ease
    &:hover
      width 120px
      height 120px
  .profile-img
    width inherit
  .edit-link
    padding 10px
    text-align left
    margin 0 auto
    a
      color primary-color
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
