
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readFile } from '@/utils/fileHandling';
import { toast } from 'sonner';

interface FileUploadProps {
  onTextLoad: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTextLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const text = await readFile(files[0]);
      onTextLoad(text);
      toast.success('File loaded successfully');
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    try {
      const text = await readFile(files[0]);
      onTextLoad(text);
      toast.success('File loaded successfully');
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file');
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full p-6 mt-4 border-2 border-dashed rounded-lg transition-soft animate-scale-in ${
        isDragging 
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ animationDelay: '400ms' }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".txt,.rtf,.doc,.docx,.html,.md,.pdf"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="p-3 rounded-full bg-secondary">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Upload a file or drag and drop</p>
          <p className="text-xs text-muted-foreground">TXT, RTF, DOC, DOCX, HTML, MD, PDF up to 10MB</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Select File
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
