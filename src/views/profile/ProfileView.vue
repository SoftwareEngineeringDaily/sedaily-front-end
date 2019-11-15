<template>
  <div>
    <template v-if="loading">
      <div class="center">
        <spinner :show="loading"></spinner>
      </div>
    </template>
    <template v-else-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </template>
    <template v-else>
      <div class="profile-view col-md-12">
        <profile-details
        :userData="me"
        :ownProfile="true" />
      </div>
    </template>
  </div>
</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import ProfileDetails from '@/components/profile/ProfileDetails'
import Spinner from '@/components/Spinner'

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
    ...mapState({
      me (state) {
        return state.me
      }
    })
  }
}
</script>
<style lang="stylus">
.center
  text-align center
  margin 5vh 0
</style>
