<template>
  <div class="container">
    <template v-if="loading">
      <spinner :show="loading"></spinner>
    </template>
    <template v-else-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </template>
    <template v-else>
      <profile-details
        :userData="me"
        :ownProfile="true" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProfileDetails from '@/components/ProfileDetails.vue'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'profile-view',
  components: {
    ProfileDetails,
    Spinner
  },
  data () {
    return {
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapState([
      'me'
    ])
  }
}
</script>
