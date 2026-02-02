<template>
  <header class="flex items-center justify-between bg-white shadow-md p-4">
    <!-- Logo à gauche -->
    <div class="flex items-center">
      <img src="./Logo.png" alt="Logo" class="h-20 w-30">
    </div>
    
    <!-- Titre au centre -->
    <div class="flex-1 text-center">
      <h1 class="text-3xl font-bold text-gray-800">Inventaire de Stock</h1>
    </div>
    
    <!-- Espace vide à droite (pour équilibre) -->
    <div class="w-12"></div>
  </header>
  <!-- Tableau -->
  <main class="p-8 max-w-6xl mx-auto">
    <!-- Dropdown Article -->
    <div class="mb-4 relative inline-block">
      <button 
        @click="toggleDropdown" 
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition flex items-center gap-2"
      >
        Article
        <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': dropdownOpen }" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
      
      <!-- Dropdown Menu -->
      <div 
        v-if="dropdownOpen" 
        class="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10 border border-gray-200 max-h-96 overflow-y-auto"
      >
        <button
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
          class="w-full text-left px-4 py-3 hover:bg-blue-50 transition text-sm text-gray-700 hover:text-blue-600 border-b border-gray-100 last:border-b-0"
          :class="{ 'bg-blue-50 text-blue-600 font-semibold': selectedCategory === category }"
        >
          {{ category }}
        </button>
        <button
          v-if="selectedCategory"
          @click="clearCategory"
          class="w-full text-left px-4 py-3 hover:bg-red-50 transition text-sm text-red-600 font-semibold"
        >
          ✕ Effacer le filtre
        </button>
      </div>
    </div>

    <!-- Affichage de la catégorie sélectionnée -->
    <div v-if="selectedCategory" class="mb-4 text-center">
      <h2 class="text-xl font-semibold text-gray-800">
        Article: <span class="text-blue-600">{{ selectedCategory }}</span>
      </h2>
    </div>

    <div
      class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out"
      :class="[tableCollapsed ? '' : 'w-full max-w-full']"
    >
      <!-- Vue repliée : composant dédié, modifications isolées de la vue complète -->
      <CollapsedTableView
        v-if="tableCollapsed"
        :designations="designations"
        @expand="tableCollapsed = false"
        @edit="editArticle"
        @delete="deleteArticle"
        @movement="handleMovement"
      />

      <!-- Vue complète : tableau entier (inchangé) -->
      <table v-else class="w-full">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Désignation</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Marque</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unité</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">SI</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Inventaire</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Entrées</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sorties</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">E/S</th>
          </tr>
        </thead>
        <tbody v-if="selectedCategory && designations.length > 0">
          <tr v-for="designation in designations" :key="designation.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">{{ designation.code }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ designation.designation }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ designation.marque }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ designation.unite }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ designation.stockInitial ?? designation.inventaire }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ designation.inventaire }}</td>
            <td class="px-6 py-4 text-sm text-green-600 font-semibold">{{ designation.entrees }}</td>
            <td class="px-6 py-4 text-sm text-red-600 font-semibold">{{ designation.sorties }}</td>
            <td class="px-6 py-4 text-sm text-green-600 font-semibold">{{ designation.stock }}</td>
            <td class="px-6 py-4 text-sm">
              <button @click="editArticle(designation.id)" class="text-yellow-500 hover:text-yellow-700 hover:scale-125 transition mr-3 text-lg" title="Éditer">✏️</button>
              <button @click="deleteArticle(designation.id)" class="text-red-500 hover:text-red-700 hover:scale-125 transition text-lg" title="Supprimer">🗑️</button>
            </td>
            <td class="px-6 py-4 text-sm text-center">
              <button
                @click="toggleTableCollapsed"
                class="text-blue-500 hover:text-blue-700 hover:scale-125 transition-transform text-xl"
                title="Réduire / E/S"
              >
                ➜
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="selectedCategory && designations.length === 0">
          <tr>
            <td colspan="11" class="px-6 py-8 text-center text-gray-500">
              Aucune désignation pour cet article. Cliquez sur "Ajouter une designation" pour en ajouter une.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Boutons au centre -->
    <div class="flex justify-center items-center gap-4 mt-8">
      <button 
        @click="openForm" 
        :disabled="!selectedCategory"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
      >
        ➕ Ajouter une designation
      </button>
      <button 
        @click="exportToXLS" 
        :disabled="!selectedCategory"
        class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
      >
        📊 Exporter en XLS
      </button>
    </div>
  </main>

  <!-- Composant Formulaire -->
  <ArticleForm :isOpen="showForm" @submit="addDesignation" @close="closeForm" />

  <!-- Composant Édition -->
  <EditArticleForm :isOpen="showEditForm" :article="editingArticle" @submit="updateArticle" @close="closeEditForm" />

  <!-- Composant Confirmation suppression -->
  <ConfirmDialog :isOpen="showConfirmDelete" message="Êtes-vous sûr de vouloir supprimer cette désignation?" @confirm="confirmDelete" @cancel="cancelDelete" />

  <!-- Formulaire mouvements (vue repliée : + = ajout, ✏️ = édition des dates) -->
  <MovementForm
    :isOpen="showMovementForm"
    :designation="editMovementDesignation || movementDesignation"
    :mode="editMovementDesignation ? 'edit' : 'add'"
    @submit="submitMovements"
    @close="closeMovementForm"
  />
</template>

<script>
import ArticleForm from './components/ArticleForm.vue'
import EditArticleForm from './components/EditArticleForm.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import CollapsedTableView from './components/CollapsedTableView.vue'
import MovementForm from './components/MovementForm.vue'
import ExcelJS from 'exceljs'

const API_BASE_URL = '/api'

export default {
  name: 'App',
  components: {
    ArticleForm,
    EditArticleForm,
    ConfirmDialog,
    CollapsedTableView,
    MovementForm
  },
  data() {
    return {
      showForm: false,
      showEditForm: false,
      showConfirmDelete: false,
      showMovementForm: false,
      movementDesignation: null,
      editMovementDesignation: null,
      designations: [],
      isAdding: false,
      editingArticle: null,
      deletingArticleId: null,
      dropdownOpen: false,
      selectedCategory: null,
      tableCollapsed: false,
      categories: [
        'APPAREIL SANITAIRE',
        'PORTE ET ACCESSOIRE',
        'ELECTRICITE',
        'CLIMATISEUR',
        'PLOMBERIE',
        'MATERIAUX DE CONSTRUCTION',
        'ACHAT LOCAL',
        'HABILLAGE',
        'ELECTRO-MENAGER',
        'MEUBLE ET ACCESSOIRE',
        'DECORATION',
        'PIECES DE RECHANGE'
      ]
    }
  },
  methods: {
    async loadDesignations() {
      if (!this.selectedCategory) {
        this.designations = []
        return
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${encodeURIComponent(this.selectedCategory)}/designations`)
        if (response.ok) {
          this.designations = await response.json()
        } else {
          console.error('Erreur lors du chargement des désignations')
          this.designations = []
        }
      } catch (error) {
        console.error('Erreur lors du chargement des désignations:', error)
        this.designations = []
      }
    },
    openForm() {
      if (!this.selectedCategory) return
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
    },
    async addDesignation(formData) {
      if (this.isAdding || !this.selectedCategory) return
      this.isAdding = true

      try {
        const inventaire = Number(formData.inventaire)
        const response = await fetch(`${API_BASE_URL}/articles/${encodeURIComponent(this.selectedCategory)}/designations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: formData.code || '',
            designation: formData.designation || '',
            marque: formData.marque || '',
            unite: formData.unite || '',
            stockInitial: isNaN(Number(formData.stockInitial)) ? 0 : Number(formData.stockInitial),
            inventaire: isNaN(inventaire) ? 0 : inventaire,
            entrees: 0,
            sorties: 0,
            stock: isNaN(Number(formData.stockInitial)) ? 0 : Number(formData.stockInitial)
          })
        })
        
        if (response.ok) {
          await this.loadDesignations()
          this.closeForm()
        } else {
          const errText = await response.text()
          console.error('Erreur lors de l\'ajout de la désignation', response.status, errText)
          alert('Erreur lors de l\'ajout. Vérifiez que le serveur backend est démarré (port 3000).')
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la désignation:', error)
        alert('Impossible de joindre le serveur. Démarrez le backend avec: cd backend && npm start')
      }
      
      setTimeout(() => {
        this.isAdding = false
      }, 100)
    },
    editArticle(id) {
      const designation = this.designations.find(d => d.id === id)
      if (!designation) return
      if (this.tableCollapsed) {
        this.editMovementDesignation = designation
        this.movementDesignation = null
        this.showMovementForm = true
      } else {
        this.editingArticle = designation
        this.showEditForm = true
      }
    },
    closeEditForm() {
      this.showEditForm = false
      this.editingArticle = null
    },
    async updateArticle(updatedData) {
      if (!this.selectedCategory) return
      
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${encodeURIComponent(this.selectedCategory)}/designations/${this.editingArticle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...updatedData,
            stock: updatedData.inventaire
          })
        })
        
        if (response.ok) {
          await this.loadDesignations()
          this.closeEditForm()
        } else {
          console.error('Erreur lors de la mise à jour de la désignation')
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la désignation:', error)
      }
    },
    deleteArticle(id) {
      this.deletingArticleId = id
      this.showConfirmDelete = true
    },
    async confirmDelete() {
      if (!this.selectedCategory) return
      
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${encodeURIComponent(this.selectedCategory)}/designations/${this.deletingArticleId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await this.loadDesignations()
        } else {
          console.error('Erreur lors de la suppression de la désignation')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la désignation:', error)
      }
      
      this.showConfirmDelete = false
      this.deletingArticleId = null
    },
    cancelDelete() {
      this.showConfirmDelete = false
      this.deletingArticleId = null
    },
    toggleTableCollapsed() {
      this.tableCollapsed = true
    },
    handleMovement(id) {
      const designation = this.designations.find(d => d.id === id)
      if (designation) {
        this.movementDesignation = designation
        this.showMovementForm = true
      }
    },
    closeMovementForm() {
      this.showMovementForm = false
      this.movementDesignation = null
      this.editMovementDesignation = null
    },
    async submitMovements(payload) {
      const { movements, mode } = payload || {}
      const designation = mode === 'edit' ? this.editMovementDesignation : this.movementDesignation
      if (!this.selectedCategory || !designation) {
        this.closeMovementForm()
        return
      }
      if (mode !== 'edit' && (!movements || !movements.length)) {
        this.closeMovementForm()
        return
      }
      const isEdit = mode === 'edit'
      try {
        const url = `${API_BASE_URL}/articles/${encodeURIComponent(this.selectedCategory)}/designations/${designation.id}/movements`
        const response = await fetch(url, {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movements: movements || [] })
        })
        if (response.ok) {
          await this.loadDesignations()
        } else {
          const err = await response.text()
          console.error('Erreur enregistrement mouvements', err)
          alert('Erreur lors de l\'enregistrement des mouvements.')
        }
      } catch (e) {
        console.error('Erreur mouvements', e)
        alert('Impossible de joindre le serveur.')
      }
      this.closeMovementForm()
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    async selectCategory(category) {
      this.selectedCategory = category
      this.dropdownOpen = false
      await this.loadDesignations()
    },
    clearCategory() {
      this.selectedCategory = null
      this.designations = []
      this.dropdownOpen = false
      this.tableCollapsed = false
    },
    async exportToXLS() {
      if (!this.selectedCategory || this.designations.length === 0) return
      
      // Créer un nouveau classeur
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Inventaire')
      
      // Charger le logo
      let logoId
      try {
        const response = await fetch(new URL('./Logo.png', import.meta.url))
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        logoId = workbook.addImage({
          buffer: arrayBuffer,
          extension: 'png',
        })
      } catch (error) {
        console.error('Erreur lors du chargement du logo:', error)
      }
      
      // Ajouter le logo (lignes 1-3, colonnes A-B)
      if (logoId !== undefined) {
        worksheet.addImage(logoId, {
          tl: { col: 0, row: 0 },
          ext: { width: 150, height: 80 }
        })
      }
      
      // Ligne 1 : Titre (à partir de la colonne D)
      worksheet.mergeCells('D1:K1')
      const titleCell = worksheet.getCell('D1')
      titleCell.value = 'INVENTAIRE DE STOCK'
      titleCell.font = { bold: true, size: 14 }
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF4B183' }
      }
      worksheet.getRow(1).height = 25
      
      // Ligne 3 : Article
      worksheet.mergeCells('A3:K3')
      const articleCell = worksheet.getCell('A3')
      articleCell.value = `ARTICLE:  ${this.selectedCategory}`
      articleCell.font = { bold: true, italic: true, size: 11 }
      articleCell.alignment = { horizontal: 'center', vertical: 'middle' }
      
      // Ligne 5 : En-têtes
      const headers = ['CODE ARTICLE', 'DESIGNATION', 'REFERENCE', 'MARQUE', 'UNITE', 'SI', 'INVENTAIRE', 'ENTRE', 'SORTIT', 'STOCK FINAL']
      const headerColors = ['FF4472C4', 'FF4472C4', 'FF4472C4', 'FF4472C4', 'FF4472C4', 'FF70AD47', 'FF4472C4', 'FF4472C4', 'FF4472C4', 'FFF4B183']
      const headerRow = worksheet.getRow(5)
      
      headers.forEach((header, idx) => {
        const cell = headerRow.getCell(idx + 1)
        cell.value = header
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: headerColors[idx] }
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
      headerRow.height = 20
      
      // Données
      this.designations.forEach((designation, idx) => {
        const rowNum = 6 + idx
        const row = worksheet.getRow(rowNum)
        
        const rowData = [
          designation.code || '',
          designation.designation || '',
          '', // REFERENCE
          designation.marque || '',
          designation.unite || '',
          designation.stockInitial ?? designation.inventaire,
          designation.inventaire,
          designation.entrees,
          designation.sorties,
          designation.stock
        ]
        
        rowData.forEach((value, colIdx) => {
          const cell = row.getCell(colIdx + 1)
          cell.value = value
          cell.alignment = { horizontal: 'left', vertical: 'middle' }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
          }
          
          // Couleur de fond vert clair pour la colonne SI (F)
          if (colIdx === 5) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE2EFDA' }
            }
          }
          // Couleur de fond orange clair pour la colonne STOCK FINAL (J)
          if (colIdx === 9) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFCE4D6' }
            }
          }
        })
      })
      
      // Largeurs de colonnes
      worksheet.columns = [
        { width: 12 },  // CODE ARTICLE
        { width: 30 },  // DESIGNATION
        { width: 12 },  // REFERENCE
        { width: 15 },  // MARQUE
        { width: 10 },  // UNITE
        { width: 8 },   // SI
        { width: 12 },  // INVENTAIRE
        { width: 10 },  // ENTRE
        { width: 10 },  // SORTIT
        { width: 12 }   // STOCK FINAL
      ]
      
      // Télécharger le fichier
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `inventaire_${this.selectedCategory}_${new Date().toISOString().split('T')[0]}.xlsx`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

