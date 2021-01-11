import Vue from 'vue'
import Vuetify from 'vuetify'
import { render } from '@testing-library/vue'
import '@testing-library/jest-dom'
import * as enJson from '@/locales/en.json'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)

export const renderComponent = (component: any, { mocks, ...options }: any = {} , callback?: any) => {
  const root = document.createElement('div')
  root.setAttribute('data-app', 'true')

  return render(
    component,
    {
      container: document.body.appendChild(root),
      vuetify: new Vuetify,
      mocks: {
        $t: (msg: string): string => getMsg(enJson, msg),
        ...mocks
      },
      ...options
    },
    callback
  )
}

export const getMsg = (messages: Record<string, string>, msg: string ): string => {
  return messages[msg]
}

export const flush = async () => {
  await flushPromises()
  jest.runAllTimers()
}