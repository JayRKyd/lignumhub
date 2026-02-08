'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Receipt, ExpenseCategory, ReceiptFormData } from '@/types/receipts';
import { PAYMENT_METHODS } from '@/types/receipts';

interface ReceiptReviewFormProps {
  receipt: Receipt;
  categories: ExpenseCategory[];
}

export function ReceiptReviewForm({ receipt, categories }: ReceiptReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractedData = receipt.extracted_data as {
    vendor?: string;
    date?: string;
    total?: number;
    tax?: number;
    category?: string;
  } | null;

  // Find matching category from extracted data
  const matchingCategory = categories.find(
    (c) => c.name.toLowerCase() === extractedData?.category?.toLowerCase()
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReceiptFormData>({
    defaultValues: {
      vendor_name: receipt.vendor_name || extractedData?.vendor || '',
      receipt_date:
        receipt.receipt_date ||
        extractedData?.date ||
        new Date().toISOString().split('T')[0],
      total_amount: receipt.total_amount || extractedData?.total || 0,
      tax_amount: receipt.tax_amount || extractedData?.tax || 0,
      category_id: matchingCategory?.id || categories[0]?.id || '',
      payment_method: 'cash',
      is_tax_deductible: true,
      notes: '',
    },
  });

  const selectedCategoryId = watch('category_id');
  const selectedPaymentMethod = watch('payment_method');
  const isTaxDeductible = watch('is_tax_deductible');

  const onSubmit = async (data: ReceiptFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipt_id: receipt.id,
          expense_date: data.receipt_date,
          category_id: data.category_id,
          vendor_name: data.vendor_name,
          amount: data.total_amount,
          tax_amount: data.tax_amount,
          receipt_url: receipt.image_url,
          notes: data.notes,
          payment_method: data.payment_method,
          is_tax_deductible: data.is_tax_deductible,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save expense');
      }

      router.push('/expenses?success=receipt_saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Vendor Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Vendor Name *
        </label>
        <input
          {...register('vendor_name', { required: 'Vendor name is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Store or business name"
        />
        {errors.vendor_name && (
          <p className="text-red-500 text-sm">{errors.vendor_name.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Date *
        </label>
        <input
          {...register('receipt_date', { required: 'Date is required' })}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {errors.receipt_date && (
          <p className="text-red-500 text-sm">{errors.receipt_date.message}</p>
        )}
      </div>

      {/* Total Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Amount (BSD) *
          </label>
          <input
            {...register('total_amount', {
              required: 'Amount is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Amount must be positive' },
            })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.total_amount && (
            <p className="text-red-500 text-sm">{errors.total_amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tax/VAT Amount
          </label>
          <input
            {...register('tax_amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Category *
        </label>
        <Select
          value={selectedCategoryId}
          onValueChange={(value) => setValue('category_id', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Payment Method
        </label>
        <Select
          value={selectedPaymentMethod}
          onValueChange={(value) => setValue('payment_method', value as ReceiptFormData['payment_method'])}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tax Deductible */}
      <div className="flex items-center gap-3">
        <input
          {...register('is_tax_deductible')}
          type="checkbox"
          id="is_tax_deductible"
          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label
          htmlFor="is_tax_deductible"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Tax Deductible
        </label>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Additional notes about this expense..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/receipts')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save as Expense'
          )}
        </Button>
      </div>
    </form>
  );
}
