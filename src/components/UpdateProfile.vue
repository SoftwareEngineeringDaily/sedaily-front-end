<template>
  <div class="update-profile-view container">
    <div class='row'>
      <div class='col-md-10 offset-md-1' v-on:submit.prevent='submit'>

        <div v-if="showExisintAvatarUrl">
          <img :src="avatarUrl" />
        </div>

        <div class="form-group">
          <div v-if="!image">
            <h2>Select an image</h2>
            <input type="file" @change="onFileChange">
          </div>
          <div v-else>
            <img :src="image" />
            <button @click="removeImage">Remove image</button>
          </div>
        </div>

        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input type="username" v-model='username'
          id="usernameInput"
          name="username"
          v-validate="'required'"
          class="form-control"
          aria-describedby="usernameHelp"
          placeholder="Username">

          <div v-show="errors.has('username')"
          class="alert alert-danger">
          {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="nameInput">Name</label>
          <input type="text" v-model='name'
          name="name"
          id="nameInput"
          class="form-control"
          v-validate="'required'"
          aria-describedby="nameHelp"
          placeholder="Alex Smith">

          <div v-show="errors.has('name')"
          class="alert alert-danger">
          {{ errors.first('name') }}</div>
        </div>

        <div class="form-group">
          <label for="bioInput">Bio</label>
          <input type="text" v-model='bio'
          id="bioInput"
          class="form-control"
          aria-describedby="bioHelp"
          placeholder="A short bio">
        </div>

        <div class="form-group">
          <label for="aboutInput">About</label>
          <textarea rows="5" type="text" v-model='about'
          id="aboutText"
          class="form-control"
          aria-describedby="aboutHelp"
          placeholder="A summary of your professional skills or experience as a software engineer.">
          </textarea>
        </div>

        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input type="email"
          v-model='email'
          v-validate="{ required: false, email: true}"
          name='email'
          class="form-control" id="emailInput"
          aria-describedby="emailHelp"
           placeholder="youremail@email.com">
           <div v-show="errors.has('email')"
           class="alert alert-danger">
           {{ errors.first('email') }}</div>
        </div>

        <div class="form-group">
          <label for ="publicEmailInput">Public Email</label>
          <input type="email"
          v-model="publicEmail"
          v-validate="{ required: false, email: true}"
          class="form-control" id="publicEmailInput"
          aria-describedby="publicEmailHelp"
          placeholder="youremail@email.com">
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input type="text" v-model='website'
          id="websiteInput"
          class="form-control"
          aria-describedby="websiteHelp"
          placeholder="yourWebsite.com">
        </div>

        <div class="form-group">
          <label for="websiteInput">GitHub</label>
          <input type="text" v-model='github'
          id="githubInput"
          class="form-control"
          aria-describedby="githubHelp"
          placeholder="http://github.com/username">
        </div>

        <div class="form-group">
          <label for="websiteInput">LinkedIn</label>
          <input type="text" v-model='linkedin'
          id="linkedinInput"
          class="form-control"
          aria-describedby="linkedinHelp"
          placeholder="http://linkedin.com/in/username">
        </div>

        <div class="form-group">
          <label for="websiteInput">Twitter</label>
          <input type="text" v-model='twitter'
          id="twitterInput"
          class="form-control"
          aria-describedby="twitterHelp"
          placeholder="http://twitter.com/username">
        </div>

        <button
        class='button-submit'
        @click.prevent='submit' :disabled='loading'>
          Update
        </button>
        {{msg}}
      </div>
    </div>

    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
// Maybe this can be a simple updater of profiles etc:
import Spinner from 'components/Spinner.vue'
import { mapState, mapActions } from 'vuex'
// TODO: remove usename update for now?
export default {
  name: 'update-profile',
  props: {
    initialUsername: {
      type: String,
      required: true
    },
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
      username: this.initialUsername,
      name: this.me ? this.me.name : '',
      email: this.me ? this.me.email : '',
      publicEmail: this.me ? this.me.publicEmail : '',
      linkedin: this.me ? this.me.linkedin : '',
      twitter: this.me ? this.me.twitter : '',
      github: this.me ? this.me.github : '',
      bio: this.me ? this.me.bio : '',
      about: this.me ? this.me.about : '',
      website: this.me ? this.me.website : '',
      loading: false
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      id (state) {
        return state.me._id
      },

      avatarUrl (state) {
        return state.me.avatarUrl
      },

      showExisintAvatarUrl (state) {
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
      console.log(image)
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
          const { username, email, publicEmail, linkedin, twitter, github, about, bio, website, name, id } = this

          let updatePromise = null
          if (this.file) {
            updatePromise = this.uploadAvatarImage({ imageFile: this.file })
              .then((imageSuccess) => {
                return this.updateProfile({
                  username,
                  id,
                  name,
                  bio,
                  linkedin,
                  twitter,
                  github,
                  about,
                  isAvatarSet: true,
                  website,
                  email,
                  publicEmail
                })
              })
              .catch((error) => {
                console.log('Error uploading', error)
                this.$toasted.error('Error uploading')
              })
          } else {
            updatePromise = this.updateProfile({
              username,
              id,
              name,
              bio,
              linkedin,
              twitter,
              github,
              about,
              isAvatarSet: this.avatarUrl == null,
              website,
              email,
              publicEmail
            })
          }

          updatePromise
            .then((response) => {
              this.loading = false
              // This means we are just updating our profile:
              // TODO: have it be a componenet that is passed on
              if (this.me) {
                this.msg = 'Success, your profile was Updated :)'
              }
            })
            .catch((error) => {
              console.log('Error Updaating', error)
              this.$toasted.error('There was a problem updating your profile')
            })
        } else {
          this.msg = 'Invalid fields on form :('
        }
      })
    }
  }
}
</script>
