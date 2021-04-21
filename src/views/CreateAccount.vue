<template>
  <div class="container">
    <h1 class="display-3 m-5">Criar uma nova conta</h1>
    <div class="card p-5 m-5">
      
  <div class="my-3">
    <label class="form-label">Username</label>
    <input type="text" class="form-control" ref="username">
  </div>
  <div class="mb-3">
    <label class="form-label">Password</label>
    <input type="password" class="form-control" ref="password">
  </div>

  <div class="form-check">
    <input class="form-check-input" @change="selectType" type="radio" name="flexRadioDefault" value="user" id="flexRadioDefault1" ref="type">
    <label class="form-check-label" for="flexRadioDefault1">
      Usuário
    </label>
  </div>
  <div class="form-check">
    <input class="form-check-input" @change="selectType" type="radio" name="flexRadioDefault" value="adm" id="flexRadioDefault2" ref="type" checked>
    <label class="form-check-label" for="flexRadioDefault2">
      Adm
    </label>
  </div>

  <button @click="signUp()" class="btn btn-primary w-100 mt-4">Criar</button>
  
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import requests from '@/plugins/requests'
import { AuthCredentialsDto } from '@/classes/auth-credentials.dto';
import swal from 'sweetalert';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      type: 'user',
    }
  },
  methods: {
    async signUp() { try {
      const { username, password } = this.$refs as { [key:string]: HTMLFormElement}

      await requests.signUp(new AuthCredentialsDto(username.value, password.value, this.type as 'adm' | 'user'))
      swal(`Tudo certo!` , "O usuário foi cadastrado", "success");
    } catch (error) {
      swal(`Oops!` , "Erro ao cadastrar usuário", "error");
      console.log(error)
    }},
  selectType(type: { target: { value: string; }; }) {
    this.type = type.target.value
  }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
