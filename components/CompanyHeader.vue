<template>
  <div>
    <h1>
      {{ companyName }}
    </h1>

    <img :src="headerImage" >
    <p v-if="description">
      {{ description }}
    </p>

    <p v-if="externalUrl">
      Find out more about {{ companyName }} <a
        :href="externalUrl"
        target="_blank">here</a>.
    </p>
    <br>
    <br>
    <h3>
      Open Positions
    </h3>
    <br>
  </div>
</template>

<script>
  export default {
    name: 'CompanyHeader',
    props: {
      companyName: {
        type: String,
        required: true
      },

      description: {
        type: String,
        required: false,
        default: null
      },

      externalUrl: {
        type: String,
        required: false,
        default: null
      },

      headerImage: {
        type: String,
        required: false,
        default: null
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="stylus">
img
  max-width 300px

</style>
