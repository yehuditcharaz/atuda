import React from 'react';
import './DownloadData.css';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

const DownloadData = ({ data }) => {
    
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'data.xlsx', { bookType: 'xlsx', type: 'binary' });
    };

    const exportToCSV = () => {
        const dataCSV = Object.entries(data);
        const csvContent = dataCSV.map(([key, value]) => `${key},${JSON.stringify(value)}`).join('\n');
        const bom = '\uFEFF';
        const csvWithBom = bom + csvContent;
        const dataBlob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
        const csvFileUrl = URL.createObjectURL(dataBlob);
        const downLink = document.createElement('a');
        downLink.href = csvFileUrl;
        downLink.download = 'data.csv';
        downLink.click();
    };

    const exportToPDF = () => {
        const document = new jsPDF();
        document.setFont("helvetica");
        const dataPDF = Object.entries(data);
        let location = 20;
        dataPDF.forEach(([key, value]) => {
            let valueString = typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
            valueString = valueString.normalize("NFKD").replace(/[\u0590-\u05FF]/g, "");
            document.text(`${key}: ${valueString}`, 10, location);
            location += 10;
            if (location > 250) {
                document.addPage();
                location = 20;
            }
        });
        document.save('data.pdf');
    };

    return (
        <div className="download-data">
            <Button icon="pi pi-file-pdf" className="circular-button" onClick={exportToPDF} />
            <Button icon="pi pi-file-excel" className="circular-button" onClick={exportToExcel} />
            <Button icon="pi pi-file-o" className="circular-button" onClick={exportToCSV} />
        </div>
    );
};

export default DownloadData;