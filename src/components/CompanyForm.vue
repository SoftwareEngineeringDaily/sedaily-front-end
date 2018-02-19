<template>
  <div>

    <h4 class="row" >{{ header }}</h4>
    <form>
      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Company Name</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="Company Name"
          id="companyNameInput"
          name="companyName"
          v-model="companyFormData.companyName"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="Description"
          id="descriptionInput"
          name="description"
          v-model="companyFormData.description"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Image Url:</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="https://someurl.com/image.jpg"
          id="imageUrlInput"
          name="imageUrl"
          v-model="companyFormData.imageUrl"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">External Url:</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="https://company.com"
          id="externalUrlInput"
          name="externalUrl"
          v-model="companyFormData.externalUrl"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for="companyNameInput" class="col-sm-2 col-form-label">Local Url:</label>
        <div class="col-sm-10">
          <input
          class="form-control"
          type="text"
          placeholder="some-company"
          id="localUrlInput"
          name="localUrl"
          v-model="companyFormData.localUrl"
          >
        </div>
      </div>

    </form>
    <button
    class=""
    v-on:click="submit">
    Submit
  </button>
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
  },

  methods: {
    submit () {
      console.log('Submitting')
      console.log(this.companyFormData)
    }
  }
}
</script>
