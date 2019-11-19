<script>
import HomeSection from '@/components/HomeSection'
import BaseListView from '@/components/BaseListView'

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
