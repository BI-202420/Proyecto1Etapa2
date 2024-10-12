import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import Home from './components/home/Home';
import Results from './components/results/Results';
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
      <Container>
        <span className="d-flex justify-content-center mt-4">
          <img src="img/svg/ods.svg" alt="ODS"/>
        </span>
        <div className="d-flex justify-content-center gap-5 mt-4">
          <img src="img/svg/ods3.svg" alt="ODS3" style={{ width: "20%" }} />
          <img src="img/svg/ods4.svg" alt="ODS3" style={{ width: "20%" }} />
          <img src="img/svg/ods5.svg" alt="ODS3" style={{ width: "20%" }} />
        </div>
      </Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results/" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
