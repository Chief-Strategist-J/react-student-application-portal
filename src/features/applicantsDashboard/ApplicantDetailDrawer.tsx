import React from 'react';
import {
  X,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  User,
  Hash,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import type { Applicant } from './types';
import { APPLICANT_STATUSES } from '../../shared/config';

interface Props {
  applicant: Applicant | null;
  onClose: () => void;
}

const STATUS_COLORS: Record<Applicant['status'], { badge: string; bar: string }> = {
  [APPLICANT_STATUSES.APPROVED]: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50',
    bar: 'bg-emerald-500',
  },
  [APPLICANT_STATUSES.UNDER_REVIEW]: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50',
    bar: 'bg-amber-500',
  },
  [APPLICANT_STATUSES.PENDING]: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    bar: 'bg-slate-400',
  },
  [APPLICANT_STATUSES.WAITLISTED]: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/50',
    bar: 'bg-rose-500',
  },
};

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value?: string; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5 font-medium">
            {value}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="text-sm text-slate-800 dark:text-slate-200 mt-0.5 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

export const ApplicantDetailDrawer: React.FC<Props> = ({ applicant, onClose }) => {
  if (!applicant) return null;

  const statusCfg = STATUS_COLORS[applicant.status] ?? STATUS_COLORS[APPLICANT_STATUSES.PENDING];
  const avatarLetter = applicant.name?.charAt(0).toUpperCase() ?? 'U';

  const fullAddress = applicant.address
    ? [applicant.address.street, applicant.address.suite, applicant.address.city, applicant.address.zipcode]
        .filter(Boolean)
        .join(', ')
    : undefined;

  return (
    <>
      {}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${applicant.name} details`}
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
      >
        {}
        <div className={`h-1 w-full ${statusCfg.bar}`} />

        {}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#2d527c] dark:from-blue-700 dark:to-blue-600 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
              {avatarLetter}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {applicant.name}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">@{applicant.username}</p>
              <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.bar}`} />
                {applicant.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close detail panel"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Contact Information
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4">
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={applicant.email} href={`mailto:${applicant.email}`} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={applicant.phone} href={`tel:${applicant.phone}`} />
              <InfoRow icon={<Globe className="w-4 h-4" />} label="Website" value={applicant.website} href={`https://${applicant.website}`} />
            </div>
          </section>

          {}
          {applicant.company && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Organisation
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4">
                <InfoRow icon={<Building2 className="w-4 h-4" />} label="Company" value={applicant.company.name} />
                {applicant.company.catchPhrase && (
                  <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Catchphrase" value={applicant.company.catchPhrase} />
                )}
              </div>
            </section>
          )}

          {}
          {applicant.address && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Address
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4">
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Full Address" value={fullAddress} />
                {applicant.address.geo && (
                  <InfoRow
                    icon={<Hash className="w-4 h-4" />}
                    label="Coordinates"
                    value={`${applicant.address.geo.lat}, ${applicant.address.geo.lng}`}
                  />
                )}
              </div>
            </section>
          )}

          {}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Identity
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4">
              <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={applicant.name} />
              <InfoRow icon={<Hash className="w-4 h-4" />} label="Applicant ID" value={`#${applicant.id}`} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Handle" value={`@${applicant.username}`} />
            </div>
          </section>
        </div>

        {}
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
