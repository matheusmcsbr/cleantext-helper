
/**
 * Reads a file and returns its text content
 */
export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
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
