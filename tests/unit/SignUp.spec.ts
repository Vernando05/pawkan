import { renderComponent, flush } from './config'
import SignUp from '@/views/SignUp.vue'
import { fireEvent } from '@testing-library/vue'
import snapshotDiff  from 'snapshot-diff'
import Vue from 'vue'
import { VueTelInput } from 'vue-tel-input'
require('es6-promise').polyfill()
require('isomorphic-fetch')

jest.useFakeTimers()

test('user filling the signup form', async () => {
  const store = {
    getters: {
      prevNav: jest.fn()
    }
  }
  const { container, getByRole, getByLabelText, queryByText } = renderComponent(SignUp, {
    store
  }, () => Vue.use(VueTelInput, { disabledFetchingCountry: true, defaultCountry: 'id' } as any))

  await flush()
  const pristine = container.cloneNode(true)
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  // field first name
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  await fireEvent.touch(getByRole('textbox', { name: /first name/i }))
  await flush()
  expect(queryByText(/empty/i)).toBeInTheDocument()

  await fireEvent.update(getByRole('textbox', { name: /first name/i }), 'jack who climb a giant peanut tree with his strong arms without even breaking a sweat')
  await flush()
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  expect(queryByText(/greater /i)).toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  await fireEvent.update(getByRole('textbox', { name: /first name/i }), 'jack')
  await flush()
  expect(queryByText(/greater /i)).not.toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  // field email
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  await fireEvent.touch(getByRole('textbox', { name: /e-mail/i }))
  await flush()
  expect(queryByText(/empty/i)).toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  await fireEvent.update(getByRole('textbox', { name: /e-mail/i }), 'jack@lumber')
  await flush()
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  expect(queryByText(/be valid/i)).toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  await fireEvent.update(getByRole('textbox', { name: /e-mail/i }), 'jack@lumber.com')
  await flush()
  expect(queryByText(/be valid/i)).not.toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  // field mobile
  await fireEvent.touch(getByLabelText(/mobile/i))
  expect(queryByText(/empty/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/mobile/i), '+628123456')
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  expect(queryByText(/invalid/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/mobile/i), '+628123456789')
  expect(queryByText(/invalid/i)).not.toBeInTheDocument()

  // field password
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  await fireEvent.touch(getByLabelText(/^password$/i))
  await flush()
  expect(queryByText(/empty/i)).toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  await fireEvent.update(getByLabelText(/^password$/i), 'ichop')
  await flush()
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  expect(queryByText(/at least/i)).toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  await fireEvent.update(getByLabelText(/^password$/i), 'ichoptreeusingaxe')
  await flush()
  expect(queryByText(/at least/i)).not.toBeInTheDocument()
  expect(queryByText(/greater /i)).toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  await fireEvent.update(getByLabelText(/^password$/i), 'ichoptree')
  await flush()
  expect(queryByText(/greater/i)).not.toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  // field confirmation email
  await fireEvent.update(getByLabelText(/confirm password/i),'ichoptreee')
  await fireEvent.touch(getByLabelText(/confirm password/i))
  await flush()
  expect(queryByText(/must be same/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/confirm password/i), 'ichoptree')
  await fireEvent.touch(getByLabelText(/confirm password/i))
  await flush()
  expect(queryByText(/must be same/i)).not.toBeInTheDocument()

  expect(getByRole('button', { name: /submit/i })).toBeEnabled()

  expect(snapshotDiff(pristine, container.cloneNode(true))).toMatchSnapshot()
}, 30000)