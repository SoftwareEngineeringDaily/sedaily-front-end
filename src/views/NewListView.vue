<script>
import BaseListView from '@/components/BaseListView'
import HomeSection from '@/components/HomeSection'

export default {
  extends: HomeSection,

  name: 'new-list',
  data () {
    return {
      type: 'new',
      endPoint: 'fetchListData'
    }
  }
}
</script>
