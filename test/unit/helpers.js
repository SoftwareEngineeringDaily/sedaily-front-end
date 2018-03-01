import { createLocalVue } from '@vue/test-utils'
import { setupVue } from '@/setup'

const localVue = createLocalVue()

setupVue(localVue)

export { localVue }
