import { renderComponent, flush } from './config'
import SignIn from '@/views/SignIn.vue'
import { fireEvent } from '@testing-library/vue'
import snapshotDiff  from 'snapshot-diff'

jest.useFakeTimers()

test('user filling the signin form', async () => {
  const store = {
    getters: {
      prevNav: jest.fn()
    }
  }
  const { container, getByRole, getByLabelText, queryByText } = renderComponent(SignIn, {
    store
  })
  
  await flush()
  const pristine = container.cloneNode(true)
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  await fireEvent.touch(getByRole('textbox', { name: /e-mail/i }))
  await flush()
  expect(queryByText(/cannot be empty/i)).toBeInTheDocument()

  await fireEvent.update(getByRole('textbox', { name: /e-mail/i }), 'jack@lumber')
  await flush()
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  expect(queryByText(/valid/i)).toBeInTheDocument()

  await fireEvent.update(getByRole('textbox', { name: /e-mail/i }), 'jack@lumber.com')
  await flush()
  expect(queryByText(/email must be valid/i)).not.toBeInTheDocument()
  expect(getByRole('button', { name: /submit/i })).toBeDisabled()

  expect(queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  await fireEvent.touch(getByLabelText(/password/i))
  await flush()
  expect(queryByText(/password cannot be empty/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/password/i), 'ichop')
  await flush()
  expect(queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  expect(queryByText(/must at least have/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/password/i), 'ichoptreeusingaxe')
  await flush()
  expect(queryByText(/must at least have/i)).not.toBeInTheDocument()
  expect(queryByText(/may not be greater than/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/password/i), 'ichoptree')
  await flush()
  expect(queryByText(/may not be greater than/i)).not.toBeInTheDocument()

  expect(getByRole('button', { name: /submit/i })).toBeEnabled()

  expect(snapshotDiff(pristine, container.cloneNode(true))).toMatchSnapshot()
})