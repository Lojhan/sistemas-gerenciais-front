<template>
  <div class="container mt-5">
      <modal name="example" :key="key"
         @before-open="beforeOpen"
         @before-close="beforeClose">
        <span>Hello, {{ store }}!</span>
      </modal>
    <h1 class="display-4 mb-5">Olá, {{ store.username }}</h1>
      <Button v-if="isAdm()" label="Adicionar entrada" icon="pi pi-plus" @click="openModal" />
      <DataTable class="my-5" :value="products" :expandedRows.sync="expandedRows">
      <Column :expander="true" headerStyle="width: 3rem" />
      <Column field="product.name" header="Nome" sortable></Column>
      <Column field="stock.name" header="Estoque" sortable></Column>
      <Column field="validated" header="Status" sortable>
        <template #body="slotProps">
            <div @click="validate(slotProps.data)">
              <span v-if="slotProps.data.validated" class="badge bg-success p-2">Validado</span>
              <span v-else class="badge bg-danger p-2">Precisa de Validação</span>
            </div>
        </template>
      </Column>
      <Column field="quantity" header="Quantidade" sortable></Column>
      <template #expansion="slotProps">
        <div class="orders-subtable d-flex justify-content-between">
          <div>
            <h5>Infos adicionais de {{slotProps.data.product.name}} e {{slotProps.data.stock.name}}</h5>
            <h6>Endereço: {{ slotProps.data.stock.address }}</h6>
            <h6>Valor em estoque: R${{ slotProps.data.inStockValue }} (+ R${{(slotProps.data.inStockValue - slotProps.data.product.listPrice).toFixed(2)}} em relação ao valor original)</h6>
          </div>
          <div class="justify-content-between">
            <button @click="changeQuantity(slotProps.data)" class="btn btn-primary mt-4 mx-2">Alterar quantidade</button>
            <button v-if="isAdm()" @click="updateData(slotProps.data)" class="btn btn-secondary mt-4 mx-2">Mudar dados</button>
            <button @click="transfer(slotProps.data)" class="btn btn-danger mt-4 mx-2">Transferir</button>
          </div>
        </div>
      </template>
    </DataTable>

    <Dialog header="Criar produto" :visible.sync="displayModal" :style="{width: '50vw'}" :modal="true">
    <div class="p-3">
 
        <label for="currency-us" class="my-2 d-block">Produto:</label>
        <Dropdown v-model="product.productUuid" :options="rawProducts" optionLabel="name" optionValue="uuid" placeholder="Selecione um produto" />
        
        <label for="currency-us" class="my-2 d-block">Local:</label>
        <Dropdown v-model="product.stockUuid"  :options="rawStocks" optionLabel="name" optionValue="uuid" placeholder="Selecione um local" />

        
        <label for="currency-us" class="my-2 d-block">Quantidade:</label>
        <InputNumber v-model="product.quantity"  />

        <label for="currency-us" class="my-2 d-block">Valor:</label>
        <InputNumber v-model="product.value" mode="currency" currency="BRL" locale="pt-BR" />
 
    </div>
    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
        <Button label="Criar" icon="pi pi-check" @click="createNewEntry" autofocus />
    </template>
</Dialog>
  </div>
</template>

<script>
import requests from '@/plugins/requests'
import Vue from 'vue'
import Swal from 'sweetalert2'
import { LogType } from '@/plugins/log.type.enum'
import MoreData from "@/components/moreData.vue"

// Raulin comentou aqui

export default Vue.extend({
  name: 'Home',
  data() { 
    return {
      key: 0,
      accepted: 0,
      displayModal: false,
      store: this.$store.getters,
      products: [],
      expandedRows: [],
      stocks: [],
      rawStocks: [],
      rawProducts: [],
      keys: [''],
      values: [''],
      product: {
        productUuid: '',
        stockUuid: '',
        quantity: 0,
        value: 0
      }
    }
  },
  methods: {
    updateMoreData(value, where, index){
      this[where][index] = value
    },
    showModal () {
      this.$modal.show(  
        MoreData,
        { 
          keys: this.keys, 
          values: this.values, 
          addKey: this.addKey, 
          removeKey: this.removeKey, 
          updateData: this.updateMoreData 
        },
        { draggable: true, height: 'auto', clickToClose: false }
      )
    },
    addKey() {
      this.keys.push('')
      this.values.push('')
    },
    removeKey(index) {
      this.keys.splice(index, 1)
      
      this.values.splice(index, 1)
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
    async getProducts() {
      const { data } = await requests.products()
      this.products = data
    },
    async getStocks() {
      const { data } = await requests.stocks()
      this.rawStocks = data
    },    
    async getRawProducts() {
      const { data } = await requests.productsRaw()
      this.rawProducts = data
    },
    async validate(product) {
      if (!this.isAdm()) return;

      Swal.fire({
        title: 'Confirmar estoque',
        text: "Tem certeza?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await requests.checkQuantity(product.stock.uuid, product.product.uuid)
            Swal.fire({
              title: 'Sucesso!',
              text: 'Item verificado',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.getProducts()
            })
          } catch (e) {
            Swal.fire({
              title: 'Erro!',
              text: 'Houve um problema ao processar a requisição',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
        }
      })
    },
    beforeOpen (event) {
      console.log('Opening...')
    },
    beforeClose (event) {
      console.log(event)
      // What a gamble... 50% chance to cancel closing
      if (Math.random() < 0.5) {
        event.cancel()
      }
    },
    async transfer(data) {
      const stocks = Object.entries(this.stocks).length === 0 ? (await requests.stocks()).data : this.stocks
      this.stocks = stocks
      
      let stocksObj = {}

      stocks.forEach((stock) => {
        stocksObj[stock.uuid] = stock.name
      });

      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
      }).queue([
        {
          title: 'Quantas unidades?',
            icon: 'question',
            input: 'range',
            inputAttributes: {
              min: '0',
              max: data.quantity.toString(),
              step: '1'
            },
            inputValue: 0,
            
        },
        { title: 'Para qual Estoque?',
          input: 'select',
            inputOptions: stocksObj,
        }, {
          title: 'Qual o valor a ser usado?',
          input: 'number',
          inputLabel: 'Valor',
          inputValue: data.inStockValue,
          
          showCancelButton: true,
          inputValidator: result => {
            if (isNaN(+result)) return 'O valor precisa ser um número'
              else return null 
          }
        }
      ])

      .then(async (result) => {
        if (result.value) {
          try {
          await requests.transferStorage(
            data.product.uuid, 
            data.stock.uuid, 
            result.value[1], 
            Number(result.value[0]), 
            Number(result.value[2])
          ).then(() => {
            this.getProducts()
          })
            Swal.fire({
              title: 'Sucesso!',
              text: 'Item verificado',
              icon: 'success',
              confirmButtonText: 'Ok'
            })
          } catch (e) {
            Swal.fire({
              title: 'Erro!',
              text: 'Houve um problema ao processar a requisição',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
        }
      })
    },
    changeQuantity(data) {

      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
      }).queue([
        {
          title: 'Quantas unidades?',
            icon: 'question',
            input: 'number',
          inputLabel: 'quantidade',
          inputValue: data.quantity,
          showCancelButton: true,
          inputValidator: result => {
            if (isNaN(+result)) return 'O valor precisa ser um número'
              else return null 
          }
            
        },
        { 
          title: 'Qual o motivo de alteração?',
          input: 'select',
            inputOptions: LogType,
        }, 
        {
          title: 'Qual o valor unitário?',
          input: 'number',
          inputLabel: 'Valor',
          inputValue: data.inStockValue,
          
          showCancelButton: true,
          inputValidator: result => {
            if (isNaN(+result)) return 'O valor precisa ser um número'
              else return null 
          }
        }
      ])
      .then(async (result) => {
        const data = await new Promise((resolve, reject) => {
           console.log('teste')
              this.$modal.show(  
              MoreData,
              { 
                keys: this.keys, 
                values: this.values, 
                addKey: this.addKey, 
                removeKey: this.removeKey, 
                updateData: this.updateMoreData 
              },
              { draggable: true, height: 'auto', clickToClose: false },
              { 'before-close': event => { resolve(event) } }
            )
        })
        console.log('a')
        result.aditional = { keys: this.keys, values: this.values}
        this.keys = ['']
        this.values = ['']
        this.key = this.key + 1
        return result
      })
      .then(async (result) => {
        console.log(result.aditional.keys)
          let obj = {};
          
          result.aditional.keys.forEach((key, index) => {
            obj[key] = result.aditional.values[index]
          })
          
          console.log(obj);
        if (result.value) {
        
          try {
          await requests.changeQuantityFromStorage(
            data.stock.uuid, 
            data.product.uuid, 
            Number(result.value[0]), 
            result.value[1], 
            Number(result.value[2]),
            obj
          )
           this.getProducts()
            Swal.fire({
              title: 'Sucesso!',
              text: 'Item verificado',
              icon: 'success',
              confirmButtonText: 'Ok'
            })
          } catch (e) {
            Swal.fire({
              title: 'Erro!',
              text: 'Houve um problema ao processar a requisição',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
        }
      })

    },
    updateData(data) {

      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
      }).queue([
        {
          title: 'Quantas unidades?',
            icon: 'question',
            input: 'number',
          inputLabel: 'quantidade',
          inputValue: data.quantity,
          showCancelButton: true,
          inputValidator: result => {
            if (isNaN(+result)) return 'O valor precisa ser um número'
              else return null 
          }
            
        },
        {
          title: 'Qual o valor unitário?',
          input: 'number',
          inputLabel: 'Valor',
          inputValue: data.inStockValue,
          
          showCancelButton: true,
          inputValidator: result => {
            if (isNaN(+result)) return 'O valor precisa ser um número'
              else return null 
          }
        }
      ]).then(async (result) => {
        if (result.value) {
          try {
          await requests.updateStorageData(
            Number(result.value[0]), 
            Number(result.value[1]),
            data.stock.uuid, 
            data.product.uuid, 
          )
           this.getProducts()
            Swal.fire({
              title: 'Sucesso!',
              text: 'Item verificado',
              icon: 'success',
              confirmButtonText: 'Ok'
            })
          } catch (e) {
            Swal.fire({
              title: 'Erro!',
              text: 'Houve um problema ao processar a requisição',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
        }
      })

    },
    async createNewEntry() {
      this.closeModal()
          try {
          await requests.updateStorageData(
            this.product.quantity, 
            this.product.value,
            this.product.stockUuid, 
            this.product.productUuid,
          )
            Swal.fire({
              title: 'Sucesso!',
              text: 'Item adicionado',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.getProducts()
            })
          } catch (e) {
            Swal.fire({
              title: 'Erro!',
              text: 'Houve um problema ao processar a requisição',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
    }
  },
  mounted() {
    this.getProducts()
    this.getRawProducts()
    this.getStocks()
  }
})
</script>

<style scoped>
.badge {
  cursor: pointer;
}
</style>