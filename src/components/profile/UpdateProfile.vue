<template>
  <div>
    <div class="row">
      <form class="col-md-6 offset-md-3" v-on:submit.prevent="submit">
        <div class="row">
        </div>
        <h1>Edit Profile</h1>
        <div class="crop-edit-image" v-if="showExistingAvatarUrl">
          <img class="edit-profile-img" :src="avatarUrl" />
        </div>

        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input type="email"
          id="emailInput"
          v-model="email"
          v-validate="{ required: false, email: true}"
          disabled
          name="email"
          class="form-control"
          aria-describedby="emailHelp"
          placeholder="youremail@email.com">

          <div v-show="errors.has('email')" class="alert alert-danger">
            {{ errors.first("email") }}
          </div>
        </div>

        <div class="form-group">
          <div v-if="!image">
            <label for="file">Select an image <span class="public-info"/></label>
            <input class="form-control fileInput" type="file" @change="onFileChange">
          </div>
          <div v-else>
            <div class="crop-edit-image">
              <img class="edit-profile-img" :src="image" />
            </div>
            <button @click="removeImage">Remove image</button>
          </div>
        </div>

        <div class="form-group">
          <label for="nameInput">Name <span class="public-info"/></label>
          <input type="text" 
          v-model="name"
          name="name"
          id="nameInput"
          class="form-control"
          v-validate="'required'"
          aria-describedby="nameHelp"
          placeholder="Alex">

          <div v-show="errors.has('name')" class="alert alert-danger">
            {{ errors.first("name") }}
          </div>
        </div>

        <div class="form-group">
          <label for="LastNameInput">Last name <span class="public-info"/></label>
          <input type="text" 
          v-model="lastName"
          name="lastName"
          id="LastNameInput"
          class="form-control"
          v-validate="'required'"
          aria-describedby="lastNameHelp"
          placeholder="Smith">

          <div v-show="errors.has('LastName')" class="alert alert-danger">
            {{ errors.first("LastName") }}
          </div>
        </div>

        <div class="form-group">
          <label for="twitterInput">Twitter account <span class="public-info"/></label>
          <input type="text" 
          v-model="twitter"
          name="twitter"
          id="twitterInput"
          class="form-control"
          aria-describedby="twitterHelp"
          placeholder="alexsmith">

          <div v-show="errors.has('twitter')" class="alert alert-danger">
            {{ errors.first("twitter") }}
          </div>
        </div>

        <div class="form-group">
          <label for="bioInput">Bio <span class="public-info"/></label>
          <input type="text" 
          v-model="bio"
          id="bioInput"
          class="form-control"
          aria-describedby="bioHelp"
          placeholder="A short bio">
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input type="text" 
          v-model="website"
          id="websiteInput"
          class="form-control"
          aria-describedby="websiteHelp"
          placeholder="yourWebsite.com">
        </div>

        <button
        class="button-submit" @click.prevent="submit" :disabled="loading">
          Update
        </button>
        {{msg}}
        <spinner :show="loading"></spinner>
      </form>
    </div>
  </div>
</template>

<script>
// Maybe this can be a simple updater of profiles etc:
import Spinner from '@/components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'update-profile',
  props: {
    me: {
      type: Object,
      required: false
    }
  },
  components: {
    Spinner
  },

  data () {
    return {
      msg: '',
      image: '',
      file: null,
      name: this.me ? this.me.name : '',
      lastName: this.me ? this.me.lastName : '',
      email: this.me ? this.me.email : '',
      bio: this.me ? this.me.bio : '',
      website: this.me ? this.me.website : '',
      twitter: this.me ? this.me.twitter : '',
      loading: false
    }
  },

  computed: {
    ...mapState({
      id (state) {
        return state.me._id
      },

      avatarUrl (state) {
        return state.me.avatarUrl
      },

      showExistingAvatarUrl (state) {
        return state.me.avatarUrl && !this.image
      }

    })
  },
  methods: {
    ...mapActions(['updateProfile', 'uploadAvatarImage']),

    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.file = null
        return
      }
      const file = files[0]
      this.file = file
      this.createImage(file)
    },

    createImage (file) {
      var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    removeImage (e) {
      this.file = null
      this.image = ''
    },

    submit () {
      this.msg = ''
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { bio, website, name, id, lastName, twitter } = this
          const cleanTwitter = (twitter) ? twitter.replace('@','') : null
          let updatePromise = null
          if (this.file) {
            updatePromise = this.uploadAvatarImage({ imageFile: this.file })
              .then((imageSuccess) => {
                return this.updateProfile({
                  id,
                  name,
                  lastName,
                  bio,
                  isAvatarSet: true,
                  website,
                  cleanTwitter
                })
              })
              .catch((error) => {
                console.log('Error uploading', error)
                this.$toasted.error('Error uploading', { 
                    singleton: true,
                    theme: "bubble", 
                    position: "bottom-center", 
                    duration : 700
                })
              })
          } else {
            updatePromise = this.updateProfile({
              id,
              name,
              lastName,
              bio,
              isAvatarSet: false,
              website,
              cleanTwitter
            })
          }

          updatePromise
            .then((response) => {
              this.loading = false
              // This means we are just updating our profile:
              // TODO: have it be a componenet that is passed on
              if (this.me) {
                this.msg = 'Success, your profile was Updated :)'
                setTimeout(() => this.$router.push('/profile') , 1000)
              }
            })
            .catch((error) => {
              console.log('Error Updaating', error)
              this.$toasted.error('There was a problem updating your profile', { 
                  singleton: true,
                  theme: "bubble", 
                  position: "bottom-center", 
                  duration : 700
              })
            })
        } else {
          this.msg = 'Invalid fields on form :('
        }
      })
    }
  }
}
</script>
<style lang="stylus">
  @import '../../css/variables'
  .fileInput
    padding 3px !important
    display ruby-text-container
  .edit-profile-img
    display: inline;
    height: 100%;
    width: auto;

  .crop-edit-image
    background-position 50%
    background-repeat no-repeat
    border-radius 50%
    margin 15px 0
    width 100px
    height 100px
    overflow hidden
  
  .public-info
    color light-grey

  .public-info:before
    content "*Public"
</style>
