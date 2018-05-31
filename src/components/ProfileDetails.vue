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
          <post-summary v-for="(post, i) in posts" :key="i" :post="post.postId" ><span class= "text">{{ post.createdAt | moment }}</span></post-summary>
        </div>
      </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import { mapState, mapActions } from 'vuex'
  import PostSummary from 'components/PostSummary.vue'
  import VotingArrows from 'components/VotingArrows'
  import Spinner from 'components/Spinner.vue'
  export default {
    name: 'profile-details',

    components: {
      PostSummary,
      Spinner,
      VotingArrows
    },

    data: function () {
      return {
        posts: []
      }
    },

    mounted () {
      this.fetchData()
      console.log(this.post)
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
      },
    },

    filters: {
      moment: function (date) {
        console.log(date)
        return moment(date).format('MMMM Do, YYYY');
      }
    },

    methods: {
      ...mapActions(['fetchListenedPodcasts', 'upvoteRelatedLink']),
      async fetchData () {
        this.loading = true
        try {
          const response = await this.fetchListenedPodcasts({ userId: this.userId })
          this.posts = response.data
        }
        catch (error) {
          this.error = error.response.data.message
        }
        finally {
          this.loading = false
        }
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
          console.log(this.listenedPodcasts)
          return this.userData.about || `${this.displayName} is still writing their about section`
        },
        avatarUrl (state) {
          return this.userData.avatarUrl || state.placeholderAvatar
        },
        userId (state) {
          return this.userData._id
        },
        active() {
          return active = true
        }
      })
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

  .text{
    font-family 'Roboto'
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px
    opacity: 0.5
    position: absolute;
    margin-top: -50px
    margin-left: -16px
  }

  .activity-card
    flex-direction: column;
    padding-top: 50px

  .news-post
    margin-bottom: 50px !important
    width 100% !important
    border 2px solid #eee !important

  .post-summary
    padding-top: -50px !important

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
