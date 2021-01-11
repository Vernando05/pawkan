<template>
  <transition name="component-fade" mode="out-in">
    <router-view :key="$route.path" />
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Container'
  })
</script>
