<script setup>
    import Header from './components/Header.vue'
    import Footer from './components/Footer.vue'
    import { RouterView } from 'vue-router'
</script>

<template>
    <main>
        <Header></Header>
        <RouterView style="padding:0 2%;"/>
        <Footer></Footer>
    </main>
</template>

<script>

export default {
    setup() {
        
    },
}
</script>

<style scoped>
</style>

