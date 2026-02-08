import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil, FileText, Mail, Phone, MapPin, Building2, User, CreditCard, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCustomer, getCustomerInvoices } from '../actions'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  const invoices = await getCustomerInvoices(id)

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BSD',
    }).format(amount)
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${customer.customer_type === 'business' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
              {customer.customer_type === 'business' ? (
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {customer.company_name || customer.name}
              </h1>
              {customer.company_name && (
                <p className="text-gray-500 dark:text-gray-400">{customer.name}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/create-invoice?customer=${customer.id}`}>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </Link>
            <Link href={`/customers/${customer.id}/edit`}>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a href={`mailto:${customer.email}`} className="text-orange-500 hover:underline">
                      {customer.email}
                    </a>
                  </div>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a href={`tel:${customer.phone}`} className="text-gray-900 dark:text-gray-100">
                      {customer.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Address</h2>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="text-gray-900 dark:text-gray-100">
                {customer.address && <p>{customer.address}</p>}
                {customer.po_box && <p>{customer.po_box}</p>}
                <p>
                  {[customer.city, customer.island].filter(Boolean).join(', ') || '-'}
                </p>
                {customer.country && <p>{customer.country}</p>}
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Invoices</h2>
              <Link href={`/create-invoice?customer=${customer.id}`}>
                <Button variant="ghost" size="sm" className="text-orange-500">
                  <FileText className="h-4 w-4 mr-1" />
                  New Invoice
                </Button>
              </Link>
            </div>

            {invoices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No invoices yet.{' '}
                <Link href={`/create-invoice?customer=${customer.id}`} className="text-orange-500 hover:underline">
                  Create the first one
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((invoice: { id: string; invoice_number: string; invoice_date: string; total: number; status: string }) => (
                  <div
                    key={invoice.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(invoice.invoice_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(invoice.total)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                          : invoice.status === 'overdue'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Balance & Terms */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                <p className={`text-2xl font-bold ${
                  (customer.current_balance || 0) > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {formatCurrency(customer.current_balance)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Terms</p>
                  <p className="text-gray-900 dark:text-gray-100">{customer.credit_terms || 'Net 30'}</p>
                </div>
              </div>
              {customer.credit_limit && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Credit Limit</p>
                  <p className="text-gray-900 dark:text-gray-100">{formatCurrency(customer.credit_limit)}</p>
                </div>
              )}
              {customer.tax_id && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tax ID / Business License</p>
                  <p className="text-gray-900 dark:text-gray-100">{customer.tax_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notes</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{customer.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(customer.created_at)}</span>
              </div>
              {customer.updated_at && customer.updated_at !== customer.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                  <span className="text-gray-900 dark:text-gray-100">{formatDate(customer.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
