import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Image, Check, X, Type } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PhotoFrame from "./PhotoFrame";
import PhotoEditor from "./PhotoEditor";
import { emitPhotoUpload, setupSocketListeners } from '../../../server/WebSockets/photoBooth.js';

type Photo = {
  id: string;
  url: string;
  text?: string;
};

const PhotoBooth: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const cleanup = setupSocketListeners(setPhotos);
    return () => cleanup(); // remove listener on unmount
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: Photo[] = [];

    Array.from(files).forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      const newPhoto: Photo = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: fileUrl
      };
      newPhotos.push(newPhoto);
      emitPhotoUpload(newPhoto); // WebSocket emit
    });

    setPhotos(prev => [...prev, ...newPhotos]);

    toast({
      title: "Photos Uploaded",
      description: `${newPhotos.length} photo(s) added to your collage`,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoView = () => {
    setSelectedPhoto(null);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const savePhotoWithText = (id: string, text: string) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === id ? { ...photo, text } : photo
      )
    );
    setIsEditing(false);

    toast({
      title: "Text Added",
      description: "Your message has been added to the photo",
    });
  };

  const placeholderImages = [
    {
      id: 'placeholder-1',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
      text: 'Psycho-Pass'
    },
    {
      id: 'placeholder-2',
      url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
      text: 'Sibyl System'
    },
    {
      id: 'placeholder-3',
      url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      text: 'Dominator'
    }
  ];

  const displayedPhotos = photos.length > 0 ? photos : placeholderImages;

  const renderDynamicPhotoGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedPhotos.map((photo) => (
          <div key={photo.id} className="w-full h-auto">
            <PhotoFrame
              photo={photo}
              onClick={() => handlePhotoClick(photo)}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 psycho-text-glow">
          Psycho-Pass Photo Booth
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Upload photos to create your cyberpunk collage
        </p>

        <div className="flex gap-4 mb-8 ">
          <Button
            onClick={triggerFileInput}
            className="bg-psycho-accent hover:bg-psycho-highlight bg-white text-black font-bold animate-pulse-glow"
          >
            <Upload className="mr-2 h-5 w-5" /> Upload Photos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-psycho-muted p-6 rounded-lg psycho-border-glow">
        {displayedPhotos.length > 0 ? (
          <div className="photo-container">{renderDynamicPhotoGrid()}</div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <Image className="h-16 w-16 mb-4 text-psycho-accent" />
            <p className="text-xl text-gray-400">
              No photos yet. Upload some to get started.
            </p>
          </div>
        )}
      </div>

      {/* Photo Viewer Dialog */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => closePhotoView()}>
          <DialogContent className="bg-psycho-muted border border-psycho-border max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-psycho-foreground flex justify-between items-center">
                <span>Photo Viewer</span>
                <div className="flex gap-2">
                  {!isEditing && (
                    <Button
                      onClick={startEditing}
                      variant="outline"
                      className="border-psycho-accent text-psycho-accent hover:bg-psycho-accent hover:text-black"
                    >
                      <Type className="mr-2 h-4 w-4" /> Add Text
                    </Button>
                  )}
                  <Button
                    onClick={closePhotoView}
                    variant="outline"
                    className="border-psycho-border text-psycho-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            {isEditing ? (
              <PhotoEditor
                photo={selectedPhoto}
                onSave={savePhotoWithText}
                onCancel={cancelEditing}
              />
            ) : (
              <div className="p-2 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={selectedPhoto.url}
                    alt="Selected"
                    className="max-h-[70vh] max-w-full rounded-md"
                  />
                  {selectedPhoto.text && (
                    <div className="absolute bottom-4 left-0 w-full text-center">
                      <div className="inline-block px-4 py-2 bg-black/60 rounded text-psycho-accent psycho-text-glow font-bold text-xl">
                        {selectedPhoto.text}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PhotoBooth;
