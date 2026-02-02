<template>
  <!-- Popup de confirmation -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-2xl p-6 w-96">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">⚠️ Confirmation</h2>
      
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <!-- Boutons -->
      <div class="flex gap-3">
        <button
          @click="confirm"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition"
        >
          ✅ Oui, supprimer
        </button>
        <button
          @click="cancel"
          class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
        >
          ❌ Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: 'Êtes-vous sûr?'
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
