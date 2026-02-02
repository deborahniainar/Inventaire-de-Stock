<template>
  <!-- Vue repliée : E/S + colonnes dynamiques par date + Entrés, Sortis, Action. État vide quand aucune donnée. -->
  <div class="flex max-w-max mr-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
    <table class="w-auto border border-gray-200 border-r-0 rounded-l-lg overflow-hidden border-collapse">
      <thead class="bg-gray-100 border-b border-gray-200">
        <tr>
          <th
            @click="$emit('expand')"
            class="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-gray-200 transition"
            title="Afficher tout le tableau"
          >
            E/S
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- État vide : aucune désignation -->
        <tr v-if="designations.length === 0" class="border-b border-gray-100">
          <td class="px-6 py-6 text-sm text-center align-middle">
            <button
              @click="$emit('expand')"
              class="text-blue-500 hover:text-blue-700 hover:scale-125 transition-transform text-xl"
              title="Revenir au tableau complet"
            >
              ←
            </button>
          </td>
        </tr>
        <tr
          v-else
          v-for="designation in designations"
          :key="designation.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-6 py-2 text-sm text-center align-middle">
            <button
              @click="$emit('expand')"
              class="text-blue-500 hover:text-blue-700 hover:scale-125 transition-transform text-xl"
              title="Revenir au tableau complet"
            >
              ←
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="w-auto border border-gray-200 rounded-r-lg overflow-hidden border-collapse">
      <thead class="bg-gray-100 border-b border-gray-200">
        <tr>
          <th
            v-for="date in allDates"
            :key="date"
            colspan="2"
            class="px-3 py-2 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
          >
            {{ formatDate(date) }}
          </th>
          <th rowspan="2" class="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-200 align-middle">
            Entrés
          </th>
          <th rowspan="2" class="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-200 align-middle">
            Sortis
          </th>
          <th rowspan="2" class="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-200 align-middle">
            Action
          </th>
        </tr>
        <tr v-if="allDates.length > 0">
          <template v-for="date in allDates" :key="date">
            <th class="px-2 py-1.5 text-center text-xs font-semibold text-green-600 border-r border-gray-200">E</th>
            <th class="px-2 py-1.5 text-center text-xs font-semibold text-red-600 border-r border-gray-200">S</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <!-- État vide : message au lieu des lignes 0, 0, +, ✏️ -->
        <tr v-if="designations.length === 0" class="border-b border-gray-100">
          <td
            :colspan="allDates.length * 2 + 3"
            class="px-6 py-8 text-center text-gray-500 text-sm"
          >
            Aucune désignation pour cet article.<br />
            <span class="text-gray-400">Cliquez sur ← pour afficher le tableau complet, ou ajoutez une désignation ci-dessous.</span>
          </td>
        </tr>
        <tr
          v-else
          v-for="designation in designations"
          :key="designation.id"
          class="border-b hover:bg-gray-50"
        >
          <template v-for="date in allDates" :key="date">
            <td class="px-2 py-2 text-sm text-center text-green-600 font-medium border-r border-gray-100">
              {{ movementByDate(designation, date).entree }}
            </td>
            <td class="px-2 py-2 text-sm text-center text-red-600 font-medium border-r border-gray-100">
              {{ movementByDate(designation, date).sortie }}
            </td>
          </template>
          <td class="px-4 py-2 text-sm text-center text-green-600 font-semibold border-l border-gray-200">
            {{ designation.entrees }}
          </td>
          <td class="px-4 py-2 text-sm text-center text-red-600 font-semibold border-l border-gray-200">
            {{ designation.sorties }}
          </td>
          <td class="px-4 py-2 text-sm text-center border-l border-gray-200">
            <button
              @click="$emit('movement', designation.id)"
              class="text-green-500 hover:text-green-700 hover:scale-125 transition mr-2 text-2xl font-extrabold"
              title="Ajouter"
            >
              +
            </button>
            <button
              @click="$emit('edit', designation.id)"
              class="text-yellow-500 hover:text-yellow-700 hover:scale-125 transition text-lg"
              title="Éditer"
            >
              ✏️
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CollapsedTableView',
  props: {
    designations: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allDates() {
      const set = new Set()
      this.designations.forEach(d => {
        (d.movements || []).forEach(m => {
          if (m.date) set.add(m.date)
        })
      })
      return [...set].sort()
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '—'
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    movementByDate(designation, date) {
      const m = (designation.movements || []).find(x => x.date === date)
      return m ? { entree: m.entree, sortie: m.sortie } : { entree: 0, sortie: 0 }
    }
  }
}
</script>
