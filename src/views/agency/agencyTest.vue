<template>
  <CommonAgentList :data="data" />
</template>

<script>
import CommonAgentList from './commonAgentList'
import { getAgencyList } from '@/api/agency'

export default {
  components: {
    CommonAgentList
  },
  filters: {},
  data() {
    return {
      data: '?is_test=1'
    }
  }
}
</script>
