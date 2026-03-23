import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export const downloadFiles = function (type: string, exportFileName: string, collection: any) {
    if (type === 'excel') {
        const fileName = exportFileName + '.csv';
        const ws = XLSX.utils.json_to_sheet(collection);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'csv', type: 'array' });
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName);
    }
    // if (type === 'pdf') {
    //     var headerNames = Object.keys(collection[0]);
    //     const tableData = collection.map(item =>
    //         headerNames.map(key => item[key])
    //       );
    //     const fileName = exportFileName + '.pdf';
    //     const customLetterDimensions = [416, 279]; // Width x Height in mm
    //     const doc = new JsPDF({
    //         orientation: 'portrait',
    //         unit: 'mm',
    //         format: customLetterDimensions
    //     });
    //     const columnWidths = [40, 60, 80];
    //     autoTable(doc, {
    //         head: [headerNames],
    //         body: tableData,
    //         margin: { horizontal: 5 },
    //         bodyStyles: { valign: 'middle' },
    //         styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
    //         theme: 'grid',
    //     });
    //     doc.save(fileName);
    //     return false;
    // }
    
if (type === 'pdf') {
    const headerNames = Object.keys(collection[0]);
    const tableData = collection.map(item =>
        headerNames.map(key => item[key])
    );
    const fileName = exportFileName + '.pdf';
    const customLetterDimensions = [416, 279]; // Width x Height in mm
    const doc = new JsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: customLetterDimensions
    });
    const columnWidths = [40, 60, 80];

    // Create a modified tableData with text split into 15-character chunks
    const modifiedTableData = collection.map(item => {
        return headerNames.map(key => {
            const text = item[key];
            if (typeof text === 'string') {
                const textChunks = [];
                for (let i = 0; i < text.length; i += 15) {
                    textChunks.push(text.substring(i, i + 15));
                }
                return textChunks.join('\n'); // Join the chunks with line breaks
            } else {
                return text 
            }
        });
    });

    autoTable(doc, {
        head: [headerNames],
        body: modifiedTableData,
        margin: { horizontal: 5 },
        bodyStyles: { valign: 'middle' },
        styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
        theme: 'grid',
    });

    doc.save(fileName);
    return false;
} else {
        //! TODO document why this block is empty
    }
};
