<template>
  <div>
    <div class="display-details">
      <div class="crop-image">
        <img class="profile-img" :src="errorImg || avatarUrl" @error="imgOnError">
      </div>
      <div v-if="userData" class="user-details">
        <div class="row-name">
          <h3 class="display-name">
            {{ displayName }} {{ displayLastName }}
          </h3>
          <router-link
            v-if="ownProfile"
            class="button-submit button-submit-reverse"
            to="/edit-profile">
            <i class="fa fa-pencil" />
            <span>Edit Profile</span>
          </router-link>
        </div>

        <p>{{ displayBio }}</p>
      </div>
    </div>

    <div class="profile-footer" v-if="hasConnections">
      <label class="text-muted">Connect:</label>

      <a
        v-if="userData.twitter"
        :href="`https://twitter.com/${userData.twitter}`"
        :title="userData.twitter"
        target="_blank"
        rel="external nofollow">
        <i class="fa fa-twitter fa-2x" />
      </a>

      <a
        v-if="userData.website"
        :href="userData.website | externalUrl"
        :title="userData.website | host"
        target="_blank"
        rel="external nofollow">
        <i class="fa fa-globe fa-2x" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

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
          lastName: '',
          website: '',
          twitter: ''
        }
      }
    },
    ownProfile: {
      type: Boolean,
      default: false
    }
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
      errorImg: ''
    }
  },

  computed: {
    ...mapGetters(["isLoggedIn"]),

    ...mapState({
      displayName () {
        return this.userData.name || this.userData.username
      },
      displayLastName () {
        return this.userData.lastName || ''
      },
      displayBio () {
        return this.userData.bio || `${this.displayName} is still writing their biography`
      },
      avatarUrl(state) {
        return (this.userData) ? this.userData.avatarUrl || state.placeholderAvatar : state.placeholderAvatar
      },
      publicLink (state) {
        if (!this.userData || !this.userData.name) return null;
        return `/profile/${this.userData._id}`
      }
    }),

    hasConnections () {
      return (this.userData && (this.userData.twitter || this.userData.website))
    },
  },

  methods: {
    ...mapActions([
      'getUserTopics',
      'getSearchedTopics',
      'addTopicToUser',
      'fetchPublicProfileData'
    ]),

    imgOnError(event) {
      this.errorImg = 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
    },
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'

.display-details
  display flex
  justify-content stretch
  margin 0 auto 1rem
  padding 10px

.row-name
  display flex
  align-items flex-start
  margin-bottom 1rem

.display-name
  flex-grow 1

.button-submit
  min-width auto
  height auto
  text-align center
  line-heigt 30px
  padding 6px 12px

  span
    margin-left 4px

  &:hover
    color #fff
    text-decoration none
    background-color #222

.button-submit-reverse
  color primary-color
  background-color inherit
  border 1px solid primary-color

.user-details
  flex-grow 1
  padding 0 1rem

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
  overflow hidden
  width 128px
  min-width 128px
  height 128px
  margin-top 0.4rem
  margin-right 1rem
  border-radius 64px

.profile-img
  width inherit

.profile-footer
  display flex
  align-items center
  justify-content flex-start
  margin-bottom 2rem
  padding 1rem 10px
  border-top 1px solid #e9ecef
  border-bottom 1px solid #e9ecef

  .fa-twitter:hover
    color #1da1f2

  .fa-globe:hover
    color #a591ff

  label
    margin-bottom 0

  & > *
    margin-right 1.5rem

@media (max-width 750px)
  .crop-image
    width 64px
    min-width 64px
    height 64px

  .button-submit span
    display none

</style>
