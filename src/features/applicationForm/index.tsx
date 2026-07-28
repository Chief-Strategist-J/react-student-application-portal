import React from 'react';
import { ACCEPTED_FILE_FORMATS } from '../../shared/config';
import { Check, Upload, RefreshCw, CheckCircle2, FileText, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApplicationFormController } from './useApplicationFormController';

export const ApplicationForm: React.FC = () => {
  const {
    formFields,
    saving,
    localError,
    successMessage,
    errors,
    updateField,
    handleNext,
    handleBack,
    handleSubmit,
    handleFileChange,
    handleReturnToDashboard,
  } = useApplicationFormController();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center sm:text-left border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a365d] dark:text-slate-100">Student Application Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Complete all 3 steps below to submit your official application.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="mb-8">
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${formFields.step > 1 ? 'bg-emerald-600 text-white' : 'bg-[#1a365d] dark:bg-blue-600 text-white ring-4 ring-[#1a365d]/10 dark:ring-blue-500/20'}`}>
                {formFields.step > 1 ? <Check className="w-5 h-5" /> : 1}
              </div>
              <span className={`text-xs mt-2 font-semibold ${formFields.step >= 1 ? 'text-[#1a365d] dark:text-slate-200' : 'text-slate-400'}`}>Personal Details</span>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${formFields.step > 2 ? 'bg-emerald-600 text-white' : formFields.step === 2 ? 'bg-[#1a365d] dark:bg-blue-600 text-white ring-4 ring-[#1a365d]/10 dark:ring-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                {formFields.step > 2 ? <Check className="w-5 h-5" /> : 2}
              </div>
              <span className={`text-xs mt-2 font-semibold ${formFields.step >= 2 ? 'text-[#1a365d] dark:text-slate-200' : 'text-slate-400'}`}>Documents</span>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${formFields.step === 3 ? 'bg-[#1a365d] dark:bg-blue-600 text-white ring-4 ring-[#1a365d]/10 dark:ring-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                3
              </div>
              <span className={`text-xs mt-2 font-semibold ${formFields.step === 3 ? 'text-[#1a365d] dark:text-slate-200' : 'text-slate-400'}`}>Review & Submit</span>
            </div>
          </div>
        </div>

        {localError && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-medium">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {formFields.step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="w-5 h-5 text-[#1a365d] dark:text-blue-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['firstName', 'lastName'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor={field}>
                      {field === 'firstName' ? 'First Name' : 'Last Name'} *
                    </label>
                    <input
                      id={field}
                      type="text"
                      value={formFields[field] || ''}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={field === 'firstName' ? 'e.g. Jane' : 'e.g. Doe'}
                      className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${errors[field] ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 dark:border-slate-700 focus:ring-[#1a365d]/20 focus:border-[#1a365d] dark:focus:border-blue-400'}`}
                    />
                    {errors[field] && <span className="text-rose-600 dark:text-rose-400 text-xs mt-1 block">{errors[field]}</span>}
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    value={formFields.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="student@university.edu"
                    className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 dark:border-slate-700 focus:ring-[#1a365d]/20 focus:border-[#1a365d] dark:focus:border-blue-400'}`}
                  />
                  {errors.email && <span className="text-rose-600 dark:text-rose-400 text-xs mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="phone">Phone Number (10 digits) *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formFields.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="9876543210"
                    className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 dark:border-slate-700 focus:ring-[#1a365d]/20 focus:border-[#1a365d] dark:focus:border-blue-400'}`}
                  />
                  {errors.phone && <span className="text-rose-600 dark:text-rose-400 text-xs mt-1 block">{errors.phone}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="dob">Date of Birth *</label>
                  <input
                    id="dob"
                    type="date"
                    value={formFields.dob || ''}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${errors.dob ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 dark:border-slate-700 focus:ring-[#1a365d]/20 focus:border-[#1a365d] dark:focus:border-blue-400'}`}
                  />
                  {errors.dob && <span className="text-rose-600 dark:text-rose-400 text-xs mt-1 block">{errors.dob}</span>}
                </div>
              </div>
            </div>
          )}

          {formFields.step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <FileText className="w-5 h-5 text-[#1a365d] dark:text-blue-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Document Upload</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload clear documents in PDF, JPG, or PNG format.</p>
              <div className="space-y-3">
                {([
                  { key: 'transcriptName' as const, label: 'Academic Transcript', sub: 'Most recent official transcript.' },
                  { key: 'idProofName'    as const, label: 'ID Proof',            sub: 'Government-issued ID or Passport.' },
                  { key: 'statementName' as const, label: 'Personal Statement',  sub: 'Statement of purpose essay.' },
                ]).map(({ key, label, sub }) => (
                  <div key={key} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                    </div>
                    <div>
                      <label className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[#1a365d] dark:text-blue-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-xs">
                        <Upload className="w-4 h-4" />
                        Upload File
                        <input type="file" accept={ACCEPTED_FILE_FORMATS} onChange={(e) => handleFileChange(key, e)} className="hidden" />
                      </label>
                      {formFields[key] && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">✓ {formFields[key]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formFields.step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-[#1a365d] dark:text-blue-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Review Application</h2>
              </div>
              <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Full Name',      value: `${formFields.firstName || ''} ${formFields.lastName || ''}`.trim() || '-' },
                    { label: 'Email',          value: formFields.email || '-' },
                    { label: 'Phone',          value: formFields.phone || '-' },
                    { label: 'Date of Birth',  value: formFields.dob   || '-' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="block text-xs font-semibold text-slate-400 uppercase">{label}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700">
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-2">Attached Documents</span>
                  <ul className="text-sm space-y-1">
                    {([
                      { label: 'Academic Transcript', field: formFields.transcriptName },
                      { label: 'ID Proof',            field: formFields.idProofName },
                      { label: 'Personal Statement',  field: formFields.statementName },
                    ]).map(({ label, field }) => (
                      <li key={label} className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">{label}:</span>
                        <span className={field ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-slate-400 italic'}>
                          {field || 'Not uploaded'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-slate-200/80 dark:border-slate-800">
            {formFields.step > 1 ? (
              <button type="button" onClick={handleBack} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-xs">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {formFields.step < 3 ? (
              <button type="button" onClick={handleNext} className="bg-[#1a365d] hover:bg-[#002045] dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98]">
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={saving} className="bg-[#1a365d] hover:bg-[#002045] dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2 active:scale-[0.98]">
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                {saving ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>

        {successMessage && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold text-[#1a365d] dark:text-slate-100 mb-2">Application Submitted!</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 max-w-sm">{successMessage}</p>
            <button onClick={handleReturnToDashboard} className="bg-[#1a365d] hover:bg-[#002045] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm">
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
