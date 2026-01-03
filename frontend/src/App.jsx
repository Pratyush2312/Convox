import { Route, Routes } from 'react-router'
import Login from './components/Login.jsx'
import Client from './components/Client.jsx'

function App() {
  

  return (
    <>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/room/:roomId" element={<Client />} />
    </Routes>
    </>
  )
}

export default App
