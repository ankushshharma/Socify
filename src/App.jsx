import { useState } from 'react'
import './App.css'
import InstagramDownloader from './InstagramDownloader'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="main-container">
      <InstagramDownloader />
    </div>
  )
}

export default App
