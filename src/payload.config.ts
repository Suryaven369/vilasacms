// Import necessary Payload modules and collections
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig, PayloadRequest } from 'payload'; // PayloadRequest might not be directly needed here unless used elsewhere
import { postgresAdapter } from '@payloadcms/db-postgres';
import sharp from 'sharp'; // sharp-import remains for local image processing

// ===== REMOVED CLOUD STORAGE IMPORTS =====
// import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'; // No longer needed
// import { s3Storage } from '@payloadcms/storage-s3'; // No longer needed
// =========================================

// Your Collections and Globals
import { Categories } from './collections/Categories';
import { Media } from './collections/Media'; // Ensure Media is imported correctly
import { Services } from './collections/Services';
import { Testimonials } from './collections/Testimonials';
import Portfolio from './collections/Portfolio';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Footer } from './Footer/config';
import { Header } from './Header/config';

// Your other imports and utilities
import { plugins as otherPluginsFromExternalFile } from './plugins'; // Renamed variable
import { defaultLexical } from '@/fields/defaultLexical';
import { getServerSideURL } from './utilities/getURL';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// ===== REMOVED S3 STORAGE CONFIGURATION FOR SUPABASE =====
// const s3Config = { ... }; // No longer needed
// ======================================================

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    // livePreview: { /* ... */ }, // Ensure this is configured if needed
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI, // Ensure this environment variable is set
    },
  }),
  collections: [
    Pages,
    Posts,
    Media, // Media collection remains
    Categories,
    Users,
    Services,
    Testimonials,
    Portfolio
  ],
  cors: [getServerSideURL(), 'http://localhost:3000'].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    // Include your other plugins
    ...otherPluginsFromExternalFile,

    // ===== REMOVED THE S3 STORAGE PLUGIN =====
    // s3Storage({ ... }), // Removed this entire block
    // ========================================
  ],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-please-change', // Ensure a strong secret is set
  sharp, // Keep sharp for local image processing
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'), // Example configuration
  },
  // graphQL: { // Add if needed
  //   schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  // },
  // jobs: { // Add if needed
  //   tasks: [],
  // },
});
