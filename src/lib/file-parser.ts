import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
// Initialize PDF.js worker only if it hasn't been set
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}
export async function extractTextFromFile(file: File): Promise<string> {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File is too large. Maximum size is 5MB.');
  }
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'txt':
      return await readTextFile(file);
    case 'docx':
      return await readDocxFile(file);
    case 'pdf':
      return await readPdfFile(file);
    default:
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  }
}
async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}
async function readDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse Word document.');
  }
}
async function readPdfFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item: any) => item.str || '')
        .filter(Boolean);
      if (strings.length > 0) {
        fullText += strings.join(' ') + '\n';
      }
    }
    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Could not read PDF. It might be corrupted or password-protected.');
  }
}