<template>
  <q-page class="documentation-page">
    <section class="doc-hero">
      <div class="doc-content">
        <h1>Quasar</h1>
        <p>
          Quasar es un framework basado en Vue que reúne las herramientas necesarias para crear
          interfaces modernas, rápidas y consistentes desde un único proyecto.
        </p>
      </div>
    </section>

    <section id="beneficios" class="benefits-section">
      <div class="section-heading">
        <span>¿POR QUÉ QUASAR?</span>
        <h2>Todo lo que necesitas para dar vida a tu idea.</h2>
      </div>

      <div class="benefits-grid">
        <q-card v-for="benefit in benefits" :key="benefit.title" flat class="benefit-card">
          <q-card-section>
            <div class="benefit-icon" :class="benefit.color">
              <q-icon :name="benefit.icon" size="28px" />
            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </q-card-section>
        </q-card>
      </div>
    </section>
  </q-page>
</template>

<script setup>
const benefits = [
  {
    title: 'Un solo código',
    description:
      'Crea aplicaciones web, móviles y de escritorio reutilizando la misma base de código.',
    icon: 'layers',
    color: 'benefit-icon--purple',
  },
  {
    title: 'Componentes completos',
    description: 'Aprovecha una amplia colección de componentes accesibles y con diseño cuidado.',
    icon: 'widgets',
    color: 'benefit-icon--blue',
  },
  {
    title: 'Rendimiento ágil',
    description: 'Entrega interfaces rápidas y responsivas, optimizadas para cada plataforma.',
    icon: 'bolt',
    color: 'benefit-icon--orange',
  },
]
</script>
