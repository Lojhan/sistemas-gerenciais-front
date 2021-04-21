<template>
    <h6>Valor médio: {{ value }}</h6>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: ['value']
})
</script>