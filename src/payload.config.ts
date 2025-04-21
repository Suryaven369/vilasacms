// payload.config.ts

// Import necessary Payload modules and collections
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import sharp from 'sharp';

// ===== VERCEL BLOB STORAGE IMPORT =====
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
// =====================================

// Your Collections and Globals
import { Categories } from './collections/Categories';
import { Media } from './collections/Media'; // Ensure Media collection slug is 'media' or update below
import { Services } from './collections/Services';
import { Testimonials } from './collections/Testimonials';
import Portfolio from './collections/Portfolio';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Footer } from './Footer/config';
import { Header } from './Header/config';

// Your other imports and utilities
import { plugins as otherPluginsFromExternalFile } from './plugins'; // Example of external plugins
import { defaultLexical } from '@/fields/defaultLexical'; // Example editor
import { getServerSideURL } from './utilities/getURL'; // Ensure this utility is correct

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'], // Example custom components
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: { // Example import map
      baseDir: path.resolve(dirname),
    },
    user: Users.slug, // Uses the 'users' collection for authentication
    // livePreview: { /* ... */ }, // Configure if needed
  },
  editor: defaultLexical, // Your rich text editor configuration
  db: postgresAdapter({ // Database configuration
    pool: {
      connectionString: process.env.DATABASE_URI, // Ensure DATABASE_URI is set in .env
    },
  }),
  collections: [ // Your Payload collections
    Pages,
    Posts,
    Media, // Media collection using Vercel Blob
    Categories,
    Users,
    Services,
    Testimonials,
    Portfolio,
  ],
  cors: [ // Configure Cross-Origin Resource Sharing
     getServerSideURL(), // Get server URL dynamically
     'http://localhost:3000', // Allow local frontend dev server (adjust port if needed)
  ].filter(Boolean),
  globals: [ // Your Payload globals
    Header,
    Footer,
  ],
  plugins: [ // Payload plugins
    // Include your other plugins from the external file if any
    ...otherPluginsFromExternalFile,

    // ===== VERCEL BLOB STORAGE PLUGIN =====
    vercelBlobStorage({
      collections: {
        [Media.slug]: true
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // ===============================================
  ],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-dev-only', // IMPORTANT: Set a strong PAYLOAD_SECRET in .env
  sharp, // Required for image processing
  typescript: { // Generates TypeScript types for your config
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // jobs: { // Configure background jobs if needed
  //  tasks: [],
  // },
});
