import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Accordion, Form, Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

function Home() {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState([{ opinion: "" }]);
    const [alert, setAlert] = useState({ show: false, message: "" });
    const [loading, setLoading] = useState(false);

    function handleOpinionChange(event) {
        const newFormFields = [...formFields];
        newFormFields[event.target.dataset.id].opinion = event.target.value;
        setFormFields(newFormFields);
    }

    function handleAddField(event) {
        const newFormFields = [...formFields];
        newFormFields.splice(event.target.dataset.id+1, 0, { opinion: "" });
        setFormFields(newFormFields);
    }

    function handleRemoveField(event) {
        if (formFields.length > 1) {
            const newFormFields = [...formFields];
            newFormFields.splice(event.target.dataset.id, 1);
            setFormFields(newFormFields);
        } else setAlert({ show: true, message: "Debes tener al menos un campo de texto." });
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formFields.some(field => field.opinion === "")) {
            setAlert({ show: true, message: "Debes llenar todos los campos de texto." });
            return;
        }
        const payload = {model: 1, opinions: formFields.map(field => ({opinion: field.opinion}))};
        setLoading(true);
        axios.post("http://localhost:8000/body", payload)
            .then(response => {
                setLoading(false);
                navigate("/results", { state: { data: response.data } });
            })
            .catch(error => {
                setAlert({ show: true, message: "Ocurrió un error al procesar la solicitud." });
                console.log(error);
                setLoading(false);
            });
    }

    return (
        <Container>
            <span className="d-flex justify-content-center mt-4">
                <img src="img/svg/ods.svg" alt="ODS"/>
            </span>
            <p className='fs-2 fw-medium text-dark-emphasis mt-4 text-center'>Clasificador de textos para los ODS</p>
            <div className="d-flex justify-content-center gap-5">
                <img src="img/svg/ods3.svg" alt="ODS3" style={{ width: "20%" }} />
                <img src="img/svg/ods4.svg" alt="ODS3" style={{ width: "20%" }} />
                <img src="img/svg/ods5.svg" alt="ODS3" style={{ width: "20%" }} />
            </div>
            <div className="m-5">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Entrada de texto</Accordion.Header>
                        <Accordion.Body>
                            <Form onSubmit={handleSubmit}>
                                { formFields.map((field, idx) => (
                                    <div className="d-flex justify-content-between mb-3" key={idx}>
                                        <Form.Group className="w-100" controlId="textForm.ControlTextarea">
                                            <Form.Label>Texto a clasificar</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={field.opinion} data-id={idx} onChange={handleOpinionChange} />
                                        </Form.Group>
                                        <span className="d-flex flex-column justify-content-end ms-2 gap-2">
                                            <Button variant="success" onClick={handleAddField} data-id={idx}>Agregar</Button>{' '}
                                            <Button variant="outline-danger" data-id={idx} onClick={handleRemoveField}>Eliminar</Button>{' '}
                                        </span>
                                    </div>
                                ))}
                                <span className="d-flex justify-content-end">
                                    <Button variant="primary" type="submit">
                                        Enviar
                                    </Button>
                                </span>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Subir Archivo</Accordion.Header>
                        <Accordion.Body>
                            Test
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <Modal show={alert.show} onHide={()=>setAlert({show:false,message:""})}>
                <Modal.Header closeButton>
                    <Modal.Title>Operación Inválida</Modal.Title>
                </Modal.Header>
                    <Modal.Body>{ alert.message }</Modal.Body>
                <Modal.Footer>
                <Button variant="outline-danger" onClick={()=>setAlert({show:false,message:""})}>
                    Cerrar
                </Button>
                </Modal.Footer>
            </Modal>
            {loading && (
                <div className="gap-2 position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                    <Spinner animation="grow" variant="light" style={{ animationDelay: '0s' }} />
                    <Spinner animation="grow" variant="light" style={{ animationDelay: '0.1s' }} />
                    <Spinner animation="grow" variant="light" style={{ animationDelay: '0.2s' }} />
                </div>
            )}
        </Container>
    );
}

export default Home;