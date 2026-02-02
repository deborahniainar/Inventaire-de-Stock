<template>
  <!-- Popup modale -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-2xl p-6 w-96">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Ajouter une désignation</h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input
            v-model="form.code"
            type="text"
            placeholder="ex: ART001"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Désignation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Désignation</label>
          <input
            v-model="form.designation"
            type="text"
            placeholder="ex: Produit A"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Marque -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Marque</label>
          <input
            v-model="form.marque"
            type="text"
            placeholder="ex: Brand X"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Unité -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Unité</label>
          <input
            v-model="form.unite"
            type="text"
            placeholder="ex: PCS, BOX, KG, L"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- SI (Stock Initial) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">SI (Stock Initial)</label>
          <input
            v-model.number="form.stockInitial"
            type="number"
            placeholder="ex: 0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <!-- Inventaire -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Inventaire</label>
          <input
            v-model.number="form.inventaire"
            type="number"
            placeholder="ex: 100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <!-- Boutons -->
        <div class="flex gap-3 mt-6">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {{ isSubmitting ? '⏳ Ajout...' : '✅ Ajouter' }}
          </button>
          <button
            type="button"
            @click="closeForm"
            class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
          >
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleForm',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        code: '',
        designation: '',
        marque: '',
        unite: '',
        stockInitial: 0,
        inventaire: 0
      },
      isSubmitting: false
    }
  },
  methods: {
    submitForm() {
      if (this.isSubmitting) return
      this.isSubmitting = true
      
      this.$emit('submit', { ...this.form })
      this.resetForm()
      
      setTimeout(() => {
        this.isSubmitting = false
      }, 100)
    },
    closeForm() {
      this.$emit('close')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        code: '',
        designation: '',
        marque: '',
        unite: '',
        stockInitial: 0,
        inventaire: 0
      }
    }
  }
}
</script>
