import { renderComponent } from './config'
import Account from '@/views/Account.vue'
import SignUp from '@/views/SignUp.vue'
import SignIn from '@/views/SignIn.vue'

const routes = [
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp }
]

test('signout signin state', async () => {
  const store = {
    state: {},
    getters: {
      customerAccessToken: jest.fn(),
      currentLanguage: jest.fn()
    }
  }
  const { container, queryByText } = renderComponent(Account, {
    routes,
    store
  })
  expect(queryByText(/sign in/i)).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

test('signin state', async () => {
  const store = {
    state: {},
    getters: {
      customerAccessToken: jest.fn(() => 't0k3n'),
      currentLanguage: jest.fn()
    }
  }
  const { container, queryByText } = renderComponent(Account, {
    routes,
    store
  })
  expect(queryByText(/sign out/i)).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
