<template>
  <v-form>
    <v-text-field
      v-model="url"
      data-vv-name="url"
      textarea
      v-validate="'required|url'"
      @keyup.enter.prevent="submit"
      :error-messages="errors.collect('url')"
      :disabled="isSubmitting"     
      label="Add a related link..."
    />        

    <v-text-field 
      label="Add a short title..." 
      v-model="title"
      type="title"
      v-validate="'required'"
      @keyup.enter.prevent="submit"
      :error-messages="errors.collect('title')"
      data-vv-name="title"
      required />

    <v-layout row>
      <v-flex xs6>
        <span v-if="isSubmitting">
          <spinner :show="true"></spinner>
        </span>
      </v-flex>
      <v-flex xs6 class="text-xs-right">        
        <v-btn :disabled="isSubmitting" @click.prevent='submit'>Add New Link</v-btn>  
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
/* @flow */
import Spinner from './Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'related-link-compose',
  components: {
    Spinner
  },
  data () {
    return {
      url: '',
      title: '',
      isSubmitting: false,
      loading: true
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      },
      postId (state) {
        return state.route.params.id
      }
    })
  },
  methods: {
    ...mapActions(['relatedLinksCreate', 'relatedLinksFetch']),
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.isSubmitting = true
          this.relatedLinksCreate({
            postId: this.postId,
            title: this.title,
            url: this.url
          })
            .then((response) => {
              this.url = ''
              this.title = ''
              this.$nextTick(() => {
                this.errors.clear()
              })
              this.isSubmitting = false
              // Fetch comments
              this.relatedLinksFetch({
                postId: this.postId
              })
            })
            .catch((error) => {
              this.isSubmitting = false
              alert(error.response.data.message)
            })
        } else {
          alert('Sorry there was a problem :(')
        }
      })
    }
  }
}
</script>

<style scoped>
  .related-link-box {
    width: 100%;
    padding: 0px 5px;
    margin-bottom: 12px;
    border-radius: 2px;
    border-color: #c5c5c5;
  }

  .related-title-box {
    width: 100%;
    padding: 0px 5px;
    margin-bottom: 12px;
    border: none;
  }


</style>
