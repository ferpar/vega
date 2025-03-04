import { observer} from '@legendapp/state/react'
import { router$ } from './core/RouterStore'
import { Main } from './components/Main'
import { Login } from './components/Login'
import { Profile } from './components/Profile'
import './App.css'

function App() {
  const currentRoute = router$.currentRoute.get()

  return (
    <>
    {currentRoute === 'home' && <Main />}
    {currentRoute === 'login' && <Login />}
    {currentRoute === 'profile' && <Profile />}
    </>
  )
}

export default App
