import { Container, Accordion, Form } from "react-bootstrap";

function Home() {
    return (
        <Container>
            <span className="d-flex justify-content-center mt-4">
                <img src="img/svg/ods.svg" alt="ODS"/>
            </span>
            <p className='fs-2 fw-medium text-dark-emphasis mt-4 text-center'>Clasificador de textos en ODSs</p>
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
                            <Form>
                                <Form.Group className="mb-3" controlId="textForm.ControlTextarea">
                                    <Form.Label>Texto a clasificar</Form.Label>
                                    <Form.Control as="textarea" rows={3} />
                                </Form.Group>
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
        </Container>
    );
}

export default Home;