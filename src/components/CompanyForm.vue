<template>
  <div>
    <h4 class="row" >{{ header }}</h4>



  </div>
</template>
<script>
export default {
  name: 'company-form',
  props: {
    header: {
      type: String,
      required: true
    }
  }
}

</script>
