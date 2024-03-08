import { Route, Routes } from 'react-router-dom';
import { About } from './components/About.jsx';
import { Edit } from './components/Edit.jsx';
import { Home } from './components/Home.jsx';
import { Navbar } from './components/Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='edit' element={<Edit />} />

      </Routes>
    </>
  )
}

export default App
