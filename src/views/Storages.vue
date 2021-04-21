<template>
  <div class="container mt-5">
    <h1 class="display-4 mb-5">Estoques</h1>
    
      <Button v-if="isAdm()" label="Adicionar entrada" icon="pi pi-plus" @click="openModal" />
    <DataTable 
        class="my-5" 
        :value="products" 
        :expandedRows.sync="expandedRows" 
        :paginator="true" 
        :rows="10"
    >
      <Column field="uuid" header="UUID"></Column>
      <Column field="name" header="Nome" sortable></Column>
      <Column field="address" header="Local" sortable></Column>
    </DataTable>

      <Dialog header="Criar produto" :visible.sync="displayModal" :style="{width: '50vw'}" :modal="true">
    <div class="p-3">
 
        <label for="currency-us" class="my-2 d-block">Nome:</label>
        <InputText v-model="newStorage.name"  />

        <label for="currency-us" class="my-2 d-block">Endereço:</label>
        <InputText v-model="newStorage.address" />
 
    </div>
    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
        <Button label="Criar" icon="pi pi-check" @click="createNewEntry" autofocus />
    </template>
</Dialog>
  </div>
</template>

<script lang="ts">
import requests from '@/plugins/requests'
import Swal from 'sweetalert2'
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',
  data() { 
    return {
      displayModal: false,
      store: this.$store.getters,
      products: [],
      newStorage: {
          name: '',
          address: ''
      }
    }
  },
  methods: {
    async createNewEntry() {
        this.closeModal()
        try {
            await requests.createStorage(
                this.newStorage.name,
                this.newStorage.address
            )
                Swal.fire({
                    title: 'Sucesso!',
                text: 'Item verificado',
                icon: 'success',
                confirmButtonText: 'Ok'
                }).then(() => {
                
                    this.getLogs()
                })
            } catch (e) {
                Swal.fire({
                title: 'Erro!',
                text: 'Houve um problema ao processar a requisição',
                icon: 'error',
                confirmButtonText: 'Ok'
                })
            }
      },
    isAdm() {
      return this.store.role === 'adm'
    }, openModal() {
            this.displayModal = true;
    },
    closeModal() {
            this.displayModal = false;
    },
    async getLogs() {
      const { data } = await requests.stocks()
      this.products = data
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