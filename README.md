[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Rgnq8kxT)
# DonorConnect - Donor Retention Platform

> **Nonprofit Donor Management CRM**: A complete donor retention platform helping nonprofits convert first-time donors into lifelong supporters through AI-powered insights and automated workflows.

## 🎯 Project Overview

DonorConnect solves a critical problem facing nonprofits: **70% of first-time donors never make a second gift**. This attrition happens due to disconnected data, missed follow-ups, and limited staff capacity to personalize outreach.

Our solution centralizes donor management, surfaces retention risks automatically, and uses **AI to generate actionable donor summaries**—enabling small nonprofit teams to act quickly and build lasting relationships.

## 🌟 Key Features

- **📊 Donor Management**: Complete CRUD for donors with multi-tenant data isolation
- **💰 Donation Tracking**: Record, view, and analyze donations linked to specific campaigns
- **📈 Dashboard Analytics**: Real-time metrics showing total donors, donations, and at-risk supporters
- **🤖 AI Donor Summaries**: OpenAI-powered insights that condense donor history and suggest next actions
- **🎯 Campaign Management**: Track active fundraising campaigns with goal progress
- **🔒 Role-Based Access**: Admin-only features for adding donors and recording donations
- **⚡ Transaction Simulator**: Test workflows without processing real payments
- **🔐 Secure Authentication**: Session-based auth with HTTP-only cookies

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (deliberately chosen for rapid MVP development)
- **Database**: PostgreSQL with Prisma 7 ORM
- **UI**: Tailwind CSS 4 + shadcn/ui components
- **AI**: OpenAI GPT-4o-mini for donor summaries
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Deployment**: Vercel
- **Package Manager**: pnpm 10

## 🤖 AI Integration

DonorConnect uses AI responsibly to assist nonprofit staff:

### How AI Works
- **Feature**: AI Donor Summary button on donor profiles
- **Model**: OpenAI GPT-4o-mini via server-side API route
- **Data Sent**: Minimal summary data (gift counts, totals, recency, risk level) - NO raw PII
- **Output**: 60-80 word actionable summary with retention recommendations
- **Purpose**: Helps staff quickly understand donor relationships and personalize outreach

### Responsible AI Safeguards
- Server-side only (keys never exposed to client)
- Organization scoping enforced before summarization
- Prompts designed to avoid hallucinations and stay concise
- No training or logging of donor data
- Clear user control (opt-in feature via button click)

See `/ai-policy` page for complete AI documentation.

## 🚀 Live Demo

**Deployed App**: [https://donorconnect.vercel.app](https://donorconnect.vercel.app)

**Test Credentials** (after running `npx prisma db seed`):
- Email: `admin@hopefoundation.org`
- Password: `password123`

## 📦 Local Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm 10+
- PostgreSQL database (local or Neon)
- **Testing suggestions** for validation

### 🔍 Code Examples Throughout
```javascript
// Example from src/lib/api/donors.js
export async function createDonor(data, organizationId) {
  // TODO: Validate data using createDonorSchema
  // TODO: Check for duplicate email within organization
  // TODO: Create donor with Prisma
  // TODO: Return created donor with calculated metrics
}
```

### 🎯 Incremental Complexity
- Start with simple CRUD operations
- Progress to complex relationships and validation
- Advance to real-time features and optimization
- Master testing and deployment patterns

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **pnpm 10.18+** (recommended package manager)
- **PostgreSQL database** (local installation or cloud service like Neon)
- **Basic knowledge** of JavaScript, React, and SQL concepts

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
### Installation Steps

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd donorconnect
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/donorconnect?sslmode=disable"
   
   # AI (Optional - for donor summaries)
   OPENAI_API_KEY="your-openai-api-key"
   ```

3. **Set up database:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Load seed data (75 donors, 200+ donations)
   npx prisma db seed
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run Vitest tests
pnpm test:e2e     # Run Playwright E2E tests
npx prisma studio # Open database GUI
```
    │   ├── handlers/            # TODO: MSW mock handlers
    │   └── lib/                 # TODO: Unit tests for utilities
```

### 🎯 Implementation Status

| Module | Status | Files | Description |
|--------|--------|-------|-------------|
| **Configuration** | ✅ Complete | 5 files | Ready-to-use configs for all tools |
| **Database Schema** | ✅ Complete | schema.prisma | Full nonprofit domain model |
| **Seed Data** | ✅ Complete | seed.js | 75 donors, 200+ donations, realistic data |
| **UI Components** | ✅ Complete | 10 components | shadcn/ui foundation ready |
| **Authentication** | 🔄 TODO | 8 files | Session-based auth implementation |
| **API Routes** | 🔄 TODO | 15+ files | RESTful endpoints with validation |
| **Dashboard Pages** | 🔄 TODO | 12 files | React pages with forms and tables |
| **Business Logic** | 🔄 TODO | 8 files | Data processing and validation |
| **Testing Suite** | 🔄 TODO | 20+ files | Unit, integration, and E2E tests |

## 🛠 Development Workflow

### Essential Commands

```bash
# 🚀 Development
pnpm dev                         # Start dev server (http://localhost:3000)
pnpm build                       # Build for production
pnpm start                       # Start production server
pnpm lint                        # Run ESLint

# 🗄️ Database Operations  
npx prisma generate              # Generate client after schema changes
npx prisma migrate dev           # Create and apply new migrations
npx prisma studio                # Visual database browser (GUI)
npx prisma db seed               # Reload test data (resets database)

# 🧪 Testing
pnpm test                        # Run unit tests with Vitest
pnpm test:watch                  # Run tests in watch mode
pnpm test:ui                     # Open Vitest UI interface
pnpm test:e2e                    # Run Playwright E2E tests
```

### Development Tips

#### 🔄 Working with Database Changes
```bash
# After modifying schema.prisma:
npx prisma generate              # Updates TypeScript types
npx prisma migrate dev --name descriptive_name  # Creates migration

# To reset development database:
npx prisma migrate reset         # ⚠️  Destroys all data
npx prisma db seed               # Reload sample data
```

#### 🐛 Debugging & Troubleshooting
```bash
# View database in browser
npx prisma studio

# Reset everything if stuck
rm -rf node_modules pnpm-lock.yaml
pnpm install
npx prisma generate
npx prisma migrate reset

# Check what's running on port 3000
lsof -i :3000
```

#### 📊 Exploring Seed Data
The seed script creates realistic nonprofit data:
- **Organizations**: Hope Foundation, Green Earth Alliance  
- **Users**: 10 staff members with different roles
- **Donors**: 75 donors with varied giving patterns
- **Donations**: 200+ donations across multiple campaigns
- **Campaigns**: Annual fund, emergency response, major gifts
- **Segments**: First-time, loyal, lapsed, major gift prospects
- **Workflows**: Welcome series, retention campaigns

### Testing Setup & Strategy

```bash
# 🧪 Unit & Integration Tests (Vitest)
pnpm test                        # Run all tests once
pnpm test:watch                  # Watch mode for active development
pnpm test:ui                     # Visual test runner interface

# 🎭 End-to-End Tests (Playwright)  
npx playwright install          # Install browsers (one-time setup)
pnpm test:e2e                    # Run full user workflow tests
npx playwright test --ui         # Interactive test runner
```

#### Testing Architecture
- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React components in isolation  
- **Integration Tests**: API routes and database operations
- **E2E Tests**: Complete user workflows (login → create donor → record donation)
- **MSW Mocking**: Mock external APIs for consistent testing

> **💡 Pro Tip**: Use test-driven development (TDD) - write tests first, then implement the feature!

## 📊 Domain Model & Business Logic

### 🏢 Core Entities

#### **Multi-Tenant Architecture**
```javascript
Organization  // Tenant boundary (Hope Foundation, Green Earth Alliance)
├── Users[]        // Staff members (admin, manager, user roles)
├── Donors[]       // Donor profiles with retention metrics  
├── Campaigns[]    // Fundraising campaigns
├── Donations[]    // Individual gifts linked to donors/campaigns
├── Segments[]     // Dynamic donor groupings based on rules
└── Workflows[]    // Automated engagement sequences
```

#### **Key Relationships**
- Every entity includes `organizationId` for data isolation
- Donors → Donations (one-to-many with calculated totals)
- Campaigns → Donations (track campaign performance)  
- Segments ↔ Donors (many-to-many via SegmentMember)
- Workflows → Tasks (automation creates follow-up tasks)

#### **Calculated Fields** 
Donors have auto-calculated metrics updated on each donation:
- `totalAmount` - Lifetime giving total
- `totalGifts` - Number of donations made
- `firstGiftDate` - Date of first donation  
- `lastGiftDate` - Date of most recent gift
- `averageGiftAmount` - Mean donation size
- `retentionRisk` - LOW/MEDIUM/HIGH based on giving patterns

### 🎯 Business Rules to Implement

#### **Retention Risk Calculation**
```javascript
// TODO: Implement in src/lib/api/donors.js
function calculateRetentionRisk(donor) {
  // First-time donors = HIGH risk
  // 2+ gifts, recent activity = LOW risk  
  // 2+ gifts, no activity 12+ months = HIGH risk
  // 1 gift, 6-12 months ago = MEDIUM risk
}
```

#### **Segmentation Logic**
```javascript
// TODO: Implement in src/lib/api/segments.js  
const segmentCriteria = {
  donorStatus: ['ACTIVE', 'LAPSED'],           // Filter by status
  retentionRisk: ['HIGH'],                     // Target high-risk donors
  lastGiftDateRange: { after: '2023-01-01' }, // Recent activity
  totalAmountRange: { min: 100, max: 1000 },  // Gift size range
  campaignParticipation: ['annual-fund-2024'] // Specific campaign
}
```

## 🎯 Implementation Roadmap

### Phase 1: Authentication Foundation 🔐
**Time Estimate: 2-3 days**

**Files to Implement:**
- `src/lib/auth.js` - Password hashing and validation
- `src/lib/session.js` - Session creation and management  
- `src/app/api/auth/*/route.js` - Login, logout, register endpoints
- `src/app/(auth)/*/page.jsx` - Login and registration forms
- `src/middleware.js` - Route protection

**Key Learning:**
- HTTP-only cookie security
- bcrypt password hashing
- Session validation patterns
- Next.js 16 middleware

### Phase 2: Core API Development 🔗
**Time Estimate: 4-5 days**

**Files to Implement:**
- `src/app/api/donors/route.js` - CRUD operations for donors
- `src/app/api/donations/route.js` - Donation recording with metrics updates
- `src/app/api/campaigns/route.js` - Campaign management
- `src/lib/validation/*-schema.js` - Zod validation schemas
- `src/lib/api/*.js` - Business logic and database operations

**Key Learning:**
- RESTful API design patterns
- Database transactions
- Data validation with Zod
- Error handling strategies

### Phase 3: Dashboard Interface 🎨  
**Time Estimate: 5-6 days**

**Files to Implement:**
- `src/app/(dashboard)/donors/page.jsx` - Donor listing with search/filter
- `src/app/(dashboard)/donors/new/page.jsx` - Donor creation form
- `src/app/(dashboard)/donations/page.jsx` - Donation recording interface
- `src/components/donors/*.jsx` - Donor-specific components
- `src/hooks/use-*.js` - Custom data fetching hooks

**Key Learning:**
- React Hook Form patterns
- Table components with sorting/filtering
- Optimistic UI updates
- Form validation and error states

### Phase 4: Advanced Features 🚀
**Time Estimate: 4-5 days**

**Files to Implement:**
- `src/app/(dashboard)/segments/page.jsx` - Segment builder interface
- `src/app/(dashboard)/workflows/page.jsx` - Workflow automation
- `src/components/segments/*.jsx` - Dynamic criteria builder
- `src/components/workflows/*.jsx` - Workflow step configuration

**Key Learning:**
- Complex form builders
- Dynamic UI generation
- Background job processing
- Advanced database queries

### Phase 5: Testing & Polish 🧪
**Time Estimate: 3-4 days**

**Files to Implement:**
- `tests/lib/*.test.js` - Unit tests for utilities
- `tests/api/*.test.js` - API endpoint testing
- `tests/e2e/*.spec.js` - End-to-end user workflows
- Performance optimization and deployment setup

**Key Learning:**
- Testing strategies and tools
- Performance monitoring
- Production deployment
- Code quality practices

## 💾 Exploring the Seed Data

Understanding the provided data helps you implement realistic features:

### 📈 **Organization Profiles**
```sql
-- Two complete nonprofit organizations
Hope Foundation (75 donors, $145K raised)
Green Earth Alliance (environmental focus)
```

### 👥 **Donor Distribution** (75 total donors)
```sql  
-- Realistic retention risk distribution
40% First-time donors (HIGH risk)    → Need welcome series
30% Two-gift donors (MEDIUM risk)    → Need retention campaign  
20% Loyal donors (LOW risk)          → Need upgrade cultivation
10% Lapsed donors (CRITICAL risk)    → Need reactivation outreach
```

### 💰 **Donation Patterns** (200+ donations)
```sql
-- Gift size distribution mirrors real nonprofits
- $10-50: Online/monthly donors (65%)
- $51-250: Event/mail donors (25%)  
- $251-1000: Major gift prospects (8%)
- $1000+: Major donors (2%)
```

### 📊 **Campaign Performance**
```sql
Annual Fund 2024        → $67,500 raised (ongoing)
Emergency Response      → $23,400 raised (completed)  
Holiday Campaign        → $18,900 raised (completed)
Major Gifts Initiative  → $35,200 raised (active)
```

### 🎯 **Pre-built Segments**
- **First-Time Donors**: Welcome series candidates
- **Lapsed Donors**: Reactivation targets  
- **Major Gift Prospects**: High-capacity individuals
- **Monthly Sustainers**: Recurring gift donors
- **Event Participants**: Engagement-based segment

> **💡 Development Tip**: Use `npx prisma studio` to explore this data visually while building features!

## 🏗 Technology Stack

### **Core Framework**
- **Next.js 16** (App Router) - React meta-framework with file-based routing
- **React 19.2.3** - UI library with modern hooks and server components
- **JavaScript** (no TypeScript) - Faster development for learning/MVP

### **Database & ORM**
- **PostgreSQL** - Production-ready relational database
- **Prisma 7.1.0** - Type-safe ORM with migrations and client generation
- **@prisma/adapter-pg** - Neon PostgreSQL adapter for cloud deployment

### **UI & Styling**
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **shadcn/ui** - Copy-paste React components built on Radix UI
- **Lucide React 0.561.0** - Beautiful, customizable icons

### **Forms & Validation**
- **React Hook Form 7.68.0** - Performant forms with minimal re-renders
- **Zod 4.2.0** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration layer for form validation

### **Authentication & Security**
- **bcrypt** - Password hashing with configurable salt rounds
- **HTTP-only cookies** - Secure session storage (no localStorage)
- **Database sessions** - Server-side session management

### **Testing & Quality**
- **Vitest 4.0.15** - Lightning-fast unit test runner
- **Playwright** - Cross-browser end-to-end testing
- **MSW (Mock Service Worker)** - API mocking for testing
- **ESLint** - Code quality and consistency

### **Development Tools**
- **pnpm 10.18.1** - Fast, space-efficient package manager  
- **Prisma Studio** - Visual database browser
- **Hot reloading** - Instant feedback during development

### **Architecture Decisions**

#### Why No TypeScript?
- **Faster learning curve** for beginners
- **Reduced complexity** during MVP development  
- **JavaScript + Zod** provides runtime validation
- **Easy migration path** to TypeScript later

#### Why Session-Based Auth?
- **Simpler than JWT** for learning projects
- **Better security** with HTTP-only cookies
- **Server-side control** over session lifecycle
- **No client-side token management**

#### Why Prisma 7?
- **Excellent developer experience** with type safety
- **Built-in migrations** for version control
- **Client generation** eliminates manual SQL
- **Rich relationship handling** for complex domains

## 📖 Additional Resources

### **Project Documentation**
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive architecture and development patterns
- **[business-context.md](resource-docs/business-context.md)** - Nonprofit domain knowledge
- **[component-architecture.md](resource-docs/component-architecture.md)** - System design overview
- **[testing-architecture.md](resource-docs/testing-architecture.md)** - Testing strategy and tools

### **Learning Resources**
- **[Next.js 16 Documentation](https://nextjs.org/docs)** - Framework fundamentals
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM guide
- **[React Hook Form](https://react-hook-form.com/)** - Advanced form patterns
- **[Zod Documentation](https://zod.dev/)** - Schema validation
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first styling

### **Development Community**
- **[Next.js Discord](https://discord.gg/bUG2bvbtHy)** - Framework community
- **[Prisma Discord](https://pris.ly/discord)** - Database help and discussions
- **[shadcn/ui GitHub](https://github.com/shadcn/ui)** - Component library issues

## 🚀 Deployment Options

### **Development Database**
```bash
# Local PostgreSQL (recommended for learning)
brew install postgresql
createdb donor_connect

# Or use Docker
docker run --name postgres -e POSTGRES_DB=donor_connect -p 5432:5432 -d postgres
```

### **Cloud Database (Production)**
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (free tier)
- **[Supabase](https://supabase.com/)** - Firebase alternative with PostgreSQL
- **[PlanetScale](https://planetscale.com/)** - MySQL-compatible serverless database

### **Application Deployment**
- **[Vercel](https://vercel.com/)** - Next.js optimized (recommended)
- **[Netlify](https://netlify.com/)** - JAMstack deployment
- **[Railway](https://railway.app/)** - Full-stack deployment with database

## 🔐 Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Database URL for Prisma 7 with driver adapters
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&sslmode=disable"

# For production/Neon (with SSL):
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&sslmode=require"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Add email service config for future features
# SENDGRID_API_KEY="your_sendgrid_key"
# EMAIL_FROM="noreply@yournonprofit.org"
```

## 📄 License

This educational project is released under the **ISC License** - feel free to use it for learning, teaching, or building your own nonprofit tools!

---

## 🎉 Ready to Start?

1. **Set up your development environment** (database, dependencies)
2. **Explore the seed data** with `npx prisma studio`  
3. **Start with authentication** - implement login/logout first
4. **Build incrementally** - one feature at a time
5. **Test frequently** - write tests as you build features
6. **Ask questions** - use GitHub Issues for help

**Happy coding! 🚀** Build something amazing for the nonprofit sector!
