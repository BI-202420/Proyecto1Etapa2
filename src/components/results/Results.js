import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Table, ProgressBar, Modal, Button } from "react-bootstrap";
import * as XLSX from 'xlsx';

function Results() {
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = location.state || [];
    const [alert, setAlert] = useState({ show: false, message: "" });

    useEffect(() => {
        if (!data) setAlert({ show: true, message: "No se encontraron datos para mostrar." });
        console.log(data);
    }, [data]);

    function getDisplayedRows() {
        if (data.length <= 6) {
            return data;
        }
        return [...data.slice(0, 3), { opinion: "...", prediction: "...", probability: "..." }, ...data.slice(-3)];
    };

    function downloadResults() {
        const worksheetData = [
            ['Opinión', 'Clasificación', 'Probabilidad'], // Header
            ...data.map(row => [row.opinion, row.prediction, row.probability])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const tableRange = XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: range.e.r, c: range.e.c }
        });

        worksheet['!autofilter'] = { ref: tableRange };
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
        XLSX.writeFile(workbook, 'resultados.xlsx');
    }

    return (
        <Container>
            <p className='fs-2 fw-medium text-dark-emphasis mt-5 text-center'>Resultados de la clasificación de textos para los ODS</p>
            <Table striped bordered hover className="m-5 mt-3">
                <thead>
                    <tr>
                        <th style={{ width: '70%' }}>Opinión</th>
                        <th>Clasificación</th>
                        <th>Probabilidad</th>
                    </tr>
                </thead>
                <tbody>
                    {data && getDisplayedRows().map((row, index) => (
                        <tr key={index}>
                            <td>{row.opinion}</td>
                            <td className="align-middle">
                                {row.prediction === "..." ? (
                                    <span>...</span>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <img src={`img/svg/ods${row.prediction}.svg`} alt={`ODS${row.prediction}`} style={{ maxWidth: "50%", height: "auto" }} />
                                    </div>
                                )}
                            </td>
                            <td className="align-middle">
                                {row.probability === "..." ? (
                                    <span>...</span>
                                ) : (
                                    <>
                                    <ProgressBar style={{ height: "20px" }} now={parseFloat(row.probability) * 100} />
                                    <p className="text-center">{`${(parseFloat(row.probability) * 100).toFixed(2)}%`}</p>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="m-5 d-flex justify-content-around">
                <Button variant="outline-danger" onClick={()=>navigate("/")}>Volver al inicio</Button>
                <Button variant="success" onClick={downloadResults}>Descargar resultados</Button>
            </div>
            <Modal show={alert.show} onHide={()=>{setAlert({show:false,message:""}); navigate("/")}}>
                <Modal.Header closeButton>
                    <Modal.Title>¡Opps! Algo salió mal</Modal.Title>
                </Modal.Header>
                    <Modal.Body>{ alert.message }</Modal.Body>
                <Modal.Footer>
                <Button variant="outline-danger" onClick={()=>{setAlert({show:false,message:""}); navigate("/")}}>
                    Cerrar
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Results;