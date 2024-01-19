import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CardForm from './CardForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CardForm/>
      </div>
    </>
  )
}

export default App
