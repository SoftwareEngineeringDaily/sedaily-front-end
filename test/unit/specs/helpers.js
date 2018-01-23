import { createLocalVue } from '@vue/test-utils'
import VeeValidate from 'vee-validate'

const localVue = createLocalVue()

localVue.use(VeeValidate)

export default localVue
