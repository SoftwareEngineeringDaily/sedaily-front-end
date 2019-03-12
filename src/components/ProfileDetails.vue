<template>
    <div class="row profile justify-content-left">
      <h6 v-if="ownProfile" class="col-12 edit-link">
        <router-link :to="'/edit-profile'">
          Edit Profile
        </router-link>
        |
         <router-link class="link" :to="{ name: 'NotificationSettings', params: {}}">
           Edit Notification Settings
         </router-link>
         |
         <button class="btn-link" @click="showModal">Edit Topics</button>
         <modal
           id="topic-modal"
           v-show="isModalVisible"
           @close="closeModal">
           <!-- header-->
           <h2 slot="header">Edit Topics</h2>
           <!-- body-->
           <div slot="body">
             <div>
               <div class='search-bar'>
                 <input id="search" class='search-bar-input' type='text' placeholder='Search...' v-model='searchTopic' debounce="900"/>
               </div>
               <br>
               <ul v-if="this.$store.state.topics.all.length > 0" class="popular-topics" >
                 <li class="popular-topic" v-for="item in filterItems(topics)" :key="item.id">
                   <label class="container" :for="item.id">
                     {{ item.name }}
                     <input type="checkbox" :id="item.id" :value="item._id" v-model="checkedTopics">
                     <span class="checkmark"></span>
                   </label>
                 </li>
               </ul>
               <span v-else class='no-topic'>Ups! There is no topics added yet..</span>
             </div>
           </div>
           <!-- footer-->
           <span slot="footer">
            <button type="button" class="btn-submit" @click="selectTopicsToUser">Submit</button>
           </span>
         </modal>
         |
         <a
           href="/"
           name="logouts-nav-link"
           @click.prevent="logoutHandler">Logout</a>
      </h6>
      <div class="wrapper">
        <div class="col col-sm-auto">
          <div class="crop-image">
            <img class="profile-img" :src="avatarUrl" />
          </div>
        </div>
        <div class="user-details col-sm-6 col-md-4">
          <h4 class="display-name">
            {{displayName}}
          </h4>
          <p class="display-bio">
            <small class="text-muted">{{displayBio}}</small>
          </p>
          <p class="display-website" v-if="userData.website">
            <a :href="userData.website | externalUrl" target="_blank"
               rel="external nofollow"
            > {{ userData.website | host }} </a>
          </p>
        <hr/>
        </div>
      </div>
  </div>
</template>

<script>
  import modal from '@/components/ModalComponent.vue'
  import { mapState, mapActions } from 'vuex'
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
        items: [],
        searchTopic: '',
        checkedTopics: [],
        topics:[],
      }
    },
    mounted () {
      this.getTopics()
    },
    computed: {
      ...mapState({
        displayName () {
          return this.userData.name || this.userData.username
        },
        displayBio () {
          return this.userData.bio || `${this.displayName} is still writing their biography`
        },
        avatarUrl (state) {
          return this.userData.avatarUrl || state.placeholderAvatar
        }
      })
    },
    methods: {
      ...mapActions(['getUserTopics','createTopic','getAllTopics','addTopicToUser']),
      logoutHandler () {
        this.$auth.logout()
        this.$router.replace('/')
      },
      showModal() {
        this.checkedTopics = []
        this.$store.state.topics.user.map((item) => {
          this.checkedTopics.push(item._id)
        })
        this.isModalVisible = true;
        $("body").addClass("modal-open")
      },
      closeModal() {
        this.isModalVisible = false;
        $("body").removeClass("modal-open")
      },
      getTopics() {
        this.getAllTopics()
        this.getUserTopics().then(this.updateTopicsChecked)
      },
      updateTopicsChecked() {
        if(this.checkedTopics === "created"){
          this.checkedTopics = []
          this.$store.state.topics.user.map((item) => {
            this.checkedTopics.push(item._id)
          })
        }
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
        this.addTopicToUser(userTopics)
        this.getTopics()
        this.closeModal()
      },
      filterItems: function() {
        const app = this
        this.items = this.$store.state.topics.user
        this.topics = this.$store.state.topics.all
        if(this.topics !== null){
          return this.topics.filter(function(item) {
            let regex = new RegExp('(' + app.searchTopic + ')', 'i');
            return item.name.match(regex);
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import './../css/variables'
  .btn-link
    color accent-color
    background none
    border none
    outline none
    cursor pointer
    font-weight 500
  .profile
    padding-top 2rem
  .wrapper
    margin-left auto
    margin-right auto
    width 960px

  .user-details
    margin-top -40px
    margin-left auto
    margin-right auto
    text-align center
    .display-name
      padding-top 50px
    .display-website a
      text-decoration none
      color primary-color
      &:hover
        font-weight bold
    .display-bio .text-muted
      font-weight bold

  .crop-image
    margin-left auto
    margin-right auto
    background-position 50%
    background-repeat no-repeat
    border-radius 50%
    width 100px
    height 100px
    overflow hidden
    transition all .5s ease
    &:hover
      width 120px
      height 120px

  .profile-img
    display inline
    margin-left 0 auto
    height 100%
    width auto

  .edit-link
    padding 10px
    text-align center
    a
      color accent-color
  body.modal-open
    overflow hidden
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
  .popular-topics::-webkit-scrollbar
    width 5px
  .popular-topics::-webkit-scrollbar-track
    background #f1f1f1
  .popular-topics::-webkit-scrollbar-thumb
    background #d0c6ff
  .popular-topics::-webkit-scrollbar-thumb:hover
    background #555
</style>
