<template>
  <div class="container mt-5">
    <h1 class="display-4 mb-5">Logs</h1>
      <DataTable class="my-5" :value="logs" :expandedRows.sync="expandedRows" :paginator="true" :rows="10">
      <Column field="uuid" header="UUID"></Column>
      <Column field="log" header="Log"></Column>
      <Column field="type" header="Tipo" sortable></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import requests from '@/plugins/requests'
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',
  data() { 
    return {
      store: this.$store.getters,
      logs: [],
    }
  },
  methods: {
    isAdm() {
      return this.store.role === 'adm'
    },
    async getLogs() {
      const { data } = await requests.logs()
      this.logs = data
    },
  },
  mounted() {
    this.getLogs()
  }
})
</script>

<style scoped>
.badge {
  cursor: pointer;
}
</style>