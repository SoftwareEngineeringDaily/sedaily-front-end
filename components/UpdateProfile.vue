<template>
  <div class="update-profile-view container">
    <div class="row">
      <div
        class="col-md-10 offset-md-1"
        @submit.prevent="submit">

        <div v-if="showExisintAvatarUrl">
          <img :src="avatarUrl">
        </div>

        <div class="form-group">
          <div v-if="!image">
            <h2>Select an image</h2>
            <input
              type="file"
              @change="onFileChange">
          </div>
          <div v-else>
            <img :src="image">
            <button @click="removeImage">Remove image</button>
          </div>
        </div>

        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input
            v-validate="'required'"
            id="usernameInput"
            v-model="username"
            type="username"
            name="username"
            class="form-control"
            aria-describedby="usernameHelp"
            placeholder="Username">

          <div
            v-show="errors.has('username')"
            class="alert alert-danger">
            {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="nameInput">Name</label>
          <input
            v-validate="'required'"
            id="nameInput"
            v-model="name"
            type="text"
            name="name"
            class="form-control"
            aria-describedby="nameHelp"
            placeholder="Alex Smith">

          <div
            v-show="errors.has('name')"
            class="alert alert-danger">
            {{ errors.first('name') }}</div>
        </div>

        <div class="form-group">
          <label for="bioInput">Bio</label>
          <input
            id="bioInput"
            v-model="bio"
            type="text"
            class="form-control"
            aria-describedby="bioHelp"
            placeholder="A short bio">
        </div>

        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input
            v-validate="{ required: false, email: true}"
            id="emailInput"
            v-model="email"
            type="email"
            name="email"
            class="form-control"
            aria-describedby="emailHelp"
            placeholder="youremail@email.com">
          <div
            v-show="errors.has('email')"
            class="alert alert-danger">
            {{ errors.first('email') }}</div>
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input
            id="websiteInput"
            v-model="website"
            type="text"
            class="form-control"
            aria-describedby="websiteHelp"
            placeholder="yourWebsite.com">
        </div>

        <button
          :disabled="loading"
          class="button-submit"
          @click.prevent="submit">
          Update
        </button>
        {{ msg }}
      </div>
    </div>

    <spinner :show="loading" />
  </div>
</template>

<script>

// Maybe this can be a simple updater of profiles etc:
import Spinner from '~/components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    Spinner
  },
  props: {
    initialUsername: {
      type: String,
      required: true
    },
    me: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      msg: '',
      image: '',
      file: null,
      username: this.initialUsername,
      name: this.me ? this.me.name : '',
      email: this.me ? this.me.email : '',
      bio: this.me ? this.me.bio : '',
      website: this.me ? this.me.website : '',
      loading: false
    }
  },

  computed: {
    // local computed methods +
    ...mapState({

      id (state) {
        return this.me._id
      },

      avatarUrl (state) {
        return this.me.avatarUrl
      },

      showExisintAvatarUrl (state) {
        return this.me.avatarUrl && !this.image
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
          const { username, email, bio, website, name, id } = this

          let updatePromise = null
          if (this.file) {
            updatePromise = this.uploadAvatarImage({ imageFile: this.file })
              .then((imageSuccess) => {
                return this.updateProfile({
                  username,
                  id,
                  name,
                  bio,
                  isAvatarSet: true,
                  website,
                  email
                })
              })
              .catch((error) => {
                console.log('Error uploading', error)
                alert('Error uploading')
              })
          } else {
            updatePromise = this.updateProfile({
              username,
              id,
              name,
              bio,
              isAvatarSet: this.avatarUrl == null,
              website,
              email
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
              alert('There was a problem updating your profile')
            })
        } else {
          this.msg = 'Invalid fields on form :('
        }
      })
    }
  }
}
</script>
