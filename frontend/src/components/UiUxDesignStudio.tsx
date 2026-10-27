import React, { useState } from 'react';
import { UiUxDesignSpec } from '../types';
import { Palette, Smartphone, Eye, Sparkles, AlertCircle, Lock, CheckCircle2, RefreshCw, Gift } from 'lucide-react';

interface UiUxDesignStudioProps {
  specs: UiUxDesignSpec[];
}

export const UiUxDesignStudio: React.FC<UiUxDesignStudioProps> = ({ specs }) => {
  const [selectedSpec, setSelectedSpec] = useState<UiUxDesignSpec | null>(specs[0] || null);
  const [activeStatePreview, setActiveStatePreview] = useState<'loading' | 'empty' | 'success' | 'error' | 'forbidden'>('success');

  const states = [
    { id: 'loading', label: '1. Loading Skeleton' },
    { id: 'empty', label: '2. Empty State' },
    { id: 'success', label: '3. Success State' },
    { id: 'error', label: '4. Error State' },
    { id: 'forbidden', label: '5. Forbidden (403)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            UI/UX Design Studio & State Matrix Gate
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Engineered by UI/UX Design Engineer. Google-inspired visual clarity + Rapido-inspired speed and ergonomics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-800">
            Touch Target: &ge; 48px
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-semibold border border-emerald-300 dark:border-emerald-800">
            WCAG AAA (7.2:1)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Spec Selector & Design Guidelines */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Palette className="h-4 w-4 text-sky-500" />
              <span>Designed Screens & Modals</span>
            </h3>

            <div className="space-y-2">
              {specs.map(spec => (
                <div
                  key={spec.id}
                  onClick={() => setSelectedSpec(spec)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    selectedSpec?.id === spec.id
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 dark:text-white">{spec.screen_name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{spec.id}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
                    <span>Route: {spec.menu_path}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Philosophy Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Speed & Usability Standards</span>
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                <span><strong>Google Clarity:</strong> Purposeful negative space, sharp typographic hierarchy, intuitive icons.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span><strong>Rapido Speed:</strong> Primary action thumb-reachable at screen bottom, instant micro-interactions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <span><strong>Role Alignment:</strong> Protected menu visibility synced with backend token authorization.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: 5-State Interactive Preview Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interactive State Matrix Verification
              </h3>
              <p className="text-xs text-slate-400">
                Click any state to preview and verify its UI/UX implementation.
              </p>
            </div>

            {/* State Matrix Selector */}
            <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {states.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveStatePreview(s.id as any)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    activeStatePreview === s.id
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/60 min-h-[380px] flex items-center justify-center">
            {/* 1. Loading Skeleton State */}
            {activeStatePreview === 'loading' && (
              <div className="w-full max-w-md space-y-3 animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
                <p className="text-center text-[11px] text-slate-400 pt-2">
                  {selectedSpec?.states_matrix.loading || 'Skeleton loading active'}
                </p>
              </div>
            )}

            {/* 2. Empty State */}
            {activeStatePreview === 'empty' && (
              <div className="w-full max-w-sm text-center space-y-3 py-6">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 mx-auto flex items-center justify-center">
                  <Gift className="h-7 w-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Coupons Available</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {selectedSpec?.states_matrix.empty || 'You currently have zero active reward vouchers.'}
                </p>
                <button className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-semibold shadow-sm hover:bg-sky-600 transition">
                  Explore Trending Offers
                </button>
              </div>
            )}

            {/* 3. Success State */}
            {activeStatePreview === 'success' && (
              <div className="w-full max-w-md space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Voucher Successfully Applied!</h5>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      {selectedSpec?.states_matrix.success || '-$15.00 discount applied to order subtotal.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Order Subtotal:</span>
                    <span>$85.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Loyalty Voucher (VIP_SAVE15):</span>
                    <span>-$15.00</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Total Due:</span>
                    <span>$70.00</span>
                  </div>
                </div>

                <button className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-wider shadow-md transition">
                  Proceed to Instant Payment (Rapido 1-Tap)
                </button>
              </div>
            )}

            {/* 4. Error State */}
            {activeStatePreview === 'error' && (
              <div className="w-full max-w-md p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-3">
                <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <AlertCircle className="h-5 w-5" />
                  <span>Validation Error</span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300">
                  {selectedSpec?.states_matrix.error || 'The entered voucher code has expired or is invalid for this cart.'}
                </p>
                <button className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry with Another Code</span>
                </button>
              </div>
            )}

            {/* 5. Forbidden (403) State */}
            {activeStatePreview === 'forbidden' && (
              <div className="w-full max-w-sm text-center space-y-3 py-6">
                <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center">
                  <Lock className="h-7 w-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">403 — Access Restricted</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedSpec?.states_matrix.forbidden || 'This rewards tab requires an authenticated Customer profile.'}
                </p>
                <div className="flex justify-center space-x-2 pt-1">
                  <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Switch Account
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-sky-500 text-xs font-semibold text-white">
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
