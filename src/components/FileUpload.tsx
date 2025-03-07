
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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processFile = async (file: File) => {
    if (!file) return;
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB');
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(0);
    
    // Simulating progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        return Math.min(prev + 5, 90);
      });
    }, 100);
    
    try {
      console.log(`Processing file: ${file.name} (${file.type})`);
      
      // If it's a PDF, show specific toast
      if (file.type === 'application/pdf') {
        toast.info('Processing PDF file, this may take a moment...');
      }
      
      const text = await readFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add a small delay to show 100% before completion
      setTimeout(() => {
        onTextLoad(text);
        setIsLoading(false);
        setUploadProgress(null);
        toast.success(`${file.name} loaded successfully`);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error reading file:', error);
      
      // Show more helpful error message
      let errorMessage = 'Failed to read file';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // For PDF files, provide a more specific fallback suggestion
      if (file.type === 'application/pdf') {
        toast.error(errorMessage);
        toast.info('Consider converting your PDF to text format or try copying/pasting the content directly');
      } else {
        toast.error(errorMessage);
      }
      
      setIsLoading(false);
      setUploadProgress(null);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await processFile(files[0]);
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
    await processFile(files[0]);
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
          : isLoading
            ? 'border-primary/50 bg-muted/30'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={isLoading ? undefined : handleClick}
      style={{ animationDelay: '400ms' }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".txt,.rtf,.doc,.docx,.html,.md,.pdf"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      {uploadProgress !== null && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="absolute mt-6 text-xs text-muted-foreground">
            Processing file... {uploadProgress}%
          </span>
        </div>
      )}
      
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
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {isLoading ? 'Processing...' : 'Select File'}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
