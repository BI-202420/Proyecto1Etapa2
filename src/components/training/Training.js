import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Accordion, Form, Modal, Button, Spinner, Card, ListGroup } from "react-bootstrap";
import { FileUpload } from 'primereact/fileupload';
import axios from "axios";
import * as XLSX from 'xlsx';

function Training() {
    const navigate = useNavigate();
    const [models, setModels] = useState([]);
    const [model, setModel] = useState({ name: "", source: "", opinions: [] });
    const [alert, setAlert] = useState({ show: false, message: "", success: false });
    const [loading, setLoading] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState("0");

    function getModels() {
        axios.get("http://localhost:8000/models")
            .then(response => setModels(response.data))
            .catch(error => console.log(error));
    }
    useEffect(getModels, []);

    function sendRequest(payload) {
        setLoading(true);
        axios.post("http://localhost:8000/fit", payload)
            .then(response => {
                setLoading(false);
                setAlert({ show: true, message: "Modelo reentrenado exitosamente.", success: true });
                setModels([...models, response.data]);
            })
            .catch(error => {
                setAlert({ show: true, message: "Ocurrió un error al procesar la solicitud.", success: false });
                console.log(error);
                setLoading(false);
            });
    }

    function handleFileUpload(event) {
        const file = event.files[0];
        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setAlert({ show: true, message: "Por favor sube solo archivos en formato .xlsx.", success: false });
            event.options.clear();
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            const jsonResult = worksheet.map(row => ({
                opinion: row['Textos_espanol'],
                category: row['sdg'].toString()
            }));
            setModel({...model, opinions: jsonResult});
        };

        reader.readAsArrayBuffer(file);
    }

    function handleTrainingSubmit() {
        if (model.name === "") {
            setAlert({ show: true, message: "Debes ingresar un nombre para el modelo.", success: false });
            return;
        }
        if (models.some(m => m.name === model.name)) {
            setAlert({ show: true, message: "Ya existe un modelo con ese nombre.", success: false });
            return;
        }
        if (model.opinions.length === 0) {
            setAlert({ show: true, message: "Debes subir un archivo con datos de entrenamiento.", success: false });
            return;
        }
        if (model.source === "") {
            setAlert({ show: true, message: "Debes seleccionar un modelo fuente.", success: false });
            return;
        }
        sendRequest(model);
    }

    function handleCloseAlert() {
        setAlert({...alert, show: false, message: "" });
        if (alert.success) {
            setAlert({...alert, success: false})
            navigate("/");
        }
    }

    return (
        <Container className="mb-5">
            <p className='fs-2 fw-medium text-dark-emphasis mt-5 text-center'>Reentrenamiento del modelo de clasificación de textos para los ODS</p>
            <div className="m-5 mt-3">
                <Accordion  activeKey={activeAccordion} onSelect={(eventKey) => setActiveAccordion(eventKey)}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Nombre del nuevo modelo</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="modelName">
                                    <Form.Label>Nombre del nuevo modelo</Form.Label>
                                    <Form.Control type="text" placeholder="Modelo" value={model.name} onChange={(event)=>{setModel({...model, name: event.target.value})}} />
                                    <Form.Text className="text-muted">
                                        Podrás identificar este modelo por su nombre.
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                            <span className="d-flex justify-content-end">
                                <Button variant="info" onClick={() => setActiveAccordion("1")}>
                                    Siguiente
                                </Button>
                            </span>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Datos de entrenamiento</Accordion.Header>
                        <Accordion.Body>
                            <FileUpload name="file" accept=".xlsx" auto customUpload uploadHandler={handleFileUpload} chooseLabel="Seleccionar archivo" uploadLabel="Subir" cancelLabel="Cancelar" emptyTemplate={<p className="m-0">Arrastra y suelta archivos aquí para subirlos</p>} />
                            <span className="d-flex justify-content-between mt-2">
                                <Button variant="secondary" onClick={() => setActiveAccordion("0")}>
                                    Anterior
                                </Button>
                                <Button variant="info" onClick={() => setActiveAccordion("2")}>
                                    Siguiente
                                </Button>
                            </span>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Modelo fuente</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-between px-5 gap-5">
                                <Form className="mb-3 w-100">
                                    <Form.Group controlId="sourceModel">
                                        <Form.Label>Modelo fuente</Form.Label>
                                        <Form.Select aria-label="Modelo fuente" value={model.source} onChange={(event)=>{setModel({...model, source: event.target.value})}}>
                                            <option>Selecciona un modelo</option>
                                            {models.map((model, index) => (
                                                <option key={index} value={model.name}>{model.name}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Text className="text-muted">
                                            Selecciona el modelo que deseas utilizar como base para el nuevo modelo.
                                        </Form.Text>
                                    </Form.Group>
                                </Form>

                                <Card style={{ width: '18rem' }}>
                                    <div className="d-flex justify-content-center">
                                        <Card.Img variant="top" src="img/svg/model.svg" style={{ width: "10rem" }} />
                                    </div>
                                    {model.source !== "" && (
                                        <Card.Body>
                                            <Card.Title>{model.source}</Card.Title>
                                            <p className="text-center">Métricas</p>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>Precisión: {models.find(m => m.name === model.source).precision}</ListGroup.Item>
                                                <ListGroup.Item>Recall: {models.find(m => m.name === model.source).recall}</ListGroup.Item>
                                                <ListGroup.Item>F1 Score: {models.find(m => m.name === model.source).f1}</ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    )}
                                </Card>
                            </div>
                            <span className="d-flex justify-content-between mt-2">
                                <Button variant="secondary" onClick={() => setActiveAccordion("1")}>
                                    Anterior
                                </Button>
                                <Button variant="success" onClick={handleTrainingSubmit}>
                                    Reentrenar
                                </Button>
                            </span>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <Modal show={alert.show} onHide={handleCloseAlert}>
                <Modal.Header closeButton>
                    <Modal.Title>Operación {alert.success?"Exitosa":" Inválida"}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>{ alert.message }</Modal.Body>
                <Modal.Footer>
                <Button variant="outline-danger" onClick={handleCloseAlert}>
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

export default Training;
