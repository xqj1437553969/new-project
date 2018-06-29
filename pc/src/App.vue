<template>
  <div id="app">
    <pub-header></pub-header>
    <pub-headermenu></pub-headermenu>
    <router-view/>
    <pub-footer></pub-footer>
  </div>
</template>

<script>
import pubHeader from '@/components/publicComponents/Header'
import pubHeadermenu from '@/components/publicComponents/Headermenu'
import pubFooter from '@/components/publicComponents/Footer'
export default {
  name: 'App',
  components:{
  	pubHeader,
  	pubHeadermenu,
  	pubFooter
  }
}
</script>

<style>
@import "./style/reset.css";
#app {
  width:100%;
}
</style>
