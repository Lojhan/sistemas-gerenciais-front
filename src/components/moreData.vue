<template>
    <div>
        <div
            class="card bg-light p-3 pt-4"
                        
                      >
                      <div 
                      class="d-flex mx-auto"
                      v-for="(key, index) in keys"
                        :key="index">

                        <div>

                        <label>Chave</label>
                        <input
                          type="text"
                          :value="key"
                          @change="event => updateKeyData(index, event.target.value)"
                          class="form-control mb-4"
                        />
                        </div>
                        <div class="mx-3">

                        <label>Info</label>
                        <input
                          :value="values[index]"
                          @change="event => updateValueData(index, event.target.value)"
                          class="form-control mb-4"
                        />
                        </div>
                        <button
                          class="btn btn-danger my-4"
                          @click="remove(index)"
                        >
                          Remover
                        </button>
                      </div>
                            <button
                        @click="add()"
                        class="btn btn-secondary mt-3 w-100"
                      >
                        Adicionar
                      </button>         
                      <button
                        @click="$emit('close')"
                        class="btn btn-primary mt-3 w-100"
                      >
                        Salvar
                      </button>
        </div>
                 


    </div>
</template>
<script>
import Vue from 'vue'

export default Vue.extend({
    props: ['keys', 'values', 'addKey', 'removeKey', 'updateData'],
    methods: {
        updateKeyData(index, value) { this.updateData(value, 'keys', index) },
        updateValueData(index, value) { this.updateData(value, 'values', index) },
        add() { this.addKey() },
        remove(index) { this.removeKey(index) }

    }
})
</script>