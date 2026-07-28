



export const APP_CONFIG = {
  api: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
  },
  storageKeys: {
    applicationDraft: 'eduPortalDraft',
  },
  app: {
    title: 'EduPortal — Admissions Portal',
    description: 'Student Application & Applicants Dashboard Portal',
    version: '1.0.0',
  },
  telemetry: {
    serviceName: 'react-student-application-portal',
    tracerName: 'student-portal-tracer',
    otlpUrl: 'http://localhost:4318/v1/traces',
  },
} as const;


export const ENDPOINTS = {
  USERS: '/users',
  SUBMIT_APPLICATION: '/posts',
} as const;


export const APPLICANT_STATUSES = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  WAITLISTED: 'Waitlisted',
} as const;

export const UI_TABS = {
  DASHBOARD: 'dashboard',
  APPLICATION: 'application',
} as const;

export const ACCEPTED_FILE_FORMATS = '.pdf,.jpg,.png';


export const DESIGN_TOKENS = {
  colors: {
    primary: '#1a365d',
    primaryHover: '#002045',
    surface: '#f8f9ff',
    surfaceCard: '#ffffff',
    onSurface: '#0b1c30',
    onSurfaceMuted: '#43474e',
    outline: '#e2e8f0',
    error: '#ba1a1a',
    success: '#059669',
    warning: '#d97706',
  },
  dark: {
    surface: '#0f172a',
    surfaceCard: '#1e293b',
    outline: '#334155',
    onSurface: '#f1f5f9',
    onSurfaceMuted: '#94a3b8',
  },
  fontFamily: {
    sans: "'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "'Outfit', 'Plus Jakarta Sans', sans-serif",
  },
  borderRadius: {
    card: '0.75rem',
    button: '0.5rem',
    input: '0.5rem',
    badge: '9999px',
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    cardHover: '0 4px 12px rgba(0,0,0,0.08)',
    button: '0 1px 2px rgba(0,0,0,0.08)',
  },
} as const;

export type SystemUIState =
  | 'LOADING'
  | 'EMPTY'
  | 'ERROR'
  | 'SUCCESS'
  | 'OFFLINE'
  | 'API_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED_401'
  | 'FORBIDDEN_403'
  | 'NOT_FOUND_404'
  | 'INTERNAL_ERROR_500'
  | 'VALIDATION_ERROR'
  | 'LOGIN_REQUIRED'
  | 'SESSION_EXPIRED'
  | 'ACCESS_DENIED'
  | 'NO_SEARCH_RESULTS'
  | 'NO_DATA_AVAILABLE'
  | 'SAVING'
  | 'SAVED'
  | 'SUBMIT_FAILED'
  | 'UPLOADING'
  | 'UPLOAD_FAILED'
  | 'IMAGE_FAILED_TO_LOAD'
  | 'PROCESSING'
  | 'CONFIRMATION_REQUIRED'
  | 'UNSAVED_CHANGES'
  | 'DISABLED_STATE'
  | 'READ_ONLY_STATE'
  | 'MAINTENANCE_MODE'
  | 'RATE_LIMITED_429'
  | 'SYNCING'
  | 'SYNC_FAILED';
