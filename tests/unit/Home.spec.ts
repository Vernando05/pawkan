import { renderComponent } from './config'
import Home from '@/views/Home.vue'

test('signout state', async () => {
  const store = {
    getters: {
      customerAccessToken: jest.fn(),
      currentLanguage: jest.fn()
    }
  }
  const { container, queryByText } = renderComponent(Home, {
    store
  })

  expect(queryByText(/'hi'/i)).not.toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

test('signin state', async () => {
  const store = {
    getters: {
      customerAccessToken: jest.fn(() => true),
      currentLanguage: jest.fn()
    }
  }
  const { container, queryByText } = renderComponent(Home, {
    store,
    data () {
      return {
        customer: {
          firstName: 'jack'
        }
      }
    },
  })

  expect(queryByText(/jack/i)).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
