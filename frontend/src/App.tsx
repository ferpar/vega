import { observer } from '@legendapp/state/react'
import { auth$ } from './core/AuthStore'
import { router$ } from './core/RouterStore'
import { Main } from './components/Main'
import { Login } from './components/Login'
import { Profile } from './components/Profile'
import { Logout } from './components/Logout'
import './App.css'

const App = observer(() => {
  const currentRoute = router$.currentRoute.get()
  const token = auth$.token.get()

  return (
    <>
      {token && <Logout />}
      {currentRoute === 'home' && <Main />}
      {currentRoute === 'login' && <Login />}
      {currentRoute === 'profile' && <Profile />}
    </>
  )
})

export default App
