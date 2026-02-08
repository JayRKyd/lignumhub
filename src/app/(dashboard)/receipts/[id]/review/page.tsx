import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getReceipt, getExpenseCategories } from '../../actions';
import { ReceiptReviewForm } from './review-form';

export default async function ReceiptReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await getReceipt(id);

  if (!receipt) {
    notFound();
  }

  // If already completed, redirect to expenses
  if (receipt.status === 'completed' && receipt.expense_id) {
    redirect('/expenses');
  }

  const categories = await getExpenseCategories();

  const showConfidenceWarning =
    receipt.confidence_score !== null && receipt.confidence_score < 0.7;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/receipts"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Receipts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Review Receipt
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Verify the extracted information and save as an expense
        </p>
      </div>

      {/* Confidence Warning */}
      {showConfidenceWarning && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              Low confidence extraction
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              We couldn't read all details clearly. Please verify the information
              below carefully.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receipt Image */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Receipt Image
          </h2>
          <div className="relative bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <img
              src={receipt.image_url}
              alt="Receipt"
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Receipt Details
          </h2>
          <ReceiptReviewForm receipt={receipt} categories={categories} />
        </div>
      </div>
    </div>
  );
}
