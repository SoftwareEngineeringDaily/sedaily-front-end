<template>
  <div class="update-profile-view container">
    <update-profile  v-if="me && me.username" :initialUsername="me.username" :me="me"> </update-profile>
  </div>
</template>

<script>
import UpdateProfile from '@/components/profile/UpdateProfile'
import { mapState } from 'vuex'

export default {
  name: 'edit-profile',
  components: { UpdateProfile },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    })
  }
}
</script>
<style scoped lang="stylus">
  @import '../../css/variables'
  .container
    margin 45px
</style>
