import React from 'react';

const ShimmerBlock = ({ className }: { className: string }) => (
  <div className={`bg-slate-200 animate-pulse rounded ${className}`}></div>
);

export const FactSkeleton = () => (
  <div className="animate-fade-in-up mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <ShimmerBlock className="h-8 w-32 rounded-full" />
        <ShimmerBlock className="h-6 w-24" />
      </div>
      <ShimmerBlock className="h-8 w-3/4" />
      <ShimmerBlock className="h-8 w-1/2" />
    </div>
    <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
      <div className="flex justify-end gap-2 mb-3">
        <ShimmerBlock className="h-4 w-24" />
        <ShimmerBlock className="h-6 w-8 rounded" />
      </div>
      <div className="space-y-3">
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-5/6 ml-auto" />
      </div>
    </div>
    <div className="flex gap-2">
      <ShimmerBlock className="h-10 w-28 rounded-lg" />
      <ShimmerBlock className="h-10 w-28 rounded-lg" />
    </div>
  </div>
);

export const ReviewSkeleton = () => (
  <div className="animate-fade-in-up mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="bg-orange-50/50 p-6 border-b border-orange-100 flex justify-between">
      <div className="w-2/3">
        <div className="flex gap-2 mb-2">
            <ShimmerBlock className="h-5 w-16" />
            <ShimmerBlock className="h-5 w-10" />
        </div>
        <ShimmerBlock className="h-8 w-48 mb-2" />
        <ShimmerBlock className="h-4 w-32" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <ShimmerBlock className="h-6 w-24" />
        <ShimmerBlock className="h-4 w-12" />
      </div>
    </div>
    <div className="p-6">
      <ShimmerBlock className="h-24 w-full rounded-xl mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <ShimmerBlock className="h-4 w-24 mb-2" />
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
        </div>
        <div className="space-y-2">
          <ShimmerBlock className="h-4 w-24 mb-2" />
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  </div>
);

export const PriceSkeleton = () => (
  <div className="animate-fade-in-up mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="bg-emerald-50/50 p-6 border-b border-emerald-100">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <ShimmerBlock className="h-5 w-32" />
          <ShimmerBlock className="h-8 w-48" />
        </div>
        <ShimmerBlock className="h-12 w-12 rounded-full" />
      </div>
      <ShimmerBlock className="h-12 w-full rounded-lg opacity-60" />
    </div>
    <div className="divide-y divide-slate-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex gap-4 w-full">
            <ShimmerBlock className="h-12 w-12 rounded-lg flex-shrink-0" />
            <div className="space-y-2 w-full max-w-[200px]">
              <ShimmerBlock className="h-4 w-full" />
              <ShimmerBlock className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
             <div className="flex flex-col items-end gap-1">
                <ShimmerBlock className="h-6 w-20" />
                <ShimmerBlock className="h-3 w-12" />
             </div>
             <ShimmerBlock className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);