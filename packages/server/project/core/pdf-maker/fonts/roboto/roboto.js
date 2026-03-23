import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Roboto = {
    normal: path.join(__dirname, 'Roboto-Regular.ttf'),
    bold: path.join(__dirname, 'Roboto-Medium.ttf'),
    italics: path.join(__dirname, 'Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, 'Roboto-MediumItalic.ttf')
};

export { Roboto };
