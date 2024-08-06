import { ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import { About } from './components/About.jsx';
import { Edit } from './components/Edit.jsx';
import { Home } from './components/Home.jsx';
import { List } from './components/List.jsx';
import { Login } from './components/Login.jsx';
import { LoginProvider } from './components/LoginProvider.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ShowDicom } from './components/ShowDicom.jsx';
import theme from './styles/palette.jsx';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
      <LoginProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path="edit" element={<ProtectedRoute element={<Edit />} />} />
          <Route path='list/:archive_animal' element={<List />} />
          <Route path=':archive_animal/:archive_id' element={<ShowDicom />} />
        </Routes>
      </LoginProvider>
      </ThemeProvider>
    </>
  )
}

export default App
