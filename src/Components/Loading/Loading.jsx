import React from 'react'

export default function Loading() {
    return (
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">

          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-32"></div>
              <div className="h-2 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
    
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>

          <div className="mt-4 flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </article>
      );
}
