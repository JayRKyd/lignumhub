import { Suspense } from 'react'
import Link from 'next/link'
import { getCustomers } from './actions'
import { CustomerList } from './components/customer-list'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams
  const customers = await getCustomers(params.search)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your customers and their information
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/customers/import">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </Link>
          <Link href="/customers/new">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer List */}
      <Suspense fallback={<CustomerListSkeleton />}>
        <CustomerList customers={customers} initialSearch={params.search} />
      </Suspense>
    </div>
  )
}

function CustomerListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
