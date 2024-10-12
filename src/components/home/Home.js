import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Accordion, Form, Button, Card, ListGroup, Modal, Spinner } from "react-bootstrap";
import { FileUpload } from 'primereact/fileupload';
import axios from "axios";
import * as XLSX from 'xlsx';

function Home() {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState([{ opinion: "" }]);
    const [models, setModels] = useState([]);
    const [model, setModel] = useState({});
    const [alert, setAlert] = useState({ show: false, message: "" });
    const [loading, setLoading] = useState(false);

    function getModels() {
        axios.get("http://localhost:8000/models")
            .then(response => {setModels(response.data); setModel(response.data[0]);})
            .catch(error => console.log(error));
    }
    useEffect(getModels, []);

    function handleOpinionChange(event) {
        const newFormFields = [...formFields];
        newFormFields[event.target.dataset.id].opinion = event.target.value;
        setFormFields(newFormFields);
    }

    function handleAddField(idx) {
        const newFormFields = [...formFields];
        newFormFields.splice(idx+1, 0, { opinion: "" });
        setFormFields(newFormFields);
    }

    function handleRemoveField(event) {
        if (formFields.length > 1) {
            const newFormFields = [...formFields];
            newFormFields.splice(event.target.dataset.id, 1);
            setFormFields(newFormFields);
        } else setAlert({ show: true, message: "Debes tener al menos un campo de texto." });
    }

    function sendRequest(payload) {
        setLoading(true);
        axios.post("http://localhost:8000/transform", payload)
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

    function handleSubmit(event) {
        event.preventDefault();
        if (formFields.some(field => field.opinion === "")) {
            setAlert({ show: true, message: "Debes llenar todos los campos de texto." });
            return;
        }
        const payload = {model: model.name, opinions: formFields.map(field => ({opinion: field.opinion}))};
        sendRequest(payload);
    }

    function handleFileUpload(event) {
        const file = event.files[0];
        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setAlert({ show: true, message: "Por favor sube solo archivos en formato .xlsx." });
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
                opinion: row['Textos_espanol']
            }));
            sendRequest({model: 1, opinions: jsonResult});
            event.options.clear();
        };

        reader.readAsArrayBuffer(file);
    }

    return (
        <Container>
            <p className='fs-2 fw-medium text-dark-emphasis mt-5 text-center'>Clasificador de textos para los ODS</p>
            <div className="m-5 mt-3">
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
                                            <Button variant="success" onClick={()=>handleAddField(idx)} data-id={idx}>Agregar</Button>{' '}
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
                            <FileUpload name="file" accept=".xlsx" customUpload uploadHandler={handleFileUpload} chooseLabel="Seleccionar archivo" uploadLabel="Subir" cancelLabel="Cancelar" emptyTemplate={<p className="m-0">Arrastra y suelta archivos aquí para subirlos</p>} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Modelo</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-between px-5 gap-5">
                                <Form className="mb-3 w-100">
                                    <Form.Group controlId="sourceModel">
                                        <Form.Label>Modelo</Form.Label>
                                        <Form.Select aria-label="Modelo fuente" value={model.name} onChange={(event)=>{setModel(models.find(m => m.name === event.target.value))}}>
                                            {models.map((model, index) => (
                                                <option key={index} value={model.name}>{model.name}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Text className="text-muted">
                                            Selecciona el modelo que deseas utilizar.
                                        </Form.Text>
                                    </Form.Group>
                                </Form>

                                <Card style={{ width: '18rem' }}>
                                    <div className="d-flex justify-content-center">
                                        <Card.Img variant="top" src="img/svg/model.svg" style={{ width: "10rem" }} />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{model.name}</Card.Title>
                                        <p className="text-center">Métricas</p>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Precisión: {model.precision}</ListGroup.Item>
                                            <ListGroup.Item>Recall: {model.recall}</ListGroup.Item>
                                            <ListGroup.Item>F1 Score: {model.f1}</ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </div>
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
