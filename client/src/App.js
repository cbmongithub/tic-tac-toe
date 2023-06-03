import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/Game'

const App = () => {
  return (
    <main className='flex justify-center items-center w-full min-h-screen'>
      <Router>
        <Routes>
          <Route path='/' exact element={<Game />} />
        </Routes>
      </Router>
    </main>
  )
}

export default App
