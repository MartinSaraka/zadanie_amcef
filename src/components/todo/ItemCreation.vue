<template>
  <div class="q-pa-md bg-primary" style="width: 1000px; max-width: 1800vw">
    <div class="text-white q-pa-sm q-ma-sm col-3 transparent text-right" dark>
      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </div>

    <q-card class="q-pa-sm q-ma-sm col-3 transparent" dark>
      <q-toolbar flat color="primary" class="rounded">
        <q-icon size="32px" name="mdi-account-outline" />
        <q-toolbar-title>Todo Item creation</q-toolbar-title>
        <q-space />

      </q-toolbar>
    </q-card>
    <q-form v-model="valid" :lazy-validation="lazy" dark>
    <div class="row">
      <div class="col-4 q-px-md">
        <q-input
          v-model="item.name"
          :rules="[(v) => !!v || 'Item is required']"
          item-text="task"
          label="Name"
          label-color="secondary"
          dark
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 q-px-md">
        <q-input
          ref="todoItemDescription"
          label="Description"
          label-color="secondary"
          v-model="item.description"
          rows="2"
          dark
          type="textarea"
          title="Arbitrary description given to the TodoList item"
        />
      </div>
    </div>

      <div class="col-4 q-px-md">
        <q-input
          readonly
          label="Deadline"
          label-color="secondary"
          v-model="expireString"
          dark
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy>
                <q-date v-model="expireString" mask="DD.MM.YYYY"></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-4 q-px-md">
        <q-checkbox
          label="Completed"
          v-model="item.completed"
          required
          dark
        />
      </div>
  </q-form>
    <q-card class="q-pa-sm q-ma-sm col-3 transparent" dark>

    </q-card>
    <q-card class="q-pa-sm q-ma-sm col-3 transparent" dark>
      <div class="row mt-10">
        <div class="col pa-1" col="12" lg="12">
          <q-btn block @click="reset" > Reset </q-btn>
          <q-btn
            label="Save & Close"
            @click="saveUserAndClose"
            color="primary"
            block
          />
        </div>
      </div>
      <q-dialog v-model="leaveDialog" max-width="400px">
        <q-card>
          <q-card-section>
            Do you realy want to<br />{{ action }}<br />this todo item without saving
            changes?
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn text color="primary" @click="leaveDialog = false">
              OK
            </q-btn>
            <q-btn text color="primary" @click="leaveDialog = false">
              Cancel
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'

import {
  useCreateTodoListItem
} from 'src/composables/TodoListServices'
import { watch, ref } from 'vue'

import {
  useFormatDateByFormatString
} from 'src/composables/commonUtils'
import { TodoList } from 'src/models/TodoList'
import { QInput } from 'quasar'

const todoItemDescription = ref(null)
const lazy = ref(true)

const defaultFormValues = {
  name: '',
  description: '',
  completed: true
} as unknown as TodoList

const item = ref(cloneDeep(defaultFormValues) as TodoList)
const expireString = ref(
  useFormatDateByFormatString(item.value.deadline, 'DD.MM.YYYY')
)
const leaveDialog = ref(false)

const action = ref(null as unknown as string)
const emit = defineEmits([

  'itemCreated',
  'closeCreationDialog'
])
const valid = ref(true)

function onExpireChange () {
  item.value.deadline = new Date(
    expireString.value.substring(6, 10) +
      '-' +
      expireString.value.substring(3, 5) +
      '-' +
      expireString.value.substring(0, 2) +
      'T00:00:00Z'
  )
}

function reset () {
  item.value = cloneDeep(defaultFormValues)
}

function saveUserAndClose () {
  saveItem()
  emit('closeCreationDialog')
}

function saveItem () {
  useCreateTodoListItem(item.value)
  emit('itemCreated')
}

watch(expireString, () => {
  onExpireChange()
})
</script>

<style>
.text-negative {
  color: #3c2d2d !important;
}

.q-field--error .q-field__bottom {
  color: #3c2d2d !important;
}
.bg-error {
  background: #3c2d2d !important;
}
</style>
