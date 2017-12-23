<template>
  <v-form>
    <div class="headline">Update Profile</div>

    <div v-if="showExistingAvatarUrl">
      <img :src="avatarUrl" />
    </div>

    <div class="form-group">
      <div v-if="!image">
        <div class="headline">Select an image</div>
        <input type="file" @change="onFileChange">
      </div>
      <div v-else>
        <img :src="image" />
        <v-btn @click.prevent="removeImage">Remove image</v-btn>
      </div>
    </div>

    <v-text-field 
      label="Username" 
      v-model="username"
      v-validate="'required'" 
      :error-messages="errors.collect('username')"
      @keyup.enter.prevent="submit"
      data-vv-name="username"
      required />  

    <v-text-field 
      @keyup.enter.prevent="submit"
      label="Name" 
      v-model="name"
      v-validate="'required'"
      :error-messages="errors.collect('name')"
      data-vv-name="name"
      required />

    <v-text-field 
      label="Bio" 
      @keyup.enter.prevent="submit"
      v-model="bio" /> 

    <v-text-field 
      label="Email address" 
      v-model="email"
      @keyup.enter.prevent="submit"
      type="email"
      v-validate="'required'"
      :error-messages="errors.collect('email')"
      data-vv-name="email"
      required />

    <v-text-field 
      label="Website" 
      @keyup.enter.prevent="submit"
      v-model="website" />
  
    <v-layout row>
      <v-flex xs6>{{ msg }}</v-flex>
      <v-flex xs6 class="text-xs-right">
        <v-btn  @click.prevent='submit' :disabled="loading">Submit</v-btn>
      </v-flex>
    </v-layout>
    
    <spinner :show="loading"></spinner>
  </v-form>
</template>

<script>
/* @flow */
import Spinner from './Spinner.vue'
import { mapState, mapActions } from 'vuex'

export default {
  $validates: true,
  name: 'update-profile',
  props: {
    initialUsername: {
      type: String,
      required: true
    },
    me: {
      type: Object,
      required: true
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
      bio: this.me ? this.me.bio : '',
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
          const {username, email, bio, website, name, id} = this

          let updatePromise = null
          if (this.file) {
            updatePromise = this.uploadAvatarImage({imageFile: this.file})
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
