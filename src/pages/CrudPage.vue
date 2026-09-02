<template>
  <q-page class="q-pa-md">
    <section class="clientes-container">
      <div class="row items-center justify-between q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm">
          <div class="text-h4 text-weight-bold">Clientes</div>
          <div class="text-grey-7">Administra los clientes registrados.</div>
        </div>
        <div class="col-12 col-sm-auto row q-gutter-sm">
          <q-btn
            flat
            icon="refresh"
            label="Actualizar"
            :loading="loading"
            @click="cargarClientes"
          />
          <q-btn color="primary" icon="person_add" label="Nuevo cliente" @click="abrirCrear" />
        </div>
      </div>

      <q-table
        flat
        bordered
        :rows="clientes"
        :columns="columns"
        row-key="idCliente"
        :loading="loading"
        no-data-label="No hay clientes registrados"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-createAt="props">
          <q-td :props="props">{{ formatearFecha(props.value) }}</q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              aria-label="Editar cliente"
              @click="abrirEditar(props.row)"
              ><q-tooltip>Editar</q-tooltip></q-btn
            >
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              aria-label="Eliminar cliente"
              @click="pedirEliminar(props.row)"
              ><q-tooltip>Eliminar</q-tooltip></q-btn
            >
          </q-td>
        </template>
      </q-table>
    </section>

    <q-dialog v-model="dialogoFormulario" persistent>
      <q-card class="form-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ clienteEditando ? 'Editar cliente' : 'Nuevo cliente' }}</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" aria-label="Cerrar" />
        </q-card-section>
        <q-form @submit="guardarCliente">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model.trim="formulario.nombre"
              outlined
              label="Nombre"
              maxlength="100"
              :rules="[(valor) => valor.length >= 2 || 'Ingresa al menos 2 caracteres']"
            />
            <q-input
              v-model.number="formulario.edad"
              outlined
              type="number"
              label="Edad"
              min="0"
              max="130"
              :rules="[
                (valor) =>
                  (Number.isInteger(valor) && valor >= 0 && valor <= 130) ||
                  'Ingresa una edad entre 0 y 130',
              ]"
            />
            <q-input
              v-model.trim="formulario.telefono"
              outlined
              label="Teléfono"
              maxlength="15"
              hint="De 7 a 15 caracteres"
              :rules="[(valor) => /^[0-9+() -]{7,15}$/.test(valor) || 'Ingresa un teléfono válido']"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn v-close-popup flat label="Cancelar" />
            <q-btn type="submit" color="primary" label="Guardar" :loading="guardando" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogoEliminar">
      <q-card>
        <q-card-section class="row items-center q-pb-none"
          ><q-icon name="warning" color="negative" size="28px" class="q-mr-sm" />
          <div class="text-h6">Eliminar cliente</div></q-card-section
        >
        <q-card-section
          >¿Deseas eliminar a <strong>{{ clienteAEliminar?.nombre }}</strong
          >? Esta acción no se puede deshacer.</q-card-section
        >
        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancelar" />
          <q-btn color="negative" label="Eliminar" :loading="eliminando" @click="eliminarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

const API_URL = '/api'
const $q = useQuasar()
const clientes = ref([])
const loading = ref(false)
const guardando = ref(false)
const eliminando = ref(false)
const dialogoFormulario = ref(false)
const dialogoEliminar = ref(false)
const clienteEditando = ref(null)
const clienteAEliminar = ref(null)
const formularioVacio = () => ({ nombre: '', edad: null, telefono: '' })
const formulario = ref(formularioVacio())

const columns = [
  { name: 'idCliente', label: 'ID', field: 'idCliente', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'edad', label: 'Edad', field: 'edad', align: 'center', sortable: true },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'createAt', label: 'Creado', field: 'createAt', align: 'left', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'right' },
]

onMounted(cargarClientes)

async function pedir(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      data?.errores?.join('. ') || data?.error || 'No fue posible completar la operación.',
    )
  }
  return data
}

async function cargarClientes() {
  loading.value = true
  try {
    clientes.value = await pedir('/clientes')
  } catch (error) {
    notificarError(error.message)
  } finally {
    loading.value = false
  }
}

function abrirCrear() {
  clienteEditando.value = null
  formulario.value = formularioVacio()
  dialogoFormulario.value = true
}

function abrirEditar(cliente) {
  clienteEditando.value = cliente
  formulario.value = { nombre: cliente.nombre, edad: cliente.edad, telefono: cliente.telefono }
  dialogoFormulario.value = true
}

async function guardarCliente() {
  guardando.value = true
  try {
    const esEdicion = Boolean(clienteEditando.value)
    const cliente = await pedir(
      esEdicion ? `/clientes/${clienteEditando.value.idCliente}` : '/clientes',
      {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(formulario.value),
      },
    )
    if (esEdicion) {
      const indice = clientes.value.findIndex((item) => item.idCliente === cliente.idCliente)
      if (indice !== -1) clientes.value[indice] = cliente
    } else {
      clientes.value.push(cliente)
    }
    dialogoFormulario.value = false
    $q.notify({
      message: esEdicion ? 'Cliente actualizado.' : 'Cliente creado.',
      color: 'positive',
      icon: 'check_circle',
    })
  } catch (error) {
    notificarError(error.message)
  } finally {
    guardando.value = false
  }
}

function pedirEliminar(cliente) {
  clienteAEliminar.value = cliente
  dialogoEliminar.value = true
}

async function eliminarCliente() {
  if (!clienteAEliminar.value) return
  eliminando.value = true
  try {
    await pedir(`/clientes/${clienteAEliminar.value.idCliente}`, { method: 'DELETE' })
    clientes.value = clientes.value.filter(
      (cliente) => cliente.idCliente !== clienteAEliminar.value.idCliente,
    )
    dialogoEliminar.value = false
    $q.notify({ message: 'Cliente eliminado.', color: 'positive', icon: 'check_circle' })
  } catch (error) {
    notificarError(error.message)
  } finally {
    eliminando.value = false
  }
}

function formatearFecha(fecha) {
  return fecha
    ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(fecha),
      )
    : '-'
}

function notificarError(message) {
  $q.notify({ message, color: 'negative', icon: 'error' })
}
</script>

<style scoped>
.clientes-container {
  max-width: 1200px;
  margin: 0 auto;
}
.form-card {
  width: min(100%, 480px);
}
</style>
