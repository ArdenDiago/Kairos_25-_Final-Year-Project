
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type Photo = {
  id: string;
  url: string;
  text?: string;
};

interface PhotoFrameProps {
  photo: Photo;
  onClick: () => void;
  className?: string;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ photo, onClick, className }) => {
  return (
    <div className="relative group">
      <img 
        src={photo.url}
        alt={photo.text || "Photo"}
        className={`transition-transform duration-300 ease-in-out ${className} group-hover:scale-[1.02]`}
      />
      
      {photo.text && (
        <div className="absolute bottom-2 left-0 w-full text-center">
          <div className="inline-block px-2 py-1 bg-black/60 rounded text-psycho-accent psycho-text-glow">
            {photo.text}
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button 
          onClick={onClick} 
          className="bg-psycho-accent hover:bg-psycho-highlight text-black font-bold transform scale-90 group-hover:scale-100 transition-transform duration-300"
        >
          <Eye className="mr-2 h-4 w-4" /> View
        </Button>
      </div>
      
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-psycho-accent transition-colors duration-300 rounded-md"></div>
    </div>
  );
};

export default PhotoFrame;
