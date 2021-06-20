<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link to="/">
                <a class="navbar-brand">Sistemas Corporativos</a>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav" v-if="store.authenticated">
                <li class="nav-item" v-for="(item, index) in items" :key="index">
                    <router-link :to="item.link" v-if="item.type === 'item' && item.roles.includes(store.role)">
                        <a class="nav-link">{{ item.name }}</a>
                    </router-link>
                    <template v-if="item.type === 'menu' && item.roles.includes(store.role)" >
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {{ item.name }}
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li v-show="_item.roles.includes(store.role)" class="nav-item" v-for="(_item, index) in item.children" :key="index">
                                    <router-link :to="_item.link" v-if="_item.type === 'item'">
                                        <a class="nav-link">{{ _item.name }}</a>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </template>
                </li>
            </ul>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            store: this.$store.getters,
            items: [
                { name: 'Produtos', link: '/products', type: 'item', roles: ['adm', 'user'] },
                { name: 'Estoques', link: '/stocks', type: 'item', roles: ['adm', 'user'] },
                { name: 'Contas a receber', link: '/to-receive', type: 'item', roles: ['adm', 'user'] },
                { name: 'Logs', link: '', type: 'menu', roles: ['adm', 'user'], children: [
                        { name: 'Compra/ Venda', link: '/market-logs', type: 'item', roles: ['adm', 'user'] },
                        { name: 'Geral', link: '/logs', type: 'item', roles: ['adm'] },
                ] },
                { name: 'Administrativo', link: '', type: 'menu', roles: ['adm'], children: [
                        { name: 'Criar conta', link: '/create-account', type: 'item', roles: ['adm'] },
                ] },
            ]
        }
    }
})
</script>

<style>

a.nav-link,
a:link {
  text-decoration: none;
}
</style>