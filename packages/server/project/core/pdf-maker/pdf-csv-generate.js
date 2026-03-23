import config from 'config';
import { PdfMaker } from './pdf-maker.js';
import { csvEmailReportHeaders } from './LanguageTranslate.js'
import { fileURLToPath } from 'url';
import path from 'path';
import Temp from 'temp';
import { createObjectCsvWriter } from 'csv-writer'

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example function that uses the current directory path
function getPdfFilePath(dirName, fileName) {
  return path.join(dirName, fileName);
}
function getCvsWriter(fileName, header) {
  const filePath = `${__dirname}/${fileName}`;
  const csvWriter = createObjectCsvWriter({ path: filePath, header });
  return { filePath, csvWriter };
};
class GenerateReport {
  async LogsPDF(language, employeesData, fileName, pdfFileTableHeader, pdfTableRowData, isExistAutoSendData) {
    try {
      const headers = csvEmailReportHeaders.productive[language] || csvEmailReportHeaders.productive['en'];
      const filePath = getPdfFilePath(__dirname, `${fileName}.pdf`);
      console.log('-----------Employee-Productive-started--pdf-----');
      // adding reseller logo link
      const pdfFileLogoUrl = config.get('EMPLOGO');
      const pdfDoc = new PdfMaker({ filepath: filePath }).createPdfDoc();
      pdfDoc.setFont('en');
      // Assuming formattedDetails is the content structure you've defined earlier
      //const formattedDetails = [
      const contentData = isExistAutoSendData[0].Content[0];
      const contentFields = [
        { label: 'Task', value: contentData.task },
        { label: 'Project', value: contentData.project },
        { label: 'SubTask', value: contentData.subTask },
        { label: 'Progress', value: contentData.progress },
        { label: 'Group', value: contentData.group },
        { label: 'Role', value: contentData.role }
      ];
      const filteredContent = contentFields
        .filter(field => field.value) // Keep only fields with true value
        .map(field => `${field.label}`) // Map to text
        .join(', '); // Join with comma
      const recipientsList = isExistAutoSendData[0].Recipients.map(recipient => recipient).join(", ");
      const recipientsText = `[${recipientsList}]`;
      function formatFrequency(frequencyData) {
        return frequencyData
          .map(f => {
            let frequencyText = [];
            if (f.Daily) frequencyText.push('Daily');
            if (f.Weekly) frequencyText.push('Weekly');
            if (f.Monthly) frequencyText.push('Monthly');
            return frequencyText.join(", ");
          })
          .filter(text => text.length > 0) // Filter out empty results
          .join("; "); // Separate different frequency entries with semicolon
      }
      function formatDate(date) {
        if (!(date instanceof Date)) {
          return '';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
      // Format frequency data
      const formattedFrequency = formatFrequency(isExistAutoSendData[0].frequency);
      const formattedDetails = [
        {
          width: '33%',
          text: `Report Details`,
          style: {
            fontSize: 15,
            text: 'Sample Text'
          }
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }],
          margin: [0, 10, 0, 10]
        },
        {
          columns: [
            {
              width: '33%',
              text: `ReportTitle: ${isExistAutoSendData[0].reportsTitle}`,
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `OrganizationID: ${isExistAutoSendData[0].orgId}`,
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `Recipients: ${recipientsText}`, // Format recipients as array
              style: {
                fontSize: 10,
                bold: false
              }
            }
          ]
        },
        {
          columns: [
            {
              width: '33%',
              text: `Frequency: ${formattedFrequency}`,
              style: {
                fontSize: 10,
                bold: false
              },
              margin: [0, 20, 0, 20]
            },
            {
              width: '33%',
              text: `Time: ${isExistAutoSendData[0].frequency[0].Time}`,
              style: {
                fontSize: 10,
                bold: false
              },
              margin: [0, 20, 0, 20]
            },
            {
              width: '33%',
              text: `StartDate: ${formatDate(isExistAutoSendData[0].frequency[0].Date.startDate)}`,
              style: {
                fontSize: 10,
                bold: false
              },
              margin: [0, 20, 0, 20]
            },
          ],
        },
        {
          columns: [
            {
              width: '33%',
              text: `EndDate: ${formatDate(isExistAutoSendData[0].frequency[0].Date.endDate)}`,
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `Content: ${filteredContent}`, // Use filtered content
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `ReportsType: ${isExistAutoSendData[0].ReportsType[0].pdf == 1 ? 'pdf' : 'csv'}`,
              style: {
                fontSize: 10,
                bold: false
              }
            }
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }],
          margin: [0, 5, 0, 0.5]
        },
        {
          canvas: [{ type: 'rect', x: 0, y: 0, w: 535, h: 20, color: '#CCCCCC' }],
          margin: [0, 5, 0, 5] // Adjust the margin to position the rectangle
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }],
          margin: [0, 0, 0, 0]
        }

      ];
      pdfDoc.setDocDetails(formattedDetails, pdfFileLogoUrl);
      await pdfDoc.setLogo(pdfFileLogoUrl);
      pdfDoc.setTableHeaders(pdfFileTableHeader);
      // blank entry
      pdfTableRowData.push({});
      const maxLength = 40;
      // create the report
      await pdfDoc.setTableBody(pdfTableRowData).end();
      console.log('-----------Employee-Productive-started--pdf-done----', filePath);
      return filePath;
    } catch (err) {
      console.log("catch", err)
    }
  }

  async LogsPDFTaskandProject(language, fileName, projectFileTableHeader, projectTableRowData, taskFileTableHeader, taskTableRowData, isExistAutoSendData) {
    try {
      const headers = csvEmailReportHeaders.productive[language] || csvEmailReportHeaders.productive['en'];
      const filePath = getPdfFilePath(__dirname, `${fileName}.pdf`);
      console.log('-----------Employee-Productive-started--pdf-----');
      // Adding reseller logo link
      const pdfFileLogoUrl = config.get('EMPLOGO');
      const pdfDoc = new PdfMaker({ filepath: filePath }).createPdfDoc();
      pdfDoc.setFont('en');

      // Define formattedDetails as before
      const contentData = isExistAutoSendData[0].Content[0];
      const contentFields = [
        { label: 'Task', value: contentData.task },
        { label: 'Project', value: contentData.project },
        { label: 'SubTask', value: contentData.subTask },
        { label: 'Progress', value: contentData.progress },
        { label: 'Group', value: contentData.group },
        { label: 'Role', value: contentData.role }
      ];
      const filteredContent = contentFields
        .filter(field => field.value) // Keep only fields with true value
        .map(field => `${field.label}`) // Map to text
        .join(', '); // Join with comma

      const recipientsList = isExistAutoSendData[0].Recipients.map(recipient => recipient).join(", ");
      const recipientsText = `[${recipientsList}]`;

      function formatFrequency(frequencyData) {
        return frequencyData
          .map(f => {
            let frequencyText = [];
            if (f.Daily) frequencyText.push('Daily');
            if (f.Weekly) frequencyText.push('Weekly');
            if (f.Monthly) frequencyText.push('Monthly');
            return frequencyText.join(", ");
          })
          .filter(text => text.length > 0) // Filter out empty results
          .join("; "); // Separate different frequency entries with semicolon
      }

      function formatDate(date) {
        if (!(date instanceof Date)) {
          return '';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }

      // Format frequency data
      const formattedFrequency = formatFrequency(isExistAutoSendData[0].frequency);

      // Define formattedDetails
      const formattedDetails = [
        {
          width: '33%',
          text: 'Report Details',
          style: {
            fontSize: 15,
            text: 'Sample Text'
          }
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }],
          margin: [0, 10, 0, 10]
        },
        {
          columns: [
            {
              width: '33%',
              text: `ReportTitle: ${isExistAutoSendData[0].reportsTitle}`,
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `OrganizationID: ${isExistAutoSendData[0].orgId}`,
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `Recipients: ${recipientsText}`, // Format recipients as array
              style: {
                fontSize: 10,
                bold: false
              }
            }
          ]
        },
        {
          columns: [
            {
              width: '33%',
              text: `Frequency: ${formattedFrequency}`,
              style: {
                fontSize: 10,
                bold: false
              },
              margin: [0, 20, 0, 20]
            },
            {
              width: '33%',
              text: `Time: ${isExistAutoSendData[0].frequency[0].Time}`,
              style: {
                fontSize: 10,
                bold: false
              },
              margin: [0, 20, 0, 20]
            },
            {
              width: '33%',
              text: `StartDate: ${formatDate(isExistAutoSendData[0].frequency[0].Date.startDate)}`,
              style: {
                fontSize: 10,
                bold: false
              },
              margin: [0, 20, 0, 20]
            },
          ],
        },
        {
          columns: [
            {
              width: '33%',
              text: `EndDate: ${formatDate(isExistAutoSendData[0].frequency[0].Date.endDate)}`,
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `Content: ${filteredContent}`, // Use filtered content
              style: {
                fontSize: 10,
                bold: false
              }
            },
            {
              width: '33%',
              text: `ReportsType: ${isExistAutoSendData[0].ReportsType[0].pdf == 1 ? 'pdf' : 'csv'}`,
              style: {
                fontSize: 10,
                bold: false
              }
            }
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }],
          margin: [0, 5, 0, 0.5]
        },
        {
          canvas: [{ type: 'rect', x: 0, y: 0, w: 535, h: 20, color: '#CCCCCC' }],
          margin: [0, 5, 0, 5] // Adjust the margin to position the rectangle
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 1 }],
          margin: [0, 0, 0, 0]
        }
      ];

      pdfDoc.setDocDetails(formattedDetails, pdfFileLogoUrl);

      pdfDoc.setTableHeaders(projectFileTableHeader);
      projectTableRowData.push({}); 
      await pdfDoc.setTableBody(projectTableRowData,"Project");
      pdfDoc.setTableHeaders(taskFileTableHeader);
      taskTableRowData.push({}); 
      await pdfDoc.setTableBody(taskTableRowData,"Task");


      await pdfDoc.end();
      console.log('-----------Employee-Productive-started--pdf-done----', filePath);
      return filePath;
    } catch (err) {
      console.log("catch", err);
    }
  }




  async LogsCSV(language, employeesData, fileName, pdfFileTableHeader, pdfTableRowData) {
    try {
      this.dirName = Temp.mkdirSync('csvWriter');
      let headers = csvEmailReportHeaders.productive[this.language] || csvEmailReportHeaders.productive['en'];

      const { filePath, csvWriter } = getCvsWriter(`${fileName}.csv`, [...pdfFileTableHeader]);
      console.log('-----------Employee-Productive-started--csv-----')
      if (employeesData.length === 0) {
        await csvWriter.writeRecords([{
          projectName: "",
          projectCode: "",
          currencyType: ""
        }]);
      }

      await csvWriter.writeRecords(pdfTableRowData);
      console.log('-----------Employee-Productive-started--csv-done----', filePath);
      return filePath;
    } catch (err) {
      console.log('-----csv2------', err);
      return Promise.reject(err);
    }
  }
}


export default new GenerateReport();
