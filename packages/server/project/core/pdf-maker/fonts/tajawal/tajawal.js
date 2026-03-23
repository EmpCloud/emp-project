import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Tajawal = {
    normal: path.join(__dirname, 'Tajawal-Regular.ttf'),
    bold: path.join(__dirname, 'Tajawal-Bold.ttf'),
    italics: path.join(__dirname, 'Tajawal-Ligth.ttf'),
    bolditalics: path.join(__dirname, 'Roboto-ExtraBold.ttf')
};

export { Tajawal };
