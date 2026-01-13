# Backend Development Prompt for Stundea Studio

## Project Overview
Build a RESTful Express.js backend API server for **Stundea Studio** - a wedding invitation platform where users can create, customize, and publish digital wedding invitations. The backend will use **Supabase** (PostgreSQL) as the database and **Supabase Storage** for image management.

---

## Tech Stack Requirements

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **ORM/Query Builder**: Supabase JS Client or direct PostgreSQL queries
- **Authentication**: Supabase Auth (JWT tokens)
- **File Storage**: Supabase Storage
- **Environment Variables**: dotenv
- **Validation**: express-validator or zod
- **CORS**: Enable CORS for Next.js frontend
- **Error Handling**: Custom error middleware

---

## Database Schema (Supabase)

### 1. Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'individual', -- 'individual', 'pro', 'enterprise'
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. Templates Table
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'modern', 'classic', 'romantic', 'minimalist', 'elegant', 'rustic'
  description TEXT,
  preview_image_url TEXT,
  thumbnail_url TEXT,
  template_data JSONB NOT NULL, -- Full template structure
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_active ON templates(is_active);
CREATE INDEX idx_templates_slug ON templates(slug);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT
  USING (is_active = true);
```

**Template JSON Structure** (stored in `template_data`):
```json
{
  "type": "single-page",
  "sections": [
    {
      "id": "hero-image",
      "type": "image",
      "defaultImage": "/templates/defaults/hero.jpg",
      "editable": true,
      "position": { "x": 0, "y": 0, "width": "100%", "height": "400px" }
    },
    {
      "id": "title-section",
      "type": "text",
      "defaultText": "Kami Mengundang Anda",
      "editable": true,
      "font": { "family": "Playfair Display", "size": 48, "color": "#2d2d2d", "weight": "bold" },
      "position": { "x": 0, "y": 400, "width": "100%", "height": "auto" }
    },
    {
      "id": "couple-names",
      "type": "text",
      "defaultText": "John & Jane",
      "editable": true,
      "font": { "family": "Playfair Display", "size": 36, "color": "#c9a87c" },
      "position": { "x": 0, "y": 480, "width": "100%", "height": "auto" }
    },
    {
      "id": "gallery-carousel",
      "type": "carousel",
      "images": [
        {
          "id": "carousel-img-1",
          "defaultImage": "/templates/defaults/gallery1.jpg",
          "editable": true,
          "order": 1
        }
      ],
      "position": { "x": 0, "y": 600, "width": "100%", "height": "300px" }
    }
  ],
  "metadata": {
    "version": "1.0",
    "responsive": true,
    "defaultColors": {
      "primary": "#2d2d2d",
      "accent": "#c9a87c",
      "background": "#fafafa"
    }
  }
}
```

### 3. Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  project_data JSONB NOT NULL, -- User's customizations
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_template_id ON projects(template_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Published projects are public"
  ON projects FOR SELECT
  USING (status = 'published' AND is_active = true);
```

**Project Data Structure** (stored in `project_data`):
```json
{
  "templateId": "uuid-of-template",
  "sections": [
    {
      "id": "hero-image",
      "type": "image",
      "imageUrl": "https://supabase.co/storage/.../user-uploaded-hero.jpg",
      "position": { "x": 0, "y": 0, "width": "100%", "height": "400px" }
    },
    {
      "id": "title-section",
      "type": "text",
      "text": "Kami Mengundang Anda",
      "font": { "family": "Playfair Display", "size": 48, "color": "#2d2d2d" },
      "position": { "x": 0, "y": 400, "width": "100%", "height": "auto" }
    }
  ],
  "customizations": {
    "colors": { "primary": "#2d2d2d", "accent": "#c9a87c" },
    "music": { "enabled": true, "url": "https://..." }
  }
}
```

### 4. Images Table
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  storage_bucket TEXT NOT NULL DEFAULT 'invitation-images',
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(storage_path)
);

CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_project_id ON images(project_id);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own images"
  ON images FOR ALL
  USING (auth.uid() = user_id);
```

### 5. Guests Table (Future Feature)
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT DEFAULT 'pending',
  rsvp_responded_at TIMESTAMPTZ,
  number_of_guests INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guests_project_id ON guests(project_id);
CREATE INDEX idx_guests_rsvp_status ON guests(rsvp_status);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can manage guests"
  ON guests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = guests.project_id
      AND projects.user_id = auth.uid()
    )
  );
```

---

## Supabase Storage Buckets

Create these buckets in Supabase Storage:

1. **`template-previews`** (public)
   - Template preview/thumbnail images
   - Public read access

2. **`template-assets`** (public)
   - Default template images
   - Public read access

3. **`invitation-images`** (private)
   - User-uploaded images
   - Authenticated users can upload
   - Users can only access their own images

4. **`published-invitations`** (public)
   - Optimized images for published invitations
   - Public read access

---

## API Endpoints Specification

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user (creates profile in Supabase)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

#### `POST /api/auth/login`
Login user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

#### `GET /api/auth/me`
Get current authenticated user profile

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "subscriptionTier": "individual",
    "subscriptionExpiresAt": "2025-01-15T00:00:00Z"
  }
}
```

#### `POST /api/auth/refresh`
Refresh access token

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

---

### Templates Endpoints

#### `GET /api/templates`
Get all active templates (with optional filters)

**Query Parameters:**
- `category` (optional): Filter by category
- `isPremium` (optional): Filter premium templates
- `limit` (optional): Limit results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "uuid",
        "name": "Modern Elegant",
        "slug": "modern-elegant-001",
        "category": "modern",
        "description": "...",
        "previewImageUrl": "https://...",
        "thumbnailUrl": "https://...",
        "isPremium": false,
        "templateData": { ... }
      }
    ],
    "total": 10,
    "limit": 50,
    "offset": 0
  }
}
```

#### `GET /api/templates/:id`
Get single template by ID or slug

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Modern Elegant",
    "slug": "modern-elegant-001",
    "category": "modern",
    "description": "...",
    "previewImageUrl": "https://...",
    "templateData": { ... }
  }
}
```

---

### Projects Endpoints

#### `GET /api/projects`
Get user's projects (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status ('draft', 'published', 'archived')
- `limit` (optional): Limit results
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "My Wedding Invitation",
        "slug": "my-wedding-invitation",
        "templateId": "uuid",
        "templateName": "Modern Elegant",
        "status": "draft",
        "isActive": true,
        "viewCount": 0,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

#### `POST /api/projects`
Create new project (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "templateId": "uuid-of-template",
  "name": "My Wedding Invitation",
  "slug": "my-wedding-invitation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Wedding Invitation",
    "slug": "my-wedding-invitation",
    "templateId": "uuid",
    "status": "draft",
    "projectData": { ... },
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### `GET /api/projects/:id`
Get project by ID (requires authentication or public if published)

**Headers:**
```
Authorization: Bearer <access_token> (optional for published projects)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Wedding Invitation",
    "slug": "my-wedding-invitation",
    "templateId": "uuid",
    "status": "draft",
    "projectData": { ... },
    "viewCount": 0,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### `PUT /api/projects/:id`
Update project (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "projectData": { ... },
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "projectData": { ... },
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### `DELETE /api/projects/:id`
Delete project (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

#### `POST /api/projects/:id/publish`
Publish project (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "expiresAt": "2024-12-31T23:59:59Z" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "published",
    "publishedAt": "2024-01-15T12:00:00Z",
    "publicUrl": "https://stundeastudio.com/invitation/my-wedding-invitation"
  }
}
```

#### `GET /api/projects/:slug/public`
Get published project by slug (public, no auth required)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Wedding Invitation",
    "slug": "my-wedding-invitation",
    "projectData": { ... },
    "viewCount": 150
  }
}
```

---

### Images Endpoints

#### `POST /api/images/upload`
Upload image (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file
- `projectId` (optional): Link to project
- `altText` (optional): Alt text for image

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "storagePath": "invitation-images/user-uuid/image-123.jpg",
    "url": "https://supabase.co/storage/v1/object/public/invitation-images/...",
    "fileName": "image-123.jpg",
    "fileSize": 1024000,
    "width": 1920,
    "height": 1080,
    "mimeType": "image/jpeg"
  }
}
```

#### `GET /api/images`
Get user's images (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `projectId` (optional): Filter by project
- `limit` (optional): Limit results
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "uuid",
        "url": "https://...",
        "fileName": "image-123.jpg",
        "fileSize": 1024000,
        "width": 1920,
        "height": 1080,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 10
  }
}
```

#### `DELETE /api/images/:id`
Delete image (requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Authentication Middleware

Create middleware to verify JWT tokens from Supabase:

```javascript
// middleware/auth.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token verification failed'
    });
  }
}

module.exports = { authenticateToken };
```

---

## Error Handling

Create consistent error responses:

```javascript
// All errors should follow this format:
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE", // Optional
  "details": {} // Optional
}

// HTTP Status Codes:
// 200: Success
// 201: Created
// 400: Bad Request
// 401: Unauthorized
// 403: Forbidden
// 404: Not Found
// 409: Conflict (e.g., duplicate slug)
// 422: Validation Error
// 500: Internal Server Error
```

---

## Environment Variables

Create `.env` file:

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CORS
FRONTEND_URL=http://localhost:3000

# JWT (if using custom JWT)
JWT_SECRET=your-jwt-secret
```

---

## Project Structure Recommendation

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.js
│   │   └── storage.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── templates.controller.js
│   │   ├── projects.controller.js
│   │   └── images.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── templates.routes.js
│   │   ├── projects.routes.js
│   │   └── images.routes.js
│   ├── services/
│   │   ├── supabase.service.js
│   │   ├── storage.service.js
│   │   └── project.service.js
│   ├── utils/
│   │   ├── slugify.js
│   │   └── imageProcessor.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Key Features to Implement

1. **Authentication & Authorization**
   - JWT token verification
   - User profile management
   - Subscription tier checking

2. **Template Management**
   - CRUD operations for templates
   - Category filtering
   - Search functionality

3. **Project Management**
   - Create projects from templates
   - Save/update project data (JSONB)
   - Publish/unpublish projects
   - Slug generation and validation
   - Subscription limit enforcement (active projects count)

4. **Image Management**
   - Upload to Supabase Storage
   - Image metadata tracking
   - Image optimization (optional)
   - Delete unused images

5. **Public Invitation Pages**
   - Public URL generation
   - View tracking
   - No authentication required for published projects

6. **Validation**
   - Request body validation
   - File upload validation (size, type)
   - Slug uniqueness checking

7. **Error Handling**
   - Consistent error responses
   - Proper HTTP status codes
   - Error logging

---

## Testing Requirements

- Unit tests for services
- Integration tests for API endpoints
- Test authentication flows
- Test file uploads
- Test subscription limits

---

## Security Considerations

1. **Authentication**
   - Always verify JWT tokens
   - Use Supabase RLS policies
   - Never expose service role key to frontend

2. **File Uploads**
   - Validate file types (images only)
   - Limit file sizes (e.g., max 10MB)
   - Scan for malicious files
   - Use unique file names

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Limit uploads per user

4. **Input Validation**
   - Validate all user inputs
   - Sanitize JSON data
   - Prevent SQL injection (use parameterized queries)

5. **CORS**
   - Configure CORS to only allow frontend domain
   - Don't allow all origins in production

---

## Deployment Considerations

1. **Environment**
   - Use environment variables for all secrets
   - Different configs for dev/staging/prod

2. **Logging**
   - Log all API requests
   - Log errors with stack traces
   - Use structured logging (JSON)

3. **Monitoring**
   - Health check endpoint (`GET /api/health`)
   - Error tracking (Sentry, etc.)
   - Performance monitoring

4. **Scaling**
   - Consider using connection pooling for Supabase
   - Cache frequently accessed templates
   - Optimize database queries

---

## Additional Notes

- The frontend is built with Next.js and will call these APIs
- All dates should be in ISO 8601 format (UTC)
- Use UUIDs for all IDs
- Implement pagination for list endpoints
- Consider implementing caching for templates (Redis, optional)
- Add API versioning if needed (`/api/v1/...`)

---

## Getting Started Checklist

- [ ] Set up Express.js project
- [ ] Configure Supabase client
- [ ] Set up environment variables
- [ ] Create database schema in Supabase
- [ ] Create storage buckets in Supabase
- [ ] Implement authentication middleware
- [ ] Create auth endpoints
- [ ] Create templates endpoints
- [ ] Create projects endpoints
- [ ] Create images endpoints
- [ ] Add error handling
- [ ] Add input validation
- [ ] Add CORS configuration
- [ ] Test all endpoints
- [ ] Deploy to production

---

This prompt provides a complete specification for building the backend API. Follow the structure, implement all endpoints, and ensure proper security and error handling throughout.

