<template>
  <div>
    {{companyName}}
    <img :src='headerImage' />
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

      headerImage: {
        type: String,
        required: false
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
  width 300px

</style>
