# Release Summary

## Commit
- Hash: 1ab175a
- Title: Migrate data layer to Firebase and add MSME trust metadata
- Branch: main
- Remote: origin/main

## Highlights
- Migrated the primary backend data path to Firebase Firestore.
- Kept Blob storage as fallback when Firebase credentials are not configured.
- Added MSME/Udyam trust information to About content and search-facing metadata.
- Added certificate accessibility through public assets for user trust and verification.

## Functional Changes
- Firestore integration helper added:
  - lib/firebaseStore.ts
- Storage and data access layer updated:
  - lib/DdSQL.ts
  - lib/customerAccountsStore.ts
  - lib/customerAuth.ts
  - app/api/admin/users/route.ts
- Existing API routes continue using the same DdSQL-oriented interfaces, now backed by Firestore-first behavior.

## SEO and Trust Changes
- About page content now includes legal business and MSME registration details:
  - components/About.tsx
- About page metadata updated for search engines:
  - app/about/page.tsx
- Structured data expanded with legal and registration identifiers:
  - components/StructuredData.tsx
- Certificate published as a public file:
  - public/certificates/DD-IOT-SOLUTION-GOVT-CERTIFICATE.pdf

## Configuration and Dependency Changes
- Added Firebase Admin SDK dependency:
  - package.json
  - package-lock.json
- Removed direct Neon dependency from runtime path.
- Updated environment example with Firebase variables:
  - .env.example

## Notes
- Firebase is the primary database path only when Firebase service account variables are configured.
- Blob fallback remains available for resilience when Firebase is not configured.
- Production build was validated successfully after these changes.
