import { User } from '@/classes/user';
import requests from '@/plugins/requests';
import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router/index"
import axios from '@/plugins/axios';
import { TOKEN } from '@/plugins/constants';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logging: false as string | boolean,
    authenticated: false,
    user: {} as User

  },
  getters: {
    username: (state) => state.user.username,
    token: (state) => state.user.token,
    role: (state) => state.user.type,
    authenticated: (state) => state.authenticated,
    logging: (state) => state.logging,
  },
  mutations: {    
    async authenticate(state, { user, password }) {
    state.logging = true;
    try {
      const { data } = await requests.signIn(user, password);
      state.user = {
        username: user,
        token: data.accessToken,
        type: data.type,
      };
      state.authenticated = true;
      state.logging = false;
      localStorage.setItem('token', state.user.token);
      localStorage.setItem('username', state.user.username);
      localStorage.setItem('type', state.user.type);
      router.push('/');
      axios.defaults.headers['Authorization'] = 'Bearer ' + TOKEN
    } catch (error) {
      state.logging = 'error';
    }
  },   
  },
  actions: {
    authenticate: (
      { commit },
      payload: { username: string; password: string }
    ) => commit("authenticate", payload),
  },
  modules: {
  }
})
