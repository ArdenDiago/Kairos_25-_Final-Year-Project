
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-psycho">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6 psycho-text-glow">Psycho-Pass Photo Booth</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Create dark-themed cyberpunk collages with your photos and text overlays
        </p>
        <Link to="/PhotoBooth/photobooth">
          <Button className="bg-psycho-accent hover:bg-psycho-highlight text-black font-bold text-lg py-6 px-8 animate-pulse-glow">
            <Camera className="mr-2 h-6 w-6" /> Enter Photo Booth
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
