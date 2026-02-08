import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CustomerForm } from '../../components/customer-form'
import { getCustomer } from '../../actions'

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/customers/${customer.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customer
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Edit {customer.company_name || customer.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update customer information
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <CustomerForm customer={customer} mode="edit" />
      </div>
    </div>
  )
}
