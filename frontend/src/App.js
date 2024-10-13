import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Fade } from "react-awesome-reveal";
import Home from './components/home/Home';
import Results from './components/results/Results';
import Training from './components/training/Training';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

function AppContent() {
  const location = useLocation();
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/" className='d-flex gap-3'>
            <img
              alt="Logo"
              src="img/svg/logo.svg"
              height={80}
              className="d-inline-block align-top"
            />{' '}            
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <div className='d-flex flex-column flex-lg-row align-items-center justify-content-between w-100'>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <span className='fs-1 fw-medium text-dark-emphasis text-center mb-3 mb-lg-0'>
                  Fondo de Población de las Naciones Unidas
                </span>
              </Link>
              <Link to="/training">
                <Button variant="outline-success" className="mt-2 mt-lg-0">Reentrenar</Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Fade direction='up' key={location.pathname}>
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
      </Fade>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results/" element={<Results />} />
        <Route path="/training/" element={<Training />} />
      </Routes>
    </>
  );
}
