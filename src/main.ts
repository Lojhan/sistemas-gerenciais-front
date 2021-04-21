import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';

import Dropdown from 'primevue/dropdown';


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@popperjs/core/dist/cjs/popper.js'
import 'primevue/resources/primevue.min.css'  
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'

Vue.config.productionTip = false

Vue.component('DataTable', DataTable)
Vue.component('Column', Column)


Vue.component('Dropdown', Dropdown)


Vue.component('Calendar', Calendar)

Vue.component('InputText', InputText)
Vue.component('Button', Button)
Vue.component('Dialog', Dialog)
Vue.component('InputNumber', InputNumber)

new Vue({
  store,
  router,
  render: h => h(App),
  
}).$mount('#app')


