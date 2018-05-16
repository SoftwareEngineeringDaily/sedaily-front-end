<template>
    <div class="row justify-content-left">
      <h6 v-if="ownProfile" class="col-12 edit-link">
        <router-link :to="'/edit-profile'">
          Edit Profile
        </router-link>
        |
         <router-link class="link" :to="{ name: 'NotificationSettings', params: {}}">
           Edit Notification Settings
         </router-link>

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
          <div class="social-icons">
            <p v-if="userData.publicEmail" class="display-email">
              <span class="text-muted"> <a :href="'mailto:' + userData.publicEmail"
                 rel="external nofollow"
              ><i class="fa fa-envelope-o" aria-hidden="true"></i></a></span>
            </p>
            <p v-if="userData.github" class="display-github">
              <span class="text-muted"> <a :href="userData.github | externalUrl" target="_blank"
                 rel="external nofollow"
              ><i class="fa fa-github" aria-hidden="true"></i></a></span>
            </p>
            <p v-if="userData.linkedin" class="display-linkedin">
              <span class="text-muted"> <a :href="userData.linkedin | externalUrl" target="_blank"
                 rel="external nofollow"
              ><i class="fa fa-linkedin" aria-hidden="true"></i></a></span>
            </p>
            <p v-if="userData.twitter" class="display-twitter">
              <span class="text-muted"> <a :href="userData.twitter | externalUrl" target="_blank"
                 rel="external nofollow"
              ><i class="fa fa-twitter" aria-hidden="true"></i></a></span>
            </p>
          </div>
          <br/>
          <p class="display-website" v-if="userData.website">
            <a :href="userData.website | externalUrl" target="_blank"
               rel="external nofollow"
            > {{ userData.website | host }} <i class="fa fa-external-link" aria-hidden="true"></i> </a>
          </p>
        <hr/>
         <p class="display-about">
          <small class ="text-muted">{{displayAbout}}</small>
        </p>
        </div>
      </div>

      <div class="recent-activity">
        <h3>Recent Activity</h3>
        <div class="activity-card">
          <post-summary v-for="post in listenedPodcasts" :key="post" :post="post.postId"  v-on:play-podcast="playPodcast"><span class= "text">{{ post.createdAt | moment }}</span></post-summary>
        </div>
      </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import { mapState } from 'vuex'
  import PostSummary from 'components/PostSummary.vue'
  import Spinner from 'components/Spinner.vue'
  export default {
    name: 'profile-details',

    components: {
      PostSummary,
      Spinner
    },

    data: function () {
      return {
        listenedPodcasts: [],
        playingPost: { title: 'starting title' },
        type: 'new',
        showFilteringElements: true,
        endPoint: 'fetchListData',
        loading: false,
        endOfPosts: false,
        transition: 'slide-up',
        displayedPosts: [],
        categories: [
          {
            name: 'Business and Philosophy',
            id: '1068'
          },
          {
            name: 'Blockchain',
            id: '1082'
          },
          {
            name: 'Cloud Engineering',
            id: '1079'
          },
          {
            name: 'Data',
            id: '1081'
          },
          {
            name: 'JavaScript',
            id: '1084'
          },
          {
            name: 'Machine Learning',
            id: '1080'
          },
          {
            name: 'Open Source',
            id: '1078'
          },
          {
            name: 'Security',
            id: '1083'
          },
          {
            name: 'Hackers',
            id: '1085'
          },
          {
            name: 'Greatest Hits',
            id: '1069'
          }
        ],
        activeCategory: { name: 'All', id: null },
        searchTerm: null
      }
    },
    created: function() {
      this.listenedPodcast()
    },
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
            website: '',
            twitter: '',
            linkedin: '',
            github: '',
            website: '',
            about: '',
            publicEmail: ''
          }
        }
      },
      ownProfile: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      moment: function (date) {
        console.log(date)
        return moment(date).format('MMMM Do, YYYY');
      }
    },
    computed: {
      ...mapState({
        displayName () {
          return this.userData.name || this.userData.username
        },
        displayBio () {
          return this.userData.bio || `${this.displayName} is still writing their headline`
        },
        displayAbout () {
          return this.userData.about || `${this.displayName} is still writing their about section`
        },
        avatarUrl (state) {
          return this.userData.avatarUrl || state.placeholderAvatar
        }
      })
    },
    methods: {
      listenedPodcast () {
        var self = this;
        this.$http.get('http://localhost:4040/api/listened').then(function(response){
          if(response.status == "200"){
            console.log(response);
            self.listenedPodcasts = response.data
          } else {
            console.log("bad request")
          }
        })
      }
  }
}
</script>

<style scoped lang="stylus">
  @import './../css/variables'

  .display-name
    font-size: 32px
    font-weight: 200

  .wrapper
    margin-left auto
    margin-right auto
    width 960px

  .user-details
    margin-top -40px
    margin-left auto
    margin-right auto
    text-align center
    width 2000px
    .display-name
      padding-top 50px
    .display-website a
      text-decoration none
      color primary-color
      &:hover
        font-weight bold
    .display-bio .text-muted
      font-weight: bold;
      text-transform: uppercase;
      font-size: 12px
      opacity: 0.7

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

  .social-icons p
    display inline
    padding 10px
    font-size: 20px

  .recent-activity
    width 1800px
    margin 50px

  .date-listened
    padding-top 20px
    width 2100px

  .text{
    font-family 'Roboto'
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px
    opacity: 0.5
  }

  .activity-card
    flex-direction: column;

  .news-post
    display list-item !important
    flex-direction row !important
    margin-bottom: 100px !important
    width 100% !important
    border-top 200px solid #999 !important
    border-right 200px solid #999 !important
    border 200px solid #999 !important

  .post-summary
    border 20px solid #999 !important

  .profile-img
    display inline
    margin-left 0 auto
    height 100%
    width auto

  .edit-link
    padding 10px
    text-align center
    a
      color primary-color
</style>
