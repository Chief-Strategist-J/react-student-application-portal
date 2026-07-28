import React from 'react';
import {
  RefreshCw,
  AlertTriangle,
  WifiOff,
  Clock,
  Lock,
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  AlertCircle,
  SearchX,
  Database,
  CheckCircle2,
  ImageOff,
  Eye,
  Wrench,
  Zap,
} from 'lucide-react';
import type { SystemUIState } from '../config';

export interface SystemUIStatePageProps {
  state: SystemUIState;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const SystemUIStatePage: React.FC<SystemUIStatePageProps> = ({
  state,
  title,
  message,
  onRetry,
  onConfirm,
  onCancel,
}) => {
  switch (state) {
    case 'LOADING':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <RefreshCw className="animate-spin text-[#002045] dark:text-blue-400 w-10 h-10 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Loading Content'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message || 'Please wait while we prepare your data...'}</p>
        </div>
      );

    case 'OFFLINE':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200/60 dark:border-rose-900/60">
          <WifiOff className="text-rose-600 dark:text-rose-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'No Internet Connection'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'You are currently offline. Check your network connection and try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Retry Connection
            </button>
          )}
        </div>
      );

    case 'TIMEOUT':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <Clock className="text-amber-600 dark:text-amber-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Request Timed Out'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'The server took too long to respond. Please try your request again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      );

    case 'UNAUTHORIZED_401':
    case 'LOGIN_REQUIRED':
    case 'SESSION_EXPIRED':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <Lock className="text-[#002045] dark:text-blue-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {title || (state === 'SESSION_EXPIRED' ? 'Session Expired' : 'Authentication Required')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'Please log in again to access this area.'}
          </p>
        </div>
      );

    case 'FORBIDDEN_403':
    case 'ACCESS_DENIED':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <ShieldAlert className="text-rose-600 dark:text-rose-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Access Denied (403)'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'You do not have permission to view or modify this resource.'}
          </p>
        </div>
      );

    case 'NOT_FOUND_404':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <FileQuestion className="text-slate-400 dark:text-slate-500 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Resource Not Found (404)'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'The requested page or record could not be found.'}
          </p>
        </div>
      );

    case 'INTERNAL_ERROR_500':
    case 'API_ERROR':
    case 'ERROR':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <ServerCrash className="text-rose-600 dark:text-rose-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Server Error (500)'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'An unexpected error occurred on our servers. Please try again later.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      );

    case 'VALIDATION_ERROR':
      return (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs uppercase">{title || 'Validation Error'}</h4>
            <p className="text-xs mt-0.5">{message || 'Please check the highlighted fields and correct errors.'}</p>
          </div>
        </div>
      );

    case 'NO_SEARCH_RESULTS':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <SearchX className="text-slate-400 dark:text-slate-500 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'No Matching Results'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message || 'Try adjusting your search filters.'}</p>
        </div>
      );

    case 'NO_DATA_AVAILABLE':
    case 'EMPTY':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <Database className="text-slate-400 dark:text-slate-500 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'No Data Available'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message || 'There are no records to display.'}</p>
        </div>
      );

    case 'SAVING':
    case 'UPLOADING':
    case 'PROCESSING':
    case 'SYNCING':
      return (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold">
          <RefreshCw className="animate-spin w-4 h-4" />
          <span>{message || `${state}...`}</span>
        </div>
      );

    case 'SAVED':
    case 'SUCCESS':
      return (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message || 'Action completed successfully.'}</span>
        </div>
      );

    case 'SUBMIT_FAILED':
    case 'UPLOAD_FAILED':
    case 'SYNC_FAILED':
      return (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>{message || 'Operation failed. Please try again.'}</span>
        </div>
      );

    case 'IMAGE_FAILED_TO_LOAD':
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-xs">{message || 'Failed to load image'}</span>
        </div>
      );

    case 'CONFIRMATION_REQUIRED':
    case 'UNSAVED_CHANGES':
      return (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>{title || 'Unsaved Changes'}</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400">{message || 'You have unsaved changes. Are you sure you want to leave?'}</p>
          <div className="flex gap-2 justify-end pt-2">
            {onCancel && (
              <button onClick={onCancel} className="px-3 py-1.5 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-semibold">
                Cancel
              </button>
            )}
            {onConfirm && (
              <button onClick={onConfirm} className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold">
                Confirm
              </button>
            )}
          </div>
        </div>
      );

    case 'DISABLED_STATE':
    case 'READ_ONLY_STATE':
      return (
        <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold">
          <Eye className="w-4 h-4" />
          <span>{message || 'This view is in read-only mode.'}</span>
        </div>
      );

    case 'MAINTENANCE_MODE':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <Wrench className="text-amber-600 dark:text-amber-400 w-12 h-12 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Under Maintenance'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'System maintenance in progress. Please check back shortly.'}
          </p>
        </div>
      );

    case 'RATE_LIMITED_429':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <Zap className="text-amber-600 dark:text-amber-400 w-12 h-12 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title || 'Too Many Requests (429)'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {message || 'You have sent too many requests in a short time. Please wait a moment.'}
          </p>
        </div>
      );

    default:
      return null;
  }
};
