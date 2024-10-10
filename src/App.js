import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import Home from './components/home/Home';
import './App.css';

function App() {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/" className='d-flex gap-3'>
            <img
              alt="Logo"
              src="img/svg/logo.svg"
              height={80}
              className="d-inline-block align-top"
            />{' '}
            <div className='d-flex align-items-center'>
              <span className='fs-1 fw-medium text-dark-emphasis'>Fondo de Población de las Naciones Unidas</span>
            </div>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
