// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';

import sharp from 'sharp'; // sharp-import
import path from 'path';
import { buildConfig, PayloadRequest } from 'payload';
import { fileURLToPath } from 'url';

import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Services } from './collections/Services';
import { Testimonials } from './collections/Testimonials';
import Portfolio from './collections/Portfolio';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Footer } from './Footer/config';
import { Header } from './Header/config';
import { plugins } from './plugins';
import { defaultLexical } from '@/fields/defaultLexical';
import { getServerSideURL } from './utilities/getURL';

// Import cloud storage plugin and S3 adapter
// import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// --- Add checks for ALL required S3 variables ---
const S3Bucket = process.env.S3_BUCKET;
const S3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
const S3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const S3Region = process.env.S3_REGION;
const S3Endpoint = process.env.S3_ENDPOINT; // Keep this if you use a custom endpoint

// Validate required variables
if (!S3Bucket) {
  throw new Error("Required environment variable S3_BUCKET is missing.");
}
if (!S3AccessKeyId) {
  throw new Error("Required environment variable S3_ACCESS_KEY_ID is missing.");
}
if (!S3SecretAccessKey) {
  throw new Error("Required environment variable S3_SECRET_ACCESS_KEY is missing.");
}
if (!S3Region) {
  throw new Error("Required environment variable S3_REGION is missing.");
}
// Add this check if you require a custom endpoint (like MinIO, etc.)
// if (!s3Endpoint) {
//   throw new Error("Required environment variable S3_ENDPOINT is missing.");
// }
// --- End of checks ---


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
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Services, Testimonials, Portfolio],
  cors: ["https://viilasa.com", "https://viilasasite.vercel.app"],
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        }
      },
      bucket: S3Bucket, // Use validated variable
      config: {
        forcePathStyle: true, // Example property
        credentials: {
          // Use validated variables here
          accessKeyId: S3AccessKeyId,
          secretAccessKey: S3SecretAccessKey,
        },
        // Use validated variable here
        region: S3Region,
        // Use validated variable here (if needed)
        endpoint: S3Endpoint,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true;
        const authHeader = req.headers.get('authorization');
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
});
