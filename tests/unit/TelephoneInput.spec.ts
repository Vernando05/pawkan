import { renderComponent, flush } from './config'
import TelephoneInput from '@/components/TelephoneInput.vue'
import { fireEvent } from '@testing-library/vue'
import snapshotDiff  from 'snapshot-diff'
require('es6-promise').polyfill()
require('isomorphic-fetch')

jest.useFakeTimers()

test('telephone input', async () => {
  const { container, getByLabelText, queryByText, getAllByText, getByText } = renderComponent(TelephoneInput, {
    props: { 
      label: 'mobile',
      preferredCountries: ['id', 'sg'],
      dynamicPlaceholder: true
    }
  })

  const pristine = container.cloneNode(true)
  
  expect(getByLabelText(/mobile/i)).toBeInTheDocument()
  expect(queryByText(/'enter a phone number/i)).not.toBeInTheDocument()

  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  await fireEvent.touch(getByLabelText(/mobile/i))
  await flush()
  expect(queryByText(/empty/i)).toBeInTheDocument()

  expect(queryByText(/invalid/i)).not.toBeInTheDocument()
  await fireEvent.update(getByLabelText(/mobile/i), '+628123456')
  await flush()
  expect(queryByText(/empty/i)).not.toBeInTheDocument()
  expect(queryByText(/invalid/i)).toBeInTheDocument()

  await fireEvent.update(getByLabelText(/mobile/i), '+628123456789')
  await flush()
  expect(queryByText(/invalid/i)).not.toBeInTheDocument()

  await fireEvent.click(getByText(/▼/i))
  await flush()
  expect(getAllByText(/indonesia/i)[0]).toBeVisible()

  expect(snapshotDiff(pristine, container.cloneNode(true))).toMatchSnapshot()
})
