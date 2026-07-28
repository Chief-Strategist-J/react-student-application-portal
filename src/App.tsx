import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './shared/store/hooks';
import { uiActions } from './shared/store/uiSlice';
import { ApplicantsDashboard } from './features/applicantsDashboard';
import { ApplicationForm } from './features/applicationForm';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Menu,
  X,
  Plus,
  Sun,
  Moon,
} from 'lucide-react';
import { isEqualNormalized } from './shared/utils/normalizeKey';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector((s) => s.ui.currentTab);
  const mobileMenuOpen = useAppSelector((s) => s.ui.mobileMenuOpen);
  const theme = useAppSelector((s) => s.ui.theme);

  const isDark = isEqualNormalized(theme, 'dark');


  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavChange = useCallback(
    (tab: 'dashboard' | 'application') => {
      dispatch(uiActions.setCurrentTab(tab));
      dispatch(uiActions.setMobileMenuOpen(false));
    },
    [dispatch]
  );

  const toggleMobileMenu = useCallback(() => {
    dispatch(uiActions.toggleMobileMenu());
  }, [dispatch]);

  const toggleTheme = useCallback(() => {
    dispatch(uiActions.toggleTheme());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a365d] dark:bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#1a365d] dark:text-white text-lg tracking-tight">
              EduPortal
            </span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          {isDark ? (
            <><Sun className="w-4 h-4 text-amber-400" /><span>Light</span></>
          ) : (
            <><Moon className="w-4 h-4" /><span>Dark</span></>
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {}
        <aside
          className={[
            'flex flex-col shrink-0 w-64 bg-white dark:bg-slate-900',
            'border-r border-slate-200 dark:border-slate-800',

            'md:relative md:flex md:translate-x-0',

            'fixed inset-y-0 left-0 z-40',
            'transition-transform duration-300 ease-in-out',
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          ].join(' ')}
        >
          {}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a365d] to-[#2d527c] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#1a365d] dark:text-white tracking-tight leading-none">
                  EduPortal
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                  Admissions Portal
                </p>
              </div>
            </div>
            {}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              {isDark ? (
                <><Sun className="w-3.5 h-3.5 text-amber-400" /><span>Light</span></>
              ) : (
                <><Moon className="w-3.5 h-3.5" /><span>Dark</span></>
              )}
            </button>
          </div>

          {}
          <div className="px-4 pt-5">
            <button
              onClick={() => handleNavChange('application')}
              className="w-full flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#002045] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Start New Application
            </button>
          </div>

          {}
          <nav className="flex-1 px-3 pt-4 space-y-1">
            <button
              onClick={() => handleNavChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-[#eff4ff] dark:bg-slate-800 text-[#1a365d] dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
              {currentTab === 'dashboard' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a365d] dark:bg-blue-400" />
              )}
            </button>

            <button
              onClick={() => handleNavChange('application')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'application'
                  ? 'bg-[#eff4ff] dark:bg-slate-800 text-[#1a365d] dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Application Form</span>
              {currentTab === 'application' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a365d] dark:bg-blue-400" />
              )}
            </button>
          </nav>

          {}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 dark:text-slate-600">
              © 2026 EduPortal University
            </p>
          </div>
        </aside>

        {}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {}
        <main className="flex-1 overflow-y-auto bg-[#f8f9ff] dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
            {currentTab === 'dashboard' ? <ApplicantsDashboard /> : <ApplicationForm />}
          </div>
        </main>
      </div>
    </div>
  );
};
