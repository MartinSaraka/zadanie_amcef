<template>
  <q-card class="q-pa-sm q-ma-lg" dark>
    <q-card-actions>
      <q-btn-toggle
        toggle-color="brown"
        v-model="switchList"
        @input="handleChange"
        :options="[
          { label: 'All ', value: 'all-items' },
          { label: 'Active', value: 'active-items' },
          { label: 'Completed', value: 'completed-items' },
        ]"
      ></q-btn-toggle>
      <q-space />

      <q-btn
        icon="mdi-account-multiple-plus-outline"
        label="New Todo item"
        @click="onRowClick(undefined, 0)"
        color="primary"
      />
    </q-card-actions>

    <q-table
      :columns="columns"
      :rows="todoList"
      row-key="id"
      :loading="!isLoaded"
      loading-text="Loading... Please wait"
      selection="multiple"
      v-model:selected="selectedRows"
      :filter="filter"
      :filter-method="filterData"
      :visible-columns="visibleColumns"
      dark
      :pagination="initialPagination"
    >

      <template v-slot:top>
        <div class="text-h4 text-white">todoList</div>
        <q-space />
        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dark
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          color="secondary"
          option-value="name"
          options-cover
          style="min-width: 150px"
          class="text-white"
        />
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props" class="my-td">
          {{
            props.row.description.length <= 20
              ? props.row.description
              : props.row.description.substring(0, 30) + '...'
          }}
          <q-tooltip v-if="props.row.description.length > 20">{{
            props.row.description
          }}</q-tooltip>
        </q-td>
      </template>
      <template v-slot:top-row>
        <q-tr>
          <q-td> </q-td>

          <q-td v-if="visibleColumns.includes('name')">
            <q-input
              outlined
              v-model="filter.name"
              label="Filter Title"
              label-color="secondary"
              dense
              dark
            />
          </q-td>
          <q-td v-if="visibleColumns.includes('description')">
            <q-input
              outlined
              v-model="filter.description"
              label="Filter Description"
              label-color="secondary"
              dense
              dark
            />
          </q-td>

          <q-td v-if="visibleColumns.includes('completed')">
            <q-input
              outlined
              v-model="filter.completed"
              label="Filter Completed"
              label-color="secondary"
              dense
              dark
            />
          </q-td>
          <q-td v-if="visibleColumns.includes('deadline')">
            <q-input
              outlined
              v-model="filter.deadline"
              label="Filter Deadline"
              label-color="secondary"
              dense
              dark
            />
          </q-td>
          <q-td />
        </q-tr>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-icon
            small
            class="mr-0"
            @click.stop="completeItem(props.row)"
            name="mdi-check-circle-outline"
          >
            <q-tooltip>Complete todo task</q-tooltip>
          </q-icon>
          <q-icon
            small
            class="mr-0"
            @click.stop="activeItem(props.row)"
            name="mdi-calendar
"
          >
            <q-tooltip>Active todo task</q-tooltip>
          </q-icon>
          <q-icon
            small
            class="mr-0"
            @click.stop="deleteItem(props.row)"
            name="delete"
          >
            <q-tooltip>Delete Todo item</q-tooltip>
          </q-icon>
        </q-td>
      </template>
      <template v-slot:pagination="scope">
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="secondary"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.firstPage"
        ></q-btn>

        <q-btn
          icon="chevron_left"
          color="secondary"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        ></q-btn>

        <q-btn
          icon="chevron_right"
          color="secondary"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        ></q-btn>

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          color="secondary"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.lastPage"
        ></q-btn>
      </template>
    </q-table>
    <q-dialog v-model="dialogDelete" max-width="600px">
      <q-card>
        <q-card-section class="headline">
          Are you sure you want to delete this Todo Item?
        </q-card-section>
        <q-card-actions>
          <br />
          <q-btn color="blue darken-1" text @click="dialogDelete = false">
            Cancel
          </q-btn>
          <q-btn color="blue darken-1" text @click="deleteItemDialog(editedItem)">
            OK
          </q-btn>
          <br />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogComplete" max-width="600px">
      <q-card>
        <q-card-section class="headline">
          Are you sure you want to set this todo item to completed?
        </q-card-section>
        <q-card-actions>
          <br />
          <q-btn color="blue darken-1" text @click="dialogComplete = false">
            Cancel
          </q-btn>
          <q-btn color="blue darken-1" text @click="completeItemDialog(editedItem)">
            OK
          </q-btn>
          <br />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogActive" max-width="600px">
      <q-card>
        <q-card-section class="headline">
          Are you sure you want to set this Todo item to active ?
        </q-card-section>
        <q-card-actions>
          <br />
          <q-btn color="blue darken-1" text @click="dialogActive = false">
            Cancel
          </q-btn>
          <q-btn color="blue darken-1" text @click="activeItemDialog(editedItem)">
            OK
          </q-btn>
          <br />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
  <q-dialog v-model="creationDialog">
    <ItemCreation
    @closeCreationDialog="onCloseCreationDialog"
    @itemCreated="addItem"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import ItemCreation from './ItemCreation.vue'
import { TodoListFilter } from './models'
import { onMounted, ref, watch } from 'vue'
import { useFormatDate } from 'src/composables/commonUtils'
import { TodoList, TodoListREST } from 'src/models/TodoList'
import {
  useGetItems,
  useUpdateCompleteItemById,
  useUpdateActiveItemById,
  useDeleteItem
} from 'src/composables/TodoListServices'

const IAAS_TODO_LIST_TOGGLE_OPTION = 'iaas-todo-list-toggle-option'
const isLoaded = ref(false)
const initialPagination = ref({
  sortBy: 'id',
  descending: true
})
const filter = ref({
  name: '',
  description: '',
  completed: '',
  deadline: ''
} as TodoListFilter)
const todoList = ref([] as TodoList[])
const allTodoList = ref([] as TodoList[])
const completedTodoList = ref([] as TodoList[])
const activeTodoList = ref([] as TodoList[])
const columns = ref([

  {
    name: 'name',
    label: 'Title',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: 'description',
    sortable: true,
    format: (val: string) =>
      val.length <= 10 ? `${val}` : `${val.substring(0, 10) + '...'}`,
    style: 'width: 100px',
    headerStyle: 'width: 100px'
  },
  {
    name: 'completed',
    label: 'Completed',
    align: 'left',
    field: 'completed',
    sortable: true
  },
  {
    name: 'deadline',
    label: 'Deadline',
    align: 'left',
    field: 'deadline',
    sortable: true,
    format: (val: Date) => useFormatDate(val)
  },
  { name: 'action', label: 'Action', field: 'action' }
])
const visibleColumns = ref([
  'name',
  'description',
  'completed',
  'deadline',
  'action'
])
const editedItem = ref({} as TodoList)
const dialogDelete = ref(false)
const dialogComplete = ref(false)
const dialogActive = ref(false)
const creationDialog = ref(false)
const todoItemId = ref(0 as number | null)
const selectedRows = ref([] as TodoList[])
const switchList = ref('all-items')

watch(switchList, () => {
  handleChange()
})

function onCloseCreationDialog () {
  creationDialog.value = false
  getTodoList()
}
function addItem () {
  getTodoList()
}

function onRowClick (evt: Event, row: TodoList) {
  if (row) {
    todoItemId.value = row.id
  } else {
    todoItemId.value = null
  }
  creationDialog.value = true
}

function deleteItemDialog (item: TodoList) {
  editedItem.value = item
  const act = editedItem.value

  useDeleteItem(act).then(() => {
    todoList.value = todoList.value.filter(function (value) {
      return value !== item
    })
  })
  dialogDelete.value = false
}
function completeItemDialog (item: TodoList) {
  editedItem.value = item
  const usr = editedItem.value

  useUpdateCompleteItemById(usr).then(() => getTodoList())
  dialogComplete.value = false
}
function activeItemDialog (item: TodoList) {
  editedItem.value = item
  const usr = editedItem.value

  useUpdateActiveItemById(usr).then(() => getTodoList())
  dialogActive.value = false
}

function handleChange () {
  saveTodoToggleOption(switchList.value)
  getTodoList()
}

function saveTodoToggleOption (value: string) {
  localStorage.setItem(IAAS_TODO_LIST_TOGGLE_OPTION, value)
}

function loadTodoToggleOption () {
  const option = localStorage.getItem(IAAS_TODO_LIST_TOGGLE_OPTION)
  if (option && option !== 'undefined') switchList.value = option
  else switchList.value = 'all-items'
}

function deleteItem (item: TodoList) {
  editedItem.value = item
  dialogDelete.value = true
}
function completeItem (item: TodoList) {
  editedItem.value = item
  dialogComplete.value = true
}
function activeItem (item: TodoList) {
  editedItem.value = item
  dialogActive.value = true
}

function getTodoList () {
  isLoaded.value = false
  switch (switchList.value) {
    // case 'active-items':
    //   useGetActiveItems().then((todoList) => {
    //     if (todoList) {
    //       mapTodoList(todoList)
    //     } else {
    //       todoList.value = []
    //     }
    //     isLoaded.value = true
    //   })
    //   break
    // case 'completed-items':
    //   useGetCompletedItems().then((todoList) => {
    //     if (todoList) {
    //       mapTodoList(todoList)
    //     } else {
    //       todoList.value = []
    //     }
    //     isLoaded.value = true
    //   })
    //   break
    default:
      useGetItems().then((todoList) => {
        if (todoList) {
          mapTodoList(todoList)
        } else {
          todoList.value = []
        }
        isLoaded.value = true
      })
      break
  }
}

function filterData (rows: TodoList[], terms: TodoListFilter) {
  for (const term in terms) {
    rows = rows.filter((row) => {
      switch (term) {
        case 'name':
        case 'description':
        case 'completed':
          return (
            (row[term] + '')
              .toLowerCase()
              .indexOf(terms[term].toLowerCase()) !== -1
          )
        case 'deadline':
          // eslint-disable-next-line no-case-declarations
          const rowDate = row[term]
          if (rowDate) {
            const rd = useFormatDate(rowDate).toString()
            return rd.indexOf(terms[term]) !== -1
          } else {
            return true
          }
        default:
          return false
      }
    })
  }
  return rows
}

function mapTodoList (usrs: TodoListREST[]) {
  allTodoList.value = usrs.map((usr: TodoListREST) => usr)
  completedTodoList.value = allTodoList.value.filter(function (value) {
    return value.completed === true
  })
  activeTodoList.value = allTodoList.value.filter(function (value) {
    return value.completed === false
  })
  if (switchList.value === 'all-items') {
    todoList.value = allTodoList.value
  } else if (switchList.value === 'completed-items') {
    todoList.value = completedTodoList.value
  } else {
    todoList.value = activeTodoList.value
  }
  console.log(todoList)
}

onMounted(() => {
  loadTodoToggleOption()
  getTodoList()
})
</script>

<style>
.row-pointer > .v-data-table__wrapper > table > tbody > tr :hover {
  cursor: pointer;
}
</style>
