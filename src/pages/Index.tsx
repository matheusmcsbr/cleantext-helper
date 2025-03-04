
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';
import TextOutput from '@/components/TextOutput';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cleanText } from '@/utils/textProcessing';

const Index: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');

  useEffect(() => {
    // Process text when input changes
    setOutputText(cleanText(inputText));
  }, [inputText]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container py-6 md:py-12 space-y-10">
          <Header />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TextInput onTextChange={setInputText} />
            <TextOutput text={outputText} />
          </div>

          <div className="pt-4">
            <Card className="overflow-hidden shadow-sm border glass-panel animate-fade-up" style={{ animationDelay: '500ms' }}>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">About CleanText</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  CleanText helps you convert formatted text into clean, plain paragraphs. Simply paste your text or upload a file to get started.
                </p>

                <h3 className="text-sm font-medium mt-4 mb-2">Features</h3>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Paste or upload formatted text from various sources</li>
                  <li>Automatically removes formatting, preserving only paragraphs</li>
                  <li>Edit the cleaned text if needed</li>
                  <li>Download as TXT, RTF, DOC, or DOCX</li>
                  <li>Copy text directly to clipboard</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between py-4 md:h-16 gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CleanText. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-muted-foreground">
              Designed with simplicity in mind
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
