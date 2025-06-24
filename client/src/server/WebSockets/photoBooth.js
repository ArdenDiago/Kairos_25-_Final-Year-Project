import URL from '../serverURL_link';
import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io(URL, {
    transports: ['websocket'],
    withCredentials: true,
});

// Set up listeners for incoming socket events
export const setupSocketListeners = (setPhotos) => {
    const handlePhotoAdd = (photo) => {
        setPhotos((prev) => [...prev, photo]);
    };

    socket.on('photo-added', (photo) => {
        // Assuming photo.base64 contains the base64 string for the image
        const img = document.createElement('img');
        img.src = photo.base64;
        document.body.appendChild(img); // or append to some container
    });

    // Cleanup function to remove the listener
    return () => {
        socket.off('photo-added', handlePhotoAdd);
    };
};

// Helper function to convert File or Blob to base64
const toBase64 = (fileOrBlob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileOrBlob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

// Emit a new photo to the server with base64 conversion
export const emitPhotoUpload = async (photo) => {
    // photo could be a File object, Blob, or an object with URL
    let base64Data = null;

    if (photo instanceof File || photo instanceof Blob) {
        // Direct file/blob, convert to base64
        base64Data = await toBase64(photo);
    } else if (photo.url && photo.url.startsWith('blob:')) {
        // If you have a blob URL, fetch the blob and convert
        const response = await fetch(photo.url);
        const blob = await response.blob();
        base64Data = await toBase64(blob);
    } else if (photo.base64) {
        // Already base64, just use it
        base64Data = photo.base64;
    } else {
        console.error('Unsupported photo format:', photo);
        return;
    }

    // Build the payload with base64 string and any extra info
    const payload = {
        id: photo.id || null,
        base64: base64Data,
        name: photo.name || 'unknown.jpg', // or generate a name
        text: photo.text || '',
    };

    socket.emit('upload-photo', payload);
};
