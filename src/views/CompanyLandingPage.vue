<template>
  <div class="login-view container">
    <company-header
    companyName="Company Z"
    headerImage="http://softwareengineeringdaily.com/wp-content/uploads/2018/02/box1200x630.jpg" />
  </div>
</template>

<script>

import CompanyHeader from '@/components/CompanyHeader.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CompanyLandingPage',

  components: {
    CompanyHeader
  },

  computed: {
    ...mapState({
    })
  },

  data () {
    return {
    }
  },

  methods: {
    ...mapActions(['companiesFetch', 'fetchMyProfileData'])
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
