import { createLocalVue } from 'vue-test-utils'
import VeeValidate from 'vee-validate'
import Vuetify from 'vuetify'

const localVue = createLocalVue()

localVue.use(VeeValidate)
localVue.use(Vuetify)

export default localVue
