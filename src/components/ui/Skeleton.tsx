import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-secondary rounded-xl ${className}`} />
);

export const SongSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-surface border border-border">
    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-32" />
    </div>
    <Skeleton className="h-4 w-16 hidden sm:block" />
    <Skeleton className="h-8 w-8 rounded-full" />
  </div>
);

export const AlbumSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 rounded-2xl bg-surface border border-border">
    <Skeleton className="w-full aspect-square rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const ArtistSkeleton: React.FC = () => (
  <div className="flex flex-col items-center p-4 rounded-2xl bg-surface border border-border text-center space-y-3">
    <Skeleton className="w-24 h-24 rounded-full" />
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const QuizSkeleton: React.FC = () => (
  <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
    <Skeleton className="h-3 w-full rounded-full" />
    <Skeleton className="h-20 w-full rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-14 rounded-xl" />
    </div>
  </div>
);

export const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-surface border border-border">
      <Skeleton className="w-28 h-28 rounded-full" />
      <div className="space-y-3 text-center sm:text-left flex-1">
        <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
        <div className="flex gap-2 justify-center sm:justify-start">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
  </div>
);
