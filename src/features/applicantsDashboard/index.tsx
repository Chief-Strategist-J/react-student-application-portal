import React from 'react';
import { isEqualNormalized } from '../../shared/utils/normalizeKey';
import { SystemUIStatePage } from '../../shared/components/SystemUIStatePage';
import { Search, Clock, CheckCircle2, FileText, ChevronsUpDown, Globe, Building2 } from 'lucide-react';
import type { Applicant } from './types';
import { ApplicantDetailDrawer } from './ApplicantDetailDrawer';
import { getAvatarLetter } from './service';
import { useApplicantsDashboardController, type SortColumn } from './useApplicantsDashboardController';

function StatusBadge({ status }: { status: Applicant['status'] }) {
  const isApproved = status === 'Approved';
  const isUnderReview = status === 'Under Review';
  const isWaitlisted = status === 'Waitlisted';

  const badgeStyle = isApproved
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50'
    : isUnderReview
    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50'
    : isWaitlisted
    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/50'
    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  const dotStyle = isApproved
    ? 'bg-emerald-500 animate-pulse'
    : isUnderReview
    ? 'bg-amber-500'
    : isWaitlisted
    ? 'bg-rose-500'
    : 'bg-slate-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyle}`} />
      {status}
    </span>
  );
}

function SortTh({ col, onSort, children }: { col: SortColumn; onSort: (col: SortColumn) => void; children: React.ReactNode }) {
  return (
    <th onClick={() => onSort(col)} className="py-3 px-4 text-left cursor-pointer select-none group whitespace-nowrap">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
        {children}
        <ChevronsUpDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
      </div>
    </th>
  );
}

export const ApplicantsDashboard: React.FC = () => {
  const {
    selectedApplicant,
    setSelectedApplicant,
    status,
    error,
    errorState,
    searchQuery,
    filteredItems,
    totalCount,
    stats,
    fetch,
    onSearch,
    onSort,
  } = useApplicantsDashboardController();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a365d] dark:text-slate-100">
          Applications Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Live data from{' '}
          <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
            jsonplaceholder.typicode.com/users
          </code>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Applicants', value: stats.total, icon: <FileText className="w-5 h-5" />, iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-[#1a365d] dark:text-blue-400' },
          { label: 'Under Review', value: stats.underReview, icon: <Clock className="w-5 h-5" />, iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
          { label: 'Approved', value: stats.approved, icon: <CheckCircle2 className="w-5 h-5" />, iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
        ].map(({ label, value, icon, iconBg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1.5">{value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={onSearch}
          placeholder="Search by name, email, company, phone, website, or status…"
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 dark:focus:ring-blue-500/30 focus:border-[#1a365d] dark:focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {isEqualNormalized(status, 'loading') && (
          <div className="min-h-[360px] flex items-center justify-center">
            <SystemUIStatePage state="LOADING" />
          </div>
        )}

        {isEqualNormalized(status, 'failed') && (
          <div className="min-h-[360px]">
            <SystemUIStatePage
              state={errorState}
              message={error ?? undefined}
              onRetry={fetch}
            />
          </div>
        )}

        {isEqualNormalized(status, 'succeeded') && filteredItems.length === 0 && (
          <div className="min-h-[360px]">
            <SystemUIStatePage
              state={searchQuery.trim() ? 'NO_SEARCH_RESULTS' : 'NO_DATA_AVAILABLE'}
              message={searchQuery.trim() ? `No results for "${searchQuery}"` : undefined}
            />
          </div>
        )}

        {isEqualNormalized(status, 'succeeded') && filteredItems.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <SortTh col="name" onSort={onSort}>Applicant</SortTh>
                    <SortTh col="email" onSort={onSort}>Contact</SortTh>
                    <SortTh col="company" onSort={onSort}>Organisation</SortTh>
                    <SortTh col="status" onSort={onSort}>Status</SortTh>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((applicant, index) => (
                    <tr
                      key={applicant.id}
                      onClick={() => setSelectedApplicant(applicant)}
                      className={`cursor-pointer border-b border-slate-50 dark:border-slate-800/50 transition-colors hover:bg-[#f8f9ff] dark:hover:bg-slate-800/40 ${index % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-800/20' : 'bg-white dark:bg-slate-900'
                        }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1a365d] dark:bg-blue-700 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                            {getAvatarLetter(applicant.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{applicant.name}</p>
                            <p className="text-xs text-slate-400 truncate">@{applicant.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{applicant.email}</p>
                        <p className="text-xs text-slate-400">{applicant.phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {applicant.company?.name ?? 'N/A'}
                        </div>
                        {applicant.website && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            <Globe className="w-3 h-3 shrink-0" />
                            {applicant.website}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={applicant.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((applicant) => (
                <div key={applicant.id} onClick={() => setSelectedApplicant(applicant)} className="cursor-pointer p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a365d] dark:bg-blue-700 text-white flex items-center justify-center font-semibold shrink-0">
                        {getAvatarLetter(applicant.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{applicant.name}</p>
                        <p className="text-xs text-slate-400">@{applicant.username}</p>
                      </div>
                    </div>
                    <StatusBadge status={applicant.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div>
                      <dt className="text-slate-400 font-medium">Email</dt>
                      <dd className="text-slate-700 dark:text-slate-300 truncate">{applicant.email}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-medium">Phone</dt>
                      <dd className="text-slate-700 dark:text-slate-300">{applicant.phone}</dd>
                    </div>
                    {applicant.company?.name && (
                      <div>
                        <dt className="text-slate-400 font-medium">Company</dt>
                        <dd className="text-slate-700 dark:text-slate-300">{applicant.company.name}</dd>
                      </div>
                    )}
                    {applicant.website && (
                      <div>
                        <dt className="text-slate-400 font-medium">Website</dt>
                        <dd className="text-blue-600 dark:text-blue-400">{applicant.website}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              Showing {filteredItems.length} of {totalCount} applicants
            </div>
          </>
        )}
      </div>

      <ApplicantDetailDrawer applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
    </div>
  );
};
