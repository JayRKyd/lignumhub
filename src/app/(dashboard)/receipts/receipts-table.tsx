'use client';

import { useRouter } from 'next/navigation';
import { Eye, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/data-table';
import type { Receipt } from '@/types/receipts';
import Link from 'next/link';

interface ReceiptsTableProps {
  receipts: Receipt[];
}

export function ReceiptsTable({ receipts }: ReceiptsTableProps) {
  const router = useRouter();

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BSD',
    }).format(amount);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: Column<Receipt & Record<string, unknown>>[] = [
    {
      key: 'receipt_date',
      header: 'Date',
      sortable: true,
      cell: (row) => formatDate(row.receipt_date),
    },
    {
      key: 'vendor_name',
      header: 'Vendor',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-100 dark:bg-slate-800 rounded overflow-hidden flex-shrink-0">
            {row.image_url ? (
              <img
                src={row.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <FileText className="h-4 w-4 m-2 text-gray-400" />
            )}
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.vendor_name || 'Unknown Vendor'}
          </span>
        </div>
      ),
    },
    {
      key: 'total_amount',
      header: 'Amount',
      sortable: true,
      cell: (row) => (
        <span className="font-medium">{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : row.status === 'pending_review'
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {row.status === 'completed'
            ? 'Completed'
            : row.status === 'pending_review'
            ? 'Pending Review'
            : 'Failed'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <Link href={`/receipts/${row.id}/review`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            {row.status === 'pending_review' ? 'Review' : 'View'}
          </Button>
        </Link>
      ),
    },
  ];

  if (receipts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No receipts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Upload your first receipt to start tracking expenses
        </p>
        <Link href="/receipts/upload">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Upload className="h-4 w-4 mr-2" />
            Upload Receipt
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DataTable
      data={receipts as (Receipt & Record<string, unknown>)[]}
      columns={columns}
      pageSize={10}
      emptyMessage="No receipts found"
    />
  );
}
