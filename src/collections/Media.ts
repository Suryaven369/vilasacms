import path from 'path';
import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true, // Adjust access control as needed
  },
  upload: {
    // --- Vercel /tmp Configuration ---
    staticDir: path.resolve('/tmp'), // Save files to Vercel's writable /tmp directory
    // staticURL: '/media', // Keep the URL path the same if desired
    // --- End Vercel Configuration ---

    imageSizes: [ // Example image sizes using sharp
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'], // Allow images and PDFs
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    // Add other fields if needed
  ],
};

// Ensure 'path' is imported at the top:
// import path from 'path';
