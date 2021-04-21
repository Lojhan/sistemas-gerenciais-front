<template>
  <div class="card login-card align-middle">
    <div class="card-body">
      <form>
        <h1>Login</h1>
        <label for="" class="mt-5">E-mail</label>
        <input ref="username" class="form-control" type="text" />

        <label for="" class="mt-3">Senha</label>
        <input ref="password" class="form-control" type="password" />
      </form>
      <div>
        <button
          :class="`btn mt-5 w-100 ${
            state.logging == 'error' ? 'btn-danger' : 'btn-dark'
          }`"
          @click="login"
        >
          <span v-if="!state.logging">Login</span>
          <span v-if="state.logging == 'error'">Erro! Tente novamente</span>
          <span
            v-if="state.logging === true"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Login",
  data() {
    return {
      state: this.$store.getters,
    };
  },
  methods: {
    login() {
      const { username, password } = this.$refs;
      this.$store.dispatch({
        type: "authenticate",
        user: username.value,
        password: password.value,
      });
    },
  },
});
</script>
<style>
.login-card {
  max-width: 600px;
  width: 400px;
  max-height: 450px;
  height: 600px;
  margin-inline: auto;
  margin-top: 12%;
  border-radius: 5px;
  padding: 1%;
  background-color: rgba(248, 248, 248, 0.823);
  backdrop-filter: saturate(180%) blur(20px);
}
</style>
