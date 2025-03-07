import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
// We need to handle environments that might have issues with workers
const workerUrl = new URL('/pdf.worker.min.js', window.location.origin).href;
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Reads a file and returns its text content
 */
export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For PDF files, use the PDF.js library
    if (file.type === 'application/pdf') {
      return readPdfFile(file)
        .then(resolve)
        .catch(error => {
          console.error('Error reading PDF:', error);
          reject(new Error(`Failed to read PDF file: ${error.message || 'Unknown error'}`));
        });
    }
    
    // For other files, use the FileReader
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = (event) => {
      console.error('File reading error:', event);
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Reads a PDF file and returns its text content
 */
const readPdfFile = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF reading process');
    
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to ArrayBuffer');
    
    // Use a try-catch block specifically for worker issues
    try {
      // First attempt: Try with standard configuration
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
        cMapPacked: true,
      });
      
      console.log('PDF loading task created with standard configuration');
      const pdf = await loadingTask.promise;
      console.log('PDF document loaded successfully with standard approach');
      
      return extractTextFromPdf(pdf);
    } catch (workerError) {
      console.error('Error with standard PDF loading, trying workaround:', workerError);
      
      // If we got a worker-related error, try an alternative approach
      if (String(workerError).includes('importScripts') || 
          String(workerError).includes('worker')) {
        
        console.log('Worker issue detected, using alternative approach');
        
        // Reset the worker source to null as a workaround
        // @ts-ignore - Intentionally bypass type checking for this workaround
        pdfjs.GlobalWorkerOptions.workerSrc = null;
        
        // Create a new loading task with the workaround
        const fallbackLoadingTask = pdfjs.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });
        
        console.log('Attempting fallback PDF loading approach');
        const pdf = await fallbackLoadingTask.promise;
        console.log('PDF document loaded with fallback approach');
        
        return extractTextFromPdf(pdf);
      } else {
        // It's not a worker issue, so rethrow
        throw workerError;
      }
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    
    // Provide a more user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If we get a specific error about workers or other known issues, provide a clearer message
    if (String(error).includes('importScripts') || String(error).includes('worker')) {
      throw new Error('Browser compatibility issue with PDF processing. Try a different file format.');
    }
    
    throw error;
  }
};

/**
 * Extract text content from a PDF document
 */
const extractTextFromPdf = async (pdf: pdfjs.PDFDocumentProxy): Promise<string> => {
  console.log('PDF document loaded, pages:', pdf.numPages);
  
  // Extract text from each page
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Join all the text items from the page
    const pageText = textContent.items
      .map(item => 'str' in item ? item.str : '')
      .join(' ');
    
    fullText += pageText + '\n\n';
    console.log(`Processed page ${i}/${pdf.numPages}`);
  }
  
  console.log('PDF text extraction complete');
  return fullText || 'No text content found in the PDF';
};

/**
 * Converts HTML content to rich text format for RTF files
 */
const htmlToRtf = (html: string): string => {
  // This is a simplified RTF conversion - real conversion would be more complex
  const rtf = `{\\rtf1\\ansi\\ansicpg1252\\cocoartf2580
\\cocoatextscaling0\\cocoaplatform0{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}
{\\colortbl;\\red255\\green255\\blue255;}
{\\*\\expandedcolortbl;;}
\\margl1440\\margr1440\\vieww11520\\viewh8400\\viewkind0
\\pard\\tx720\\tx1440\\tx2160\\tx2880\\tx3600\\tx4320\\tx5040\\tx5760\\tx6480\\tx7200\\tx7920\\tx8640\\pardirnatural\\partightenfactor0

\\f0\\fs24 \\cf0 ${html.replace(/\n/g, '\\\\par ')}}`;
  
  return rtf;
};

/**
 * Creates and downloads a file with the given content and type
 */
export const downloadFile = (content: string, filename: string, type: 'txt' | 'rtf' | 'doc' | 'docx'): void => {
  let mimeType = 'text/plain';
  let fileContent = content;
  let fileExtension = type;
  
  // Set the appropriate MIME type and content
  switch (type) {
    case 'rtf':
      mimeType = 'application/rtf';
      fileContent = htmlToRtf(content);
      break;
    case 'doc':
      mimeType = 'application/msword';
      fileContent = htmlToRtf(content);
      break;
    case 'docx':
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      // For simplicity, we're using RTF for docx as well
      // Real docx creation would require a more complex library
      fileContent = htmlToRtf(content);
      break;
    default:
      // Plain text, use defaults
      break;
  }

  // Create a Blob with the content
  const blob = new Blob([fileContent], { type: mimeType });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${fileExtension}`;
  
  // Append the link to the body, click it, and then remove it
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
