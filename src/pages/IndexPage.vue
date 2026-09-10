<template>
  <q-page class="notes-page">
    <div class="notes-container q-pa-md">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h6">{{ notaEditando ? 'Editar nota' : 'Escritor de Notas' }}</div>
        <q-btn v-if="notaEditando" flat label="Cancelar edición" icon="close" @click="cancelarEdicion" />
      </div>
      
      <q-editor v-model="editor" placeholder="Comienza a escribir o ten una nueva idea..."
        :definitions="{ save: { icon: 'save', label: 'Guardar', handler: saveWork } }" :toolbar="[
          ['justify', 'center'],
          ['bold', 'italic', 'strike', 'underline'],
          ['quote', 'unordered', 'ordered'],
          ['undo', 'redo'],
          ['save'],
        ]" />

      <section class="q-mt-md">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-h6">Notas guardadas</div>
          <q-btn flat icon="refresh" label="Actualizar" :loading="loading" @click="cargarNotas" />
        </div>

        <q-inner-loading :showing="loading" />
        <div v-if="notes.length" class="notes-grid">
          <q-card v-for="note in notes" :key="note.idnota" bordered flat class="note-card">
            <q-card-section class="q-pb-sm">
              <div class="row items-center no-wrap">
                <div class="note-icon">
                  <q-icon name="sticky_note_2" size="24px" />
                </div>
                <div class="text-subtitle1 text-weight-medium q-ml-sm">{{ note.titulo }}</div>
              </div>
            </q-card-section>

            <q-separator />

            <q-scroll-area class="note-content">
              <q-card-section>
                <div v-html="note.descripcion" />
              </q-card-section>
            </q-scroll-area>

            <q-card-actions align="right" class="q-px-md q-py-sm">
              <q-btn flat round color="primary" icon="edit" aria-label="Editar nota" @click="editarNota(note)">
                <q-tooltip>Editar nota</q-tooltip>
              </q-btn>
              <q-btn flat round color="negative" icon="delete" aria-label="Eliminar nota"
                @click="deleteNote(note.idnota)">
                <q-tooltip>Eliminar nota</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div v-else-if="!loading" class="text-grey-7 q-pa-lg text-center">
          No hay notas guardadas.
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'
import {
  actualizarNota,
  crearNota,
  eliminarNota,
  listarNotas,
} from '@/services/notas.service'

const $q = useQuasar()
const titulo = ref('')
const editor = ref('')
const notes = ref([])
const loading = ref(false)
const guardando = ref(false)
const notaEditando = ref(null)

onMounted(cargarNotas)

async function cargarNotas() {
  loading.value = true
  try {
    notes.value = await listarNotas()
  } catch (error) {
    notificarError(error.message)
  } finally {
    loading.value = false
  }
}

async function saveWork() {
  const plainText = editor.value
    .replace(/<[^<>]*>/g, '')
    .replaceAll('&nbsp;', ' ')
    .trim()

  if (!plainText) {
    $q.notify({
      message: 'Escribe una nota antes de guardarla.',
      color: 'warning',
      textColor: 'black',
      icon: 'edit_note',
    })
    return
  }

  guardando.value = true
  const estabaEditando = Boolean(notaEditando.value)
  try {
    const payload = {
      titulo: titulo.value || `Nota #${notes.value.length + 1}`,
      descripcion: editor.value,
    }
    const nota = estabaEditando
      ? await actualizarNota(notaEditando.value.idnota, payload)
      : await crearNota(payload)

    if (estabaEditando) {
      const indice = notes.value.findIndex((item) => item.idnota === nota.idnota)
      if (indice !== -1) notes.value[indice] = nota
    } else {
      notes.value.unshift(nota)
    }

    cancelarEdicion()
    $q.notify({
      message: estabaEditando ? 'Nota actualizada.' : 'Nota guardada con éxito.',
      color: 'positive',
      icon: 'cloud_done',
    })
  } catch (error) {
    notificarError(error.message)
  } finally {
    guardando.value = false
  }
}

async function deleteNote(noteId) {
  try {
    await eliminarNota(noteId)
    notes.value = notes.value.filter((note) => note.idnota !== noteId)
    $q.notify({ message: 'Nota eliminada.', color: 'positive', icon: 'delete' })
  } catch (error) {
    notificarError(error.message)
  }
}

function editarNota(note) {
  notaEditando.value = note
  titulo.value = note.titulo
  editor.value = note.descripcion
}

function cancelarEdicion() {
  notaEditando.value = null
  titulo.value = ''
  editor.value = ''
}

function notificarError(message) {
  $q.notify({ message, color: 'negative', icon: 'error' })
}
</script>

<style scoped>
.notes-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.note-card {
  min-width: 0;
  overflow: hidden;
  border-color: #e8eaf3;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgb(33 40 81 / 5%);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.note-card:hover {
  box-shadow: 0 18px 35px rgb(33 40 81 / 11%);
  transform: translateY(-4px);
}

.note-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: #694dcc;
  background: #f0ebff;
  border-radius: 12px;
}

.note-content {
  height: 220px;
}
</style>
