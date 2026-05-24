import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-sm border border-gray-100 flex flex-col relative">
      <Skeleton className="aspect-[4/3] md:aspect-[3/2] rounded-[18px] md:rounded-[24px] mb-2" />
      <div className="flex-grow px-1 md:px-0">
        <div className="flex items-center gap-1 md:gap-2 mb-1">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-2 w-12" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
      </div>
      <div className="pt-2 border-t border-gray-50 px-1 md:px-0">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="relative h-[300px] md:h-[400px] rounded-[32px] md:rounded-[48px] overflow-hidden bg-gray-100 border border-slate-100 shadow-xl">
      <Skeleton className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <Skeleton className="mb-4 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

export default Skeleton;
