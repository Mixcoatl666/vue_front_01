<template>
  <q-page class="notes-page">
    <div class="notes-container q-pa-md">
      <div class="text-h6 q-mb-sm">Escritor de Notas</div>
      <q-editor v-model="editor" placeholder="Comienza a escribir o ten una nueva idea..." :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveWork,
        },
        upload: {
          tip: 'Upload to cloud',
          icon: 'cloud_upload',
          label: 'Upload',
          handler: uploadIt,
        },
      }" :toolbar="[
          ['justify', 'center'],
          ['bold', 'italic', 'strike', 'underline'],
          ['quote', 'unordered', 'ordered'],
          ['undo', 'redo'],
          ['upload', 'save'],
        ]" />

      <section v-if="notes.length" class="q-mt-md">
        <div class="text-h6 q-mb-sm">Notas guardadas</div>

        <div class="notes-grid">
          <q-card v-for="note in notes" :key="note.id" bordered flat class="note-card">
            <q-card-section class="q-pb-sm">
              <div class="row items-center no-wrap">
                <div class="note-icon">
                  <q-icon name="sticky_note_2" size="24px" />
                </div>
                <div class="text-subtitle1 text-weight-medium q-ml-sm">{{ note.title }}</div>
              </div>
            </q-card-section>

            <q-separator />

            <q-scroll-area class="note-content">
              <q-card-section>
                <div v-html="note.content" />
              </q-card-section>
            </q-scroll-area>

            <q-card-actions align="right" class="q-px-md q-py-sm">
              <q-btn flat round color="negative" icon="delete" aria-label="Eliminar nota" @click="deleteNote(note.id)">
                <q-tooltip>Eliminar nota</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'notas'

const $q = useQuasar()
const editor = ref('')
const notes = ref([])

onMounted(() => {
  notes.value = readNotes()
})

function readNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(savedNotes) ? savedNotes : []
  } catch {
    return []
  }
}

function saveWork() {
  const plainText = editor.value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
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

  const note = {
    id: Date.now(),
    title: `Nota #${notes.value.length + 1}`,
    content: editor.value,
  }

  notes.value.push(note)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
  editor.value = ''

  $q.notify({
    message: 'Nota guardada con éxito.',
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
  })
}

function deleteNote(noteId) {
  notes.value = notes.value.filter((note) => note.id !== noteId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))

  $q.notify({
    message: 'Nota eliminada.',
    color: 'grey-8',
    textColor: 'white',
    icon: 'delete',
  })
}

function uploadIt() {
  $q.notify({
    message: 'No hay conexión al servidor',
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
  })
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
