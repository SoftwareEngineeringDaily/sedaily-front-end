<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <update-profile  v-if="username" :initialUsername="username" :me="me"> </update-profile>  
</v-flex>
</template>

<script>
import UpdateProfile from '@/components/UpdateProfile.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'edit-profile',
  components: { UpdateProfile },
  data () {
    return {
      loading: true,
      username: null
    }
  },
  beforeMount () {
    this.fetchMyProfileData()
      .then(() => {
        this.loading = false
        this.username = this.me.username
      })
  },
  methods: {
    ...mapActions([ 'fetchMyProfileData' ])
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
