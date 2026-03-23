import PdfPrinter from 'pdfmake';
import fs from 'fs';
import fonts from './fonts/index.js';
import axios from 'axios';

class PdfMaker {
    constructor({ filepath, customMailSilah }) {
        this.fonts = fonts;
        this.font = customMailSilah ? 'Tajawal' : 'Roboto';
        this.filepath = filepath;
        this.docDefinition = {};
        this.docDefinition.header = {};
        this.docDefinition.header.columns = [];
        this.docDefinition.content = [];
    }

    createPdfDoc() {
        this.printer = new PdfPrinter(this.fonts);
        return this;
    }

    setFont(language = 'en') {
        if (language == 'ar') this.font = 'Roboto';
        return this;
    }

    setTableHeaders(headerObj) {
        this.tableHeaders = [];
        this.tableHeadersOrder = [];
        for (let i = 0; i < headerObj.length; i++) {
            this.tableHeaders.push({
                text: headerObj[i].title,
                fillColor: '#CCCCCC', // Set your desired background color here
                color: '#000000', // Text color
                bold: true, // Make the header text bold
                alignment: 'center', // Center align the text
                margin: [0, 5, 0, 5]
            }) // Add some padding);
            this.tableHeadersOrder.push(headerObj[i].id);
        }
        return this;
    }

    setTableBody(bodyObj, tableName) {  // Added 'tableName' as a parameter
        let widthType = this.tableHeaders.length < 10 ? '*' : `${(100 / this.tableHeaders.length).toFixed(2)}%`;
        let tableFontSize = this.tableHeaders.length < 7 ? 10 : this.tableHeaders.length < 13 ? 5 : 4.5;
    
        // Add the table name as a text element before the table
        this.docDefinition.content.push({
            text: tableName,  // The table name/title
            fontSize: 12,  // Font size for the table name
            bold: false, 
            margin: [0, 10, 0, 5] , // Margin around the table name [left, top, right, bottom]
            decoration: 'underline'
        });
    
        // Push the table content with spacing below
        this.docDefinition.content.push({
            font: this.font,
            fontSize: tableFontSize,
            style: 'tableStyle',
            table: {
                headerRows: 1,
                widths: Array(this.tableHeaders.length).fill(widthType),
                body: this.getTableBody(bodyObj)
            },
            margin: [0, 0, 0, 20]  // Margin below the table for spacing
        });
    
        // Table styles configuration (adjust if needed)
        this.docDefinition.styles = {
            tableStyle: {
                margin: [1, 1, 1, 1]  // Margins inside the table cells
            }
        };
    
        return this;
    }
    
    

    async setBarChart(imgPath) {
        const logoBase64Image = await this.getBase64Image(imgPath);
        this.docDefinition.content.push({
            alignment: 'center',
            image: logoBase64Image,
            fit: [400, 400]
        });
        return this;
    }

    setAppDomainList(pdfAppDomainList) {
        let max = Math.max(...(pdfAppDomainList.map(el => Math.max(...(el.map(val => val.length))))));
        let fontsize = max < 25 ? 7.5 : 6.3;
        this.docDefinition.content.push({
            fontSize: fontsize,
            style: 'tableStyle',
            bold: true,
            layout: 'noBorders',
            table: {
                widths: Array(5).fill('*'),
                body: pdfAppDomainList
            }
        });
        return this;
    }

    async end() {
        const pdfDoc = this.printer.createPdfKitDocument(this.docDefinition);
        const writeStream = fs.createWriteStream(this.filepath);

        pdfDoc.pipe(writeStream);
        pdfDoc.end();

        await new Promise(resolve => {
            writeStream.on('close', resolve);
        });

        return this.filepath;
    }

    getTableBody(bodyObj) {
        const resultArr = [];
        for (const tableRow of bodyObj) {
            const arrValueInTableHeaderOrder = [];
            for (const headerOrder of this.tableHeadersOrder) {
                arrValueInTableHeaderOrder.push(tableRow[headerOrder] || '');
            }
            resultArr.push(arrValueInTableHeaderOrder);
        }
        resultArr.unshift(this.tableHeaders);
        return resultArr;
    }

    async setLogo(imgUrl) {
        const logoBase64 = await this.getBase64ImageFromURL(imgUrl);

        // Ensure docDefinition and its properties are initialized
        if (!this.docDefinition.header) {
            this.docDefinition.header = { columns: [], margin: [0, 0, 0, 0] };
        }

        if (!this.docDefinition.header.columns) {
            this.docDefinition.header.columns = [];
        }

        // Set the logo and horizontal line in the header
        this.docDefinition.pageMargins = [40, 60, 40, 40];

        // Add logo and horizontal line to the header
        this.docDefinition.header = {
            columns: [
                {
                    width: '100%',
                    stack: [
                        // Logo
                        {
                            image: logoBase64,
                            fit: [150, 150],
                            alignment: 'right',
                            margin: [0, 20, 20, 30] // Adjusted margin for the logo to add space below it
                        },
                        // Horizontal line
                        {
                            canvas: [
                                {
                                    type: 'line',
                                    x1: 0,
                                    y1: 0,
                                    x2: 500, // Adjust x2 value based on the page width
                                    y2: 0,
                                    lineWidth: 1,
                                    lineColor: '#000000' // Line color (black)
                                }
                            ],
                            margin: [0, 10, 0, 0] // Margin for the line
                        },
                        // Description or additional content (optional)
                        {
                            text: 'Your Description Here', // Placeholder for additional content
                            margin: [0, 20, 0, 0] // Extra space before the description
                        }
                    ]
                }
            ],
            margin: [0, 0, 0, 10] // Margin to ensure proper spacing
        };
    }



    async getBase64ImageFromURL(url) {
        const image = await axios.get(url, { responseType: 'arraybuffer' });
        const raw = Buffer.from(image.data).toString('base64');
        return `data:${image.headers["content-type"]};base64,${raw}`;
    }

    async getBase64Image(img) {
        const pngRaw = fs.readFileSync(img).toString('base64');
        return `data:image/png;base64,${pngRaw}`;
    }

    async setDocDetails(details, pdfFileLogoUrl, margin) {
    

        // Initialize the document definition if it doesn't exist
        if (!this.docDefinition) {
            this.docDefinition = {};
        }
        // Define styles
        this.docDefinition.styles = {
            details: {
                fontSize: 2, // Set the font size
                margin: [0, 20, 0, 20], // Set margins
                bold: false // Ensure text is not bold
            },
            subheading: {
                fontSize: 12, // Size for subheadings
                bold: true, // Make subheadings bold
                margin: [0, 10, 0, 5] // Margins for subheadings
            }
        };
        this.docDefinition.content = [
            {
                stack: details,
                margin: margin || [0, 20, 0, 20] // Use provided margin or default value
            }
        ];

        return this;
    }


}

export { PdfMaker };
