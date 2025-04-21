// collections/Media.ts

// Removed 'path' import as it's no longer used after removing staticDir
// import path from 'path';
import { CollectionConfig } from 'payload'; // Corrected import source

export const Media: CollectionConfig = {
  slug: 'media', // Ensure this matches the slug used in payload.config.ts plugins
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true, // Adjust access control as needed for your application
  },
  upload: {
    // --- REMOVED LOCAL/TMP STORAGE CONFIG ---
    // staticDir: path.resolve('/tmp'), //  <--- REMOVED THIS LINE
    // staticURL: '/media',             //  <--- REMOVED THIS LINE (or keep commented)
    // The cloud storage plugin handles storage location now.
    // --- End Removal ---

    // Image processing settings remain relevant:
    // Sharp (configured in payload.config.ts) will process these sizes
    // before the plugin uploads them to Vercel Blob.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail', // Uses the 'thumbnail' size in the admin UI
    mimeTypes: ['image/*', 'application/pdf'], // Allowed file types
  },
  fields: [ // Fields for metadata associated with the media
    {
      name: 'alt', // Alt text is crucial for accessibility
      label: 'Alt Text',
      type: 'text',
      required: true,
    },
    // Add other fields if you need more metadata (e.g., caption)
    // {
    //   name: 'caption',
    //   label: 'Caption',
    //   type: 'text',
    // }
  ],
};
