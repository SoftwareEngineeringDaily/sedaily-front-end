<template>
  <div>
    <b-input-group>
      <b-form-input
        list="usersList"
        autocomplete="off"
        :placeholder="placeholder"
        v-model="query"
        debounce="500"
        @input="onInput"
        @change="onChange" />

      <datalist id="usersList">
        <option v-for="user in users" :key="user._id">
          {{ user.name }} ({{ user.email }})
        </option>
      </datalist>
    </b-input-group>

    <small id="routeHelp" class="form-text text-muted">{{ message }}</small>

    <ul class="selector">
      <li v-if="selectedUsers" v-for="selectedUser in selectedUsers" :key="selectedUser._id" class="selector-item">
        <div class="avatar">
          <img :src="getAvatar(selectedUser)" @error="onAvatarError(selectedUser)"/>
        </div>
        <div class="user-details">
          <h3 v-if="selectedUser.name">{{ selectedUser.name }}</h3>
          <div class="user-details-meta">
            <div v-if="selectedUser.email">{{ selectedUser.email }}</div>
            <div v-if="selectedUser.website">{{ selectedUser.website }}</div>
          </div>
          <div v-if="selectedUser.bio">{{ selectedUser.bio }}</div>
        </div>
        <button
          @click="() => onRemoveOption(selectedUser._id)">
          <i class="fa fa-close"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import Spinner from "@/components/Spinner.vue";

export default {
  name: 'select-multi-user-input',

  components: {
    Spinner,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Search users',
    }
  },

  data () {
    return {
      selectedUsers: [],
      query: '',
      message: '',
      loading: false,
      users: [],
    }
  },

  beforeMount () {
    this.selectedUsers = this.value || []
  },

  computed: {
    stateLoading () {
      return this.loading
    },

    stateIdle () {
      return !this.stateLoading && !this.stateErase
    },
  },

  methods: {
    ...mapActions([
      'searchUsersComplete'
    ]),

    onInput (value) {
      if (value.length < 2) {
        return
      }

      this.loadUsers(value)
    },

    async loadUsers (value) {
      this.loading = true

      const users = await this.searchUsersComplete({ query: value })

      this.users = users
        .filter(u => !find(this.selectedUsers, { email: u.email }))

      this.loading = false
    },

    getAvatar (user) {
      return user.errorImg || user.avatarUrl || 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
    },

    onRemoveOption (id) {
      this.selectedUsers = this.selectedUsers.filter(u => u._id !== id)
    },

    onAvatarError (user) {
      this.$set(user, 'errorImg', 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png')
    },

    onChange (selection) {
      const match = selection.match(/\(([^()]+)\)/)

      if (!match || !match.length || !match[1]) {
        return
      }

      this.selectedUsers.push(this.users.find((u) => u.email === match[1]))
      this.selectedUsers = uniqBy(this.selectedUsers, '_id')
      this.query = ''

      // this.$emit('input', this.selectedUsers)
      // this.$emit('onChange', this.selectedUsers)
    },

    erase () {
      this.selectedUsers = []
      this.$emit('input', this.selectedUsers)
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

.selector
  padding 10px 0 0

.selector-item
  display flex
  padding 10px
  margin-bottom 10px
  background-color #f8f9fa

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
    font-size 12px

    h3
      margin-bottom 0
      font-size 14px
      font-weight 700

  .user-details-meta > *
    display inline-block
    margin-left 8px
    padding-left 8px
    color #a591ff
    border-left 1px solid #888

    &:first-child
      margin-left 0
      padding-left 0
      border-left none

  button
    appearance none
    background-color transparent
    border none

</style>
