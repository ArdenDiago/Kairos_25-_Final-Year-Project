
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

type Photo = {
  id: string;
  url: string;
  text?: string;
};

interface PhotoEditorProps {
  photo: Photo;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, onSave, onCancel }) => {
  const [text, setText] = useState(photo.text || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    onSave(photo.id, text);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="relative">
        <img 
          src={photo.url} 
          alt="Editing" 
          className="max-h-[60vh] max-w-full rounded-md" 
        />
        {text && (
          <div className="absolute bottom-4 left-0 w-full text-center">
            <div className="inline-block px-4 py-2 bg-black/60 rounded text-psycho-accent psycho-text-glow font-bold text-xl">
              {text}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="photo-text" className="text-psycho-foreground font-semibold">
          Add Text to Photo
        </label>
        <Input
          id="photo-text"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter text to display on the photo..."
          className="bg-psycho border-psycho-border text-psycho-foreground"
          maxLength={40}
        />
        <p className="text-sm text-gray-400">
          {40 - text.length} characters remaining
        </p>
      </div>
      
      <div className="flex justify-end gap-2 mt-2">
        <Button 
          onClick={onCancel} 
          variant="outline" 
          className="border-psycho-border text-psycho-foreground hover:bg-psycho-muted"
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          className="bg-psycho-accent hover:bg-psycho-highlight text-black font-bold"
        >
          <Check className="mr-2 h-4 w-4" /> Save Text
        </Button>
      </div>
    </div>
  );
};

export default PhotoEditor;
