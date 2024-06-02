import { Route, Routes } from 'react-router-dom';
import { About } from './components/About.jsx';
import { Edit } from './components/Edit.jsx';
import { Home } from './components/Home.jsx';
import { List } from './components/List.jsx';
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
        <Route path='list/:archive_animal' element={<List />} />
        <Route path=':archive_animal/:archive_id' element={<ShowDicom />} />
      </Routes>
    </>
  )
}

export default App
