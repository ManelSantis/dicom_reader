import { Route, Routes } from 'react-router-dom';
import { About } from './components/About.jsx';
import { Canino } from './components/Canino.jsx';
import { Edit } from './components/Edit.jsx';
import { Home } from './components/Home.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ShowDicom } from './components/ShowDicom.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='edit' element={<Edit />} />
        <Route path='canino' element={<Canino />} />
        <Route path='canino/:archive_id' element={<ShowDicom />} />
      </Routes>
    </>
  )
}

export default App
