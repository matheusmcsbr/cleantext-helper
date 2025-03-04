
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';
import { downloadFile } from '@/utils/fileHandling';
import { wordCount, charCount } from '@/utils/textProcessing';

interface TextOutputProps {
  text: string;
}

const TextOutput: React.FC<TextOutputProps> = ({ text }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [fileType, setFileType] = useState<'txt' | 'rtf' | 'doc' | 'docx'>('txt');
  const [fileName, setFileName] = useState('cleantext');
  
  // Update edited text when the input text changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditedText(text);
    }
  }, [text, isEditing]);
  
  const handleCopy = () => {
    if (!editedText) {
      toast.warning('Nothing to copy');
      return;
    }
    
    navigator.clipboard.writeText(editedText)
      .then(() => toast.success('Text copied to clipboard'))
      .catch(() => toast.error('Failed to copy text'));
  };
  
  const handleDownload = () => {
    if (!editedText) {
      toast.warning('Nothing to download');
      return;
    }
    
    downloadFile(editedText, fileName, fileType);
    toast.success(`Downloaded as ${fileName}.${fileType}`);
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      toast.success('Changes saved');
    }
    setIsEditing(!isEditing);
  };
  
  return (
    <Card className="w-full overflow-hidden animate-fade-up shadow-sm border glass-panel" style={{ animationDelay: '400ms' }}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Clean Text</h2>
            <div className="flex space-x-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="icon"
                onClick={toggleEdit}
                disabled={!text}
                title={isEditing ? "Save edits" : "Edit text"}
                className="transition-soft"
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!editedText}
                title="Copy to clipboard"
                className="transition-soft"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Textarea
            className="min-h-[200px] resize-y border"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            readOnly={!isEditing}
            placeholder="Clean text will appear here..."
          />
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {editedText ? `${wordCount(editedText)} words, ${charCount(editedText)} characters` : 'No content yet'}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="h-8 px-2 text-sm border rounded w-28"
                  placeholder="Filename"
                />
                <Select
                  value={fileType}
                  onValueChange={(value) => setFileType(value as any)}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="rtf">RTF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                size="sm"
                onClick={handleDownload}
                disabled={!editedText}
                className="transition-soft"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextOutput;
