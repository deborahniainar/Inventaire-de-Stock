<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        {{ mode === 'edit' ? 'Modifier les mouvements' : 'Mouvements' }} — {{ designationLabel }}
      </h2>

      <div class="space-y-3 max-h-80 overflow-y-auto">
        <div
          v-for="(row, index) in rows"
          :key="index"
          class="flex items-center gap-2 py-2 border-b border-gray-100"
        >
          <label class="text-sm font-medium text-gray-600 w-24 shrink-0">Date</label>
          <input
            v-model="row.date"
            type="date"
            class="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded text-sm"
          />
          <label class="text-sm font-medium text-green-600 w-6 text-center shrink-0">E</label>
          <input
            v-model.number="row.entree"
            type="number"
            min="0"
            placeholder="0"
            class="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-right"
          />
          <label class="text-sm font-medium text-red-600 w-6 text-center shrink-0">S</label>
          <input
            v-model.number="row.sortie"
            type="number"
            min="0"
            placeholder="0"
            class="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-right"
          />
          <button
            type="button"
            @click="removeRow(index)"
            class="text-red-500 hover:text-red-700 p-1 shrink-0 order-last"
            :class="{ 'invisible': mode === 'add' && rows.length <= 1 }"
            :title="mode === 'edit' ? 'Supprimer cette date' : 'Supprimer la ligne'"
          >
            ✕
          </button>
        </div>
      </div>

      <p v-if="duplicateDateError" class="mt-2 text-sm text-red-600">
        {{ duplicateDateError }}
      </p>

      <button
        type="button"
        @click="addRow"
        class="mt-3 w-full py-2 border border-dashed border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium"
      >
        + Ajouter une date
      </button>
      <p v-if="mode === 'edit' && rows.length === 0" class="mt-2 text-sm text-amber-600">
        Aucune date. Ajoutez au moins une date ou annulez.
      </p>

      <div class="flex gap-3 mt-6">
        <button
          type="button"
          @click="submit"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
        >
          Enregistrer
        </button>
        <button
          type="button"
          @click="close"
          class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovementForm',
  props: {
    isOpen: { type: Boolean, required: true },
    designation: { type: Object, default: null },
    mode: { type: String, default: 'add' } // 'add' | 'edit'
  },
  data() {
    return {
      rows: [{ date: this.today(), entree: 0, sortie: 0 }],
      duplicateDateError: null
    }
  },
  computed: {
    designationLabel() {
      if (!this.designation) return ''
      return this.designation.designation || this.designation.code || 'Désignation'
    }
  },
  watch: {
    isOpen(open) {
      if (open) {
        if (this.mode === 'edit' && this.designation && Array.isArray(this.designation.movements) && this.designation.movements.length > 0) {
          this.rows = this.designation.movements.map(m => ({
            date: m.date || '',
            entree: Number(m.entree) || 0,
            sortie: Number(m.sortie) || 0
          }))
        } else {
          this.rows = [{ date: this.firstAvailableDateForAdd(), entree: 0, sortie: 0 }]
        }
        this.duplicateDateError = null
      }
    },
    rows: {
      handler() {
        this.duplicateDateError = this.checkDuplicateDates()
      },
      deep: true
    }
  },
  methods: {
    today() {
      const d = new Date()
      return d.toISOString().slice(0, 10)
    },
    firstAvailableDateForAdd() {
      const saved = new Set((this.designation?.movements || []).map(m => m.date).filter(Boolean))
      let d = new Date()
      for (let i = 0; i < 366; i++) {
        const s = d.toISOString().slice(0, 10)
        if (!saved.has(s)) return s
        d.setDate(d.getDate() + 1)
      }
      return d.toISOString().slice(0, 10)
    },
    usedDates() {
      const fromRows = this.rows.filter(r => r.date).map(r => r.date)
      if (this.mode !== 'add' || !this.designation || !Array.isArray(this.designation.movements)) {
        return fromRows
      }
      const fromSaved = (this.designation.movements || []).map(m => m.date).filter(Boolean)
      return [...new Set([...fromRows, ...fromSaved])]
    },
    nextAvailableDate() {
      const used = new Set(this.usedDates())
      let d = new Date()
      for (let i = 0; i < 366; i++) {
        const s = d.toISOString().slice(0, 10)
        if (!used.has(s)) return s
        d.setDate(d.getDate() + 1)
      }
      return d.toISOString().slice(0, 10)
    },
    checkDuplicateDates() {
      const dates = this.rows.filter(r => r.date).map(r => r.date)
      const seen = new Set()
      for (const date of dates) {
        if (seen.has(date)) return 'Une date ne peut pas être sélectionnée deux fois.'
        seen.add(date)
      }
      if (this.mode === 'add' && this.designation && Array.isArray(this.designation.movements)) {
        const savedDates = new Set((this.designation.movements || []).map(m => m.date).filter(Boolean))
        for (const date of dates) {
          if (savedDates.has(date)) return 'Cette date est déjà enregistrée pour cette désignation.'
        }
      }
      return null
    },
    addRow() {
      this.rows.push({ date: this.nextAvailableDate(), entree: 0, sortie: 0 })
    },
    removeRow(index) {
      this.rows.splice(index, 1)
    },
    submit() {
      this.duplicateDateError = this.checkDuplicateDates()
      if (this.duplicateDateError) return
      const movements = this.rows
        .filter(r => r.date)
        .map(r => ({
          date: r.date,
          entree: Number(r.entree) || 0,
          sortie: Number(r.sortie) || 0
        }))
      this.$emit('submit', { movements, mode: this.mode })
      this.close()
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
