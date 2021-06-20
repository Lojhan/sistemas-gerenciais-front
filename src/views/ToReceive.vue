<template>
  <div class="container mt-5">
    <h1 class="display-4 mb-5">Contas a receber</h1>
      <DataTable class="my-5" :value="toReceive" :paginator="true" :rows="10">
      <Column field="clientName" header="Cliente"></Column>
      <Column field="value" header="Valor">
        <template #body="data">
            <p>R${{ (+data.data.value).toLocaleString() }}</p>
        </template>
      </Column>
      <Column field="createdAt" header="Criado" sortable>
        <template #body="data">
            <p>{{ new Date(data.data.createdAt).toLocaleString() }}</p>
        </template>
      </Column>
      <Column field="deadline" header="Validade" sortable>
        <template #body="data">
            <p>{{ new Date(data.data.deadline).toLocaleString() }}</p>
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
      toReceive: [],
    }
  },
  methods: {
    async getLogs() {
      const { data } = await requests.toReceive()
      this.toReceive = data
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