<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Notas </q-toolbar-title>

        <div>nnat</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menú </q-item-label>

        <q-item
          v-for="item in navigationItems"
          :key="item.label"
          v-ripple
          clickable
          :to="item.to"
          exact
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label caption>{{ item.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const navigationItems = [
  {
    label: 'Inicio',
    caption: 'Bienvenido',
    icon: 'home',
    to: '/',
  },
  {
    label: 'Documentación',
    caption: 'Quasar Framework',
    icon: 'book',
    to: '/documentacion',
  },
  {
    label: 'CRUD',
    caption: 'CRUD Clientes',
    icon: 'person',
    to: '/clientes',
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
