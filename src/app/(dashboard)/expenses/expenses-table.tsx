'use client';

import Link from 'next/link';
import { Eye, Receipt, Check, Minus, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/data-table';
import type { Expense } from '@/types/receipts';

interface ExpensesTableProps {
  expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
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

  const columns: Column<Expense & Record<string, unknown>>[] = [
    {
      key: 'expense_date',
      header: 'Date',
      sortable: true,
      cell: (row) => formatDate(row.expense_date),
    },
    {
      key: 'vendor_name',
      header: 'Vendor',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.vendor_name}
          </span>
          {row.receipt_url && (
            <Receipt className="h-4 w-4 text-green-500" title="Has receipt" />
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.category?.name || '-'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'is_tax_deductible',
      header: 'Tax Status',
      cell: (row) =>
        row.is_tax_deductible ? (
          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Deductible
          </span>
        ) : (
          <span className="text-gray-400">
            <Minus className="h-4 w-4" />
          </span>
        ),
    },
    {
      key: 'receipt_url',
      header: 'Receipt',
      cell: (row) =>
        row.receipt_url ? (
          <a
            href={row.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 text-sm"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ];

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No expenses yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Add your first expense manually or scan a receipt
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/receipts/upload">
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Scan Receipt
            </Button>
          </Link>
          <Link href="/expenses/new">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={expenses as (Expense & Record<string, unknown>)[]}
      columns={columns}
      pageSize={10}
      emptyMessage="No expenses found"
    />
  );
}
