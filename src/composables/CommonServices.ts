/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

import { Notify } from 'quasar'

import { TodoList } from 'src/models/TodoList'
export const baseUrl = 'https://642a8173b11efeb7599aef38.mockapi.io/'

export async function useGetResponseData (
  url: string,
  componentName: string,
  canuseSendAlert = true
) {
  try {
    const requestConfig = { headers: { } }
    const response = await axios.get(url, requestConfig)
    return response.data
  } catch (error: any) {
    const statusCode = error.response?.status
    if (statusCode === 401) {
      // zbytocne teraz
      return null
    }
    if (statusCode === 404) {
      return null
    }
    if (canuseSendAlert) {
      const errorMessage = error.response?.data?.message || 'not selected'
      const errorType = statusCode === 404 ? 'warning' : 'negative'
      useSendAlert(componentName, errorType, errorMessage, '')
    }
    return null
  }
}

export async function useGetResponseStream (url: string, componentName: string) {
  return axios
    .get(url, {
      headers: {
      },
      responseType: 'blob'
    })
    .then((response) => {
      if (response.data.message) {
        useSendAlert(componentName, 'negative', response.data.message, '')
      } else {
        return response
      }
    })
    .catch(async (error: any) => {
      let responseData = null
      try {
        const responseText = await error.response.data.text()
        responseData = JSON.parse(responseText)
      } catch (error: any) {
        console.log(error)
      }
      const errorMessage = responseData?.message || 'not selected'
      useSendAlert(componentName, 'negative', errorMessage, '')
      return null
    })
}

export async function usePostResponseStream (
  url: string,
  componentName: string
) {
  return axios
    .post(url, {
      headers: {
      },
      responseType: 'blob'
    })
    .then((response) => {
      if (response.data.message) {
        useSendAlert(componentName, 'negative', response.data.message, '')
      } else {
        return response
      }
    })
    .catch(async (error: any) => {
      let responseData = null
      try {
        const responseText = await error.response.data.text()
        responseData = JSON.parse(responseText)
      } catch (error: any) {
        console.log(error)
      }
      const errorMessage = responseData?.message || 'not selected'
      useSendAlert(componentName, 'negative', errorMessage, '')
      return null
    })
}

export async function useUpdateData (
  url: string,
  data:TodoList,
  componentName: string,
  updatedItemName: string,
  updateMulti = false
) {
  try {
    const requestConfig = { headers: { } }
    const response = await axios.put(url, data, requestConfig)
    const componentId = updateMulti
      ? response.data.map((item: any) => item[updatedItemName].id) // componentId will look like [150, 151]
      : response.data[updatedItemName].id // componentId will loke like 150
    useSendAlert(componentName, 'positive', 'updated', componentId)
    return response
  } catch (error: any) {
    // useSendAlert(componentName, 'negative', errorMessage, '')
    return null
  }
}

export async function useCreateData (
  url: string,
  data:TodoList,
  componentName: string,
  createdItemName: string,
  createMulti = false
) {
  try {
    const requestConfig = { headers: { } }
    const response = await axios.post(url, data, requestConfig)
    const componentId = createMulti
      ? response.data.map((item: any) => item[createdItemName].id) // componentId will look like [150, 151]
      : response.data[createdItemName].id // componentId will loke like 150
    useSendAlert(componentName, 'positive', 'created', componentId)
    return response
  } catch (error: any) {
    return null
  }
}

export async function useDeleteData (
  url: string,
  data: any,
  componentName: string,
  id: number | string | undefined | number[]
) {
  try {
    const requestConfig = { headers: { }, data }
    const response = await axios.delete(url, requestConfig)
    // When deleting data, backend doesn't return id(s), that's why id(s) is passed directly to useSendAlert
    useSendAlert(componentName, 'positive', 'deleted', id)
    return response
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'not deleted'
    useSendAlert(componentName, 'negative', errorMessage, '')
    return null
  }
}

export function useSendAlert (
  componentName: string,
  type: string,
  action: string,
  componentId: number | string | undefined | number[]
) {
  Notify.create({
    type,
    message: componentName,
    caption: buildMessage(componentId, action),
    html: true,
    position: 'bottom-right',
    timeout: type === 'negative' ? 0 : 5000,
    classes: 'text-h6',
    iconSize: '50px',
    actions:
      type === 'negative'
        ? [
            {
              label: 'X',
              color: 'white',
              handler: () => {
                /* */
              }
            }
          ]
        : []
  })
}

function buildMessage (
  componentId: number | string | undefined | number[],
  action: string
) {
  if (componentId && componentId !== '') {
    return `id/name: <strong>${componentId}</strong> <strong>${action}</strong>`
  } else {
    return `<strong> ${action} </strong>`
  }
}
