<template>
  <div>
    dsfds
    <h4 class="row" >{{ header }}</h4>
    <form>
      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Company Name</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="Company/Employer"
          id="companyNameInput"
          name="companyName"
          v-model="companyFormData.companyName"
          >
        </div>
      </div>
    </form>

  </div>
</template>

<script>

export default {
  name: 'company-form',
  props: {
    header: {
      type: String,
      required: true
    },
    companyData: {
      type: Object,
      default: function () {
        return {
          companyName: null
        }
      }
    }
  },
  data () {
    return {
      companyFormData: this.companyData
    }
  }
}
</script>
