<template>
  <div class="container mt-5">
    <h1 class="display-4 mb-5">Logs</h1>
      <DataTable class="my-5" :value="filteredLogs" :expandedRows.sync="expandedRows" :paginator="true" :rows="10">
      <Column field="uuid" header="UUID"></Column>
      <Column field="log" header="Log"></Column>
      <Column field="type" header="Tipo" sortable></Column>
      <Column field="fiscal" >
         <template #body="slotProps">
            <div>
              <button @click="openFiscal(slotProps)" class="btn btn-primary">Gerar nota</button>
            </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
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
    openFiscal(slotPros) {
      console.log(slotPros.data.fiscal)
      window.open('http://localhost:3000/products/fiscal/' + slotPros.data.fiscal, "", "width=600,height=800")
    },
    isAdm() {
      return this.store.role === 'adm'
    },
    async getLogs() {
      const { data } = await requests.logs()
      this.logs = data
    },
  },
  computed: {
    filteredLogs() {
      return this.logs.filter(log => log.fiscal)
    }
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