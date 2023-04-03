<template>
  <q-layout view="hHh lpR fFf" class="bg-amcef">
    <q-header elevated class=""></q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>

<style>
.bg-amcef {
  background-color: #c9c4c4;
}
.bg-image {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

</style>
