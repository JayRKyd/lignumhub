'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PLDateSelectorProps {
  startDate: string;
  endDate: string;
}

export function PLDateSelector({ startDate, endDate }: PLDateSelectorProps) {
  const router = useRouter();
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    router.push(`/reports/pl?start=${start}&end=${end}`);
    setIsOpen(false);
  };

  const setPreset = (preset: 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear') => {
    const now = new Date();
    let newStart: Date;
    let newEnd: Date;

    switch (preset) {
      case 'thisMonth':
        newStart = new Date(now.getFullYear(), now.getMonth(), 1);
        newEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        newStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        newEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(now.getMonth() / 3);
        newStart = new Date(now.getFullYear(), quarter * 3, 1);
        newEnd = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'thisYear':
        newStart = new Date(now.getFullYear(), 0, 1);
        newEnd = new Date(now.getFullYear(), 11, 31);
        break;
    }

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    setStart(formatDate(newStart));
    setEnd(formatDate(newEnd));
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-80">
            <div className="space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset('thisMonth')}
                >
                  This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset('lastMonth')}
                >
                  Last Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset('thisQuarter')}
                >
                  This Quarter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset('thisYear')}
                >
                  This Year
                </Button>
              </div>

              {/* Custom Range */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Apply Button */}
              <Button
                onClick={handleApply}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
