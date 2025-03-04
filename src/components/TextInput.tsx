
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Trash } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from './FileUpload';

interface TextInputProps {
  onTextChange: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextChange }) => {
  const [inputText, setInputText] = useState<string>('');
  
  useEffect(() => {
    // Debounce the text change to avoid excessive processing
    const timer = setTimeout(() => {
      onTextChange(inputText);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputText, onTextChange]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  const handleClear = () => {
    setInputText('');
    toast.info('Input cleared');
  };
  
  const handleCopy = () => {
    if (!inputText) {
      toast.warning('Nothing to copy');
      return;
    }
    
    navigator.clipboard.writeText(inputText)
      .then(() => toast.success('Text copied to clipboard'))
      .catch(() => toast.error('Failed to copy text'));
  };
  
  const handleFileLoad = (text: string) => {
    setInputText(text);
  };
  
  return (
    <Card className="w-full overflow-hidden animate-fade-up shadow-sm border glass-panel" style={{ animationDelay: '300ms' }}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Source Text</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!inputText}
                title="Copy to clipboard"
                className="transition-soft"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClear}
                disabled={!inputText}
                title="Clear input"
                className="transition-soft"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Textarea
            placeholder="Paste your formatted text here..."
            className="min-h-[200px] resize-y border"
            value={inputText}
            onChange={handleTextChange}
          />
          
          <div className="text-xs text-muted-foreground">
            {inputText ? `${inputText.length} characters` : 'Paste text or upload a file'}
          </div>
          
          <FileUpload onTextLoad={handleFileLoad} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TextInput;
