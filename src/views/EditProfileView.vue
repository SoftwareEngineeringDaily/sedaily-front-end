<template>
  <div>
    <br />
    <br />
    <h2> Edit Your Profile:</h2>
    <update-profile  v-if="me" :initialUsername="me.username" :me="me"> </update-profile>
  </div>
</template>

<script>
import UpdateProfile from '@/components/UpdateProfile.vue'
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
