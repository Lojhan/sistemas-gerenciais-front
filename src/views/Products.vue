<template>
  <div class="container mt-5">
    <h1 class="display-4 mb-5">Produtos</h1>
    
    <Button label="Adicionar produto" icon="pi pi-plus" @click="openModal" />
    <DataTable 
        class="my-5" 
        :value="products" 
        :paginator="true" 
        :rows="10"
        :key="key"
        :expandedRows.sync="expandedRows"
        @row-expand="(e) => getAverage(e.data.uuid)"
    >
      <Column :expander="true" headerStyle="width: 3rem" />
      <Column field="uuid" header="UUID"></Column>
      <Column field="name" header="Nome" sortable></Column>
      <Column field="validity" header="Validade" sortable>
      <template #body="data">
          <p>{{ new Date(data.data.validity).toLocaleString() }}</p>
      </template>
      </Column>
      <Column field="listPrice" header="Valor" sortable>
        <template #body="data">
          <p>R${{ data.data.listPrice }}</p>
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="orders-subtable d-flex justify-content-between">
          <div>
            <h5 class="b-3">Infos adicionais de {{slotProps.data.name}}</h5>
            <h6>SKU: {{ slotProps.data.sku }}</h6>
            <h6>Unidade: {{ slotProps.data.unity }}</h6>
            <average-value :value="isNaN(average[slotProps.data.uuid]) ? 0 : average[slotProps.data.uuid]" />
          </div>
          <div class="justify-content-between">
          </div>
           
         
        </div>
      </template>
    </DataTable>

<Dialog header="Criar produto" :visible.sync="displayModal" :style="{width: '50vw'}" :modal="true">
    <div class="p-3">
 
        <label for="currency-us" class="my-2 d-block">SKU:</label>
        <InputText id="username1" v-model="product.sku" aria-describedby="username1-help" /> 
        
        
        <label for="currency-us" class="my-2 d-block">Nome:</label>
        <InputText id="username1" v-model="product.name" aria-describedby="username1-help" />

        <label for="currency-us" class="my-2 d-block">Validade:</label>
        <Calendar v-model="product.validity" />
        
        <label for="currency-us" class="my-2 d-block">Unidade:</label>
        <InputNumber v-model="product.unity" />

        <label for="currency-us" class="my-2 d-block">Valor:</label>
        <InputNumber v-model="product.list_price" mode="currency" currency="BRL" locale="pt-BR" />
 
    </div>
    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
        <Button label="Criar" icon="pi pi-check" @click="addProduct" autofocus />
    </template>
</Dialog>
  </div>
</template>

<script>
import AverageValue from '@/components/averageValue.vue'
import requests from '@/plugins/requests'
import Vue from 'vue'

export default Vue.extend({ 
  components: {
    AverageValue
  },
  name: 'Home',
  data() { 
    return {
      key: 0,
      store: this.$store.getters,
      displayModal: false,
      products: [],
      expandedRows: [],
      average: {
          'a': 'b'
      },
      product: {
          sku: '',
          name: '',
          validity: '', 
          unity: 0, 
          list_price: 0
      }
    }
  },
  methods: {   
    async getAverage(uuid) {
        this.average[uuid] = (await requests.getAverage(uuid)).data
        this.key++
    }, 
    openModal() {
            this.displayModal = true;
    },
    closeModal() {
            this.displayModal = false;
    },
    isAdm() {
      return this.store.role === 'adm'
    },
    async getLogs() {
      const { data } = await requests.productsRaw()
      this.products = data
    },
    async addProduct() {
        try {
            await requests.createProduct(this.product)
            this.closeModal()
            this.getLogs()
        } catch (e) {
            console.log(e)
        }
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