<template>
  <div>
    <b-input-group>
      <b-form-input list="usersList" autocomplete="off" v-model="selectedOption" debounce="500" @input="onInput" @change="onChange"></b-form-input>
      <template v-slot:append>
        <div class="append">
          <div v-show="stateIdle">...</div>
          <spinner :show="stateLoading"></spinner>
          <div v-show="stateErase"><img class='erase' src="@/assets/icons/x.png" @click='erase'/></div>
        </div>
      </template>
    </b-input-group>
    <datalist id="usersList"> 
      <option v-for="user in users" :key="user._id">
        {{ user.name }} ({{ user.email }})
      </option>
    </datalist>
    <small id="routeHelp" class="form-text text-muted">{{ message }}</small>
    <div v-if="selectedUser" class="selected-user">
      <div class="avatar">
        <img :src="getAvatar(selectedUser)" @error="onAvatarError(selectedUser)"/>
      </div>
      <div class="user-details">
        {{ selectedUser.name }}<br/>
        {{ selectedUser.email }}<br/>
        {{ selectedUser.bio }}<br/>
        {{ selectedUser.website }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import Spinner from "@/components/Spinner.vue";

export default {
  components: {
    Spinner
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      selectedOption: null,
      selectedUser: null,
      message: '',
      loading: false,
      users: [],
    }
  },
  beforeMount () {
    if (this.value && this.value.name) {
      this.selectedOption = `${this.value.name} (${this.value.email})`
      this.selectedUser = this.value
    }
  },
  computed: {
    stateLoading () {
      return this.loading
    },
    stateErase () {
      return !this.loading && !!this.selectedUser
    },
    stateIdle () {
      return !this.stateLoading && !this.stateErase
    }
  },
  methods: {
    ...mapActions(["searchUsersComplete"]),

    onInput: debounce( function(value)  {
      if (value.length < 2) return
      this.loadUsers(value)
    },500),

    loadUsers (value) {
      this.loading = true
      this.users = []
      this.searchUsersComplete({ name: value }).then(users => {
        this.users = users
        this.loading = false
      });
    },

    getAvatar (user) {
      return user.errorImg || user.avatarUrl || 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
    },

    onAvatarError (user) {
      this.$set(user, 'errorImg', 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png')
    },

    onChange (selection) {
      const match = selection.match(/\(([^()]+)\)/)
      if (!match || !match.length || !match[1]) return
      this.selectedUser = this.users.find((u) => u.email === match[1])
      this.$emit('input', this.selectedUser)
    },

    erase () {
      this.selectedOption = ''
      this.selectedUser = null
      this.$emit('input', this.selectedUser)
    }
  }
}
</script>

<style scoped lang="stylus">
  .append
    border 1px solid rgb(206, 212, 218)
    border-left 0
    border-radius 0 .25rem .25rem 0
    width 32px
    display flex
    justify-content center
    align-items center

    .spinner
      width 30px
      height 30px
    
    .erase
      width 20px
      cursor pointer
  
  .selected-user
    display flex

    .avatar
      width 40px
      img
        width 40px
        border-radius  50%
        vertical-align middle
        border-style none

    .user-details
      flex 1
      padding 2px 10px 
</style>
