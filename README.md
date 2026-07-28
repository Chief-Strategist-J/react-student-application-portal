# EduPortal — Admissions & Student Application Portal

[![CI/CD Pipeline](https://github.com/Chief-Strategist-J/react-student-application-portal/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Chief-Strategist-J/react-student-application-portal/actions)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-orange.svg)](https://edu-portal-2026.web.app)

A modern, responsive, production-ready React 19 application for student admissions and applicant tracking. Built with Redux Toolkit, Redux Saga, OpenTelemetry tracing, custom controllers, Vitest unit/integration testing, Storybook component isolated states, and automated CI/CD deployment to Firebase Hosting.

> 🚀 **Live Demo URL**: [https://edu-portal-2026.web.app](https://edu-portal-2026.web.app)

---

## 🌐 Live Demo & Deployment

- **Firebase Hosting Production URL**: [https://edu-portal-2026.web.app](https://edu-portal-2026.web.app)
- **GitHub Repository**: [https://github.com/Chief-Strategist-J/react-student-application-portal](https://github.com/Chief-Strategist-J/react-student-application-portal)

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19, TypeScript, Vite
- **Styling & Design System**: Tailwind CSS v4, Lucide Icons, Custom Design Tokens (`shared/config/index.ts`)
- **State Management**: Redux Toolkit (`createSlice`, `createListSlice` factory pattern), Redux Saga
- **Observability**: OpenTelemetry Web Tracer (`withSpan`), Namespaced Structured Logger (`shared/logger/index.ts`)
- **Separation of Concerns**: Pure UI views + Custom Controller Hooks (`useApplicantsDashboardController`, `useApplicationFormController`) + Pure Domain Services
- **Testing**: Vitest + React Testing Library (11 Test Suites, 43 Unit & Store Integration Tests)
- **Storybook**: Component stories for loading, error, empty, dark mode, and step states
- **Containerization**: Multi-stage `Dockerfile` (Node 20 Alpine build + Nginx Alpine runner), `docker-compose.yml`
- **CI/CD**: GitHub Actions pipeline triggering unit testing, production compilation, and deployment to Firebase Hosting

---

## 📁 Feature Anatomy & Project Structure

```text
src/
├── features/
│   ├── applicantsDashboard/
│   │   ├── index.tsx                        # Pure UI presentation view
│   │   ├── useApplicantsDashboardController.ts # UI controller hook
│   │   ├── service.ts                       # Pure domain filter/sort/stats logic
│   │   ├── slice.ts                         # Redux slice state
│   │   ├── saga.ts                          # Fetch controller saga
│   │   ├── repository/                      # API service repository layer with logging
│   │   ├── ApplicantDetailDrawer.tsx        # Slide-in applicant details panel
│   │   ├── ApplicantsDashboard.stories.tsx   # Storybook component state stories
│   │   └── tests/
│   │       └── unit/                        # Unit, slice, saga & full store integration tests
│   └── applicationForm/
│       ├── index.tsx                        # Pure UI multi-step form presentation view
│       ├── useApplicationFormController.ts  # Form controller hook
│       ├── service.ts                       # Validation rules & localStorage draft service
│       ├── slice.ts                         # Redux slice state
│       ├── saga.ts                          # Form submit controller saga & auto-redirect
│       ├── repository/                      # Submit API service repository layer
│       ├── ApplicationForm.stories.tsx      # Multi-step Storybook component stories
│       └── tests/
│           └── unit/                        # Form unit & integration tests
├── shared/
│   ├── api/                                 # Central HTTP client (httpGet, httpPost)
│   ├── logger/                              # Namespaced structured logger (no raw comments)
│   ├── tracing/                             # OpenTelemetry tracer & withSpan utility
│   ├── store/                               # Central Redux store & uiSlice
│   ├── config/                              # Centralized design tokens & API endpoints
│   └── tests/                               # Shared utilities and component unit tests
└── App.tsx                                  # Layout root with dark mode sync & navigation
```

---

## ⚡ What Was Built & Accomplished

1. **Applications Dashboard Feature**:
   - Live REST integration fetching users from `/users`.
   - Real-time client-side search across name, username, email, phone, company, and status.
   - Interactive column sorting (ascending / descending).
   - Status indicators (Pending, Under Review, Approved, Waitlisted).
   - Interactive slide-in **Applicant Detail Drawer** for viewing full applicant contact info, address, company, and coordinates.

2. **Multi-Step Student Application Form**:
   - 3-step wizard (Personal Information, Document Uploads, Review & Submit).
   - Step 1 input validation (email format, 10-digit phone, required fields).
   - LocalStorage auto-draft saving (`eduPortalDraft`) and restoration.
   - Real `POST /posts` submission via Redux Saga.
   - Auto-navigates back to the Dashboard upon successful submission and prepends the new applicant to the list.

3. **Strict Architecture & Clean Code Enforcement**:
   - **Zero Logic in UI**: All React UI components are 100% pure presentation. State management is extracted into custom controller hooks (`useApplicationFormController`, `useApplicantsDashboardController`), and business logic lives in domain service files.
   - **Zero Comments**: Main code base contains zero raw single-line or multi-line comments.
   - **Service & Controller Logging**: Logging logic is strictly placed in service repositories and saga controllers.

4. **Observability & Telemetry**:
   - Custom `createLogger('namespace')` supporting `debug`, `info`, `warn`, `error` levels with ISO timestamps.
   - OpenTelemetry Web Tracer initialized with `FetchInstrumentation` and `withSpan` wrapper for end-to-end tracing.

5. **Comprehensive Testing Suite (43 Tests)**:
   - Unit tests covering logger, API client, slices, repositories, and sagas.
   - Store integration tests verifying end-to-end user flows (idle → loading → succeeded/failed).
   - All tests moved into dedicated `tests/unit/` subdirectories.

6. **Isolated Component States (Storybook)**:
   - Full story coverage for Dashboard (`Loading`, `WithData`, `Empty`, `ErrorState`, `SearchFiltered`, `DarkMode`, `DetailDrawer`).
   - Story coverage for Application Form (`StepOne`, `StepTwo`, `StepThree`, `Submitting`, `SubmitSuccess`, `SubmitError`, `DarkMode`).

7. **Deployment & DevOps**:
   - Live Firebase Hosting setup (`edu-portal-2026.web.app`).
   - Multi-stage Docker production setup (`Dockerfile` & `docker-compose.yml`).
   - Automated GitHub Actions CI/CD workflow (`.github/workflows/ci-cd.yml`) executing tests, compilation, and Firebase deployment on every push.

---

## 🚀 Local Development & Commands

### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation
```bash
npm install
```

### Dev Server
```bash
npm run dev
```

### Run Tests
```bash
npm test -- --run
```

### Production Build
```bash
npm run build
```

### Run with Docker Compose
```bash
docker-compose up --build -d
```
The application will be accessible at [http://localhost:8080](http://localhost:8080).
