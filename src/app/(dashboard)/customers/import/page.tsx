'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { importCustomersFromCSV } from '../actions'
import type { CustomerFormData } from '@/types/types'

interface ParsedCustomer extends CustomerFormData {
  rowNumber: number
  errors: string[]
}

export default function ImportCustomersPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parsedCustomers, setParsedCustomers] = useState<ParsedCustomer[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = async (csvFile: File) => {
    const text = await csvFile.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      setParseErrors(['CSV file must have a header row and at least one data row'])
      return
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    const requiredHeaders = ['name']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

    if (missingHeaders.length > 0) {
      setParseErrors([`Missing required columns: ${missingHeaders.join(', ')}`])
      return
    }

    const customers: ParsedCustomer[] = []
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const customer: ParsedCustomer = {
        rowNumber: i + 1,
        errors: [],
        name: '',
        customer_type: 'business',
      }

      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/^"|"$/g, '') || ''

        switch (header) {
          case 'name':
            customer.name = value
            if (!value) customer.errors.push('Name is required')
            break
          case 'company_name':
          case 'company':
            customer.company_name = value
            break
          case 'email':
            customer.email = value
            break
          case 'phone':
            customer.phone = value
            break
          case 'address':
            customer.address = value
            break
          case 'city':
            customer.city = value
            break
          case 'island':
            customer.island = value
            break
          case 'po_box':
            customer.po_box = value
            break
          case 'country':
            customer.country = value || 'Bahamas'
            break
          case 'customer_type':
          case 'type':
            customer.customer_type = value.toLowerCase() === 'individual' ? 'individual' : 'business'
            break
          case 'credit_terms':
          case 'terms':
            customer.credit_terms = value
            break
          case 'credit_limit':
            customer.credit_limit = value ? parseFloat(value) : undefined
            break
          case 'tax_id':
            customer.tax_id = value
            break
          case 'notes':
            customer.notes = value
            break
        }
      })

      if (customer.errors.length > 0) {
        errors.push(`Row ${i + 1}: ${customer.errors.join(', ')}`)
      }

      customers.push(customer)
    }

    setParsedCustomers(customers)
    setParseErrors(errors)
    setImportResult(null)
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)
    return result
  }

  const handleImport = async () => {
    const validCustomers = parsedCustomers.filter(c => c.errors.length === 0)
    if (validCustomers.length === 0) {
      setImportResult({ imported: 0, errors: ['No valid customers to import'] })
      return
    }

    setIsImporting(true)

    const customersToImport: CustomerFormData[] = validCustomers.map(({ rowNumber, errors, ...customer }) => customer)
    const result = await importCustomersFromCSV(customersToImport)

    setImportResult(result)
    setIsImporting(false)

    if (result.errors.length === 0) {
      setTimeout(() => {
        router.push('/customers')
      }, 2000)
    }
  }

  const downloadTemplate = () => {
    const headers = 'name,company_name,email,phone,address,po_box,city,island,country,customer_type,credit_terms,credit_limit,tax_id,notes'
    const example = 'John Doe,Acme Ltd,john@acme.com,(242) 555-1234,123 Bay Street,P.O. Box N-1234,Nassau,New Providence,Bahamas,business,Net 30,5000,BL-12345,Preferred customer'
    const csv = `${headers}\n${example}`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = parsedCustomers.filter(c => c.errors.length === 0).length
  const errorCount = parsedCustomers.filter(c => c.errors.length > 0).length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Import Customers</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload a CSV file to bulk import customers
        </p>
      </div>

      {/* Template Download */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Need a template? Download our CSV template with all the supported columns.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-1" />
              Download Template
            </Button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            {file ? file.name : 'Click to upload CSV'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or drag and drop your file here
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Parse Errors */}
      {parseErrors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Errors found in CSV</p>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                {parseErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {parsedCustomers.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preview</h2>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                {validCount} valid
              </span>
              {errorCount > 0 && (
                <span className="text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  {errorCount} with errors
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Row</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Company</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {parsedCustomers.slice(0, 10).map((customer) => (
                  <tr key={customer.rowNumber} className={customer.errors.length > 0 ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                    <td className="px-3 py-2 text-gray-500">{customer.rowNumber}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{customer.name || '-'}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{customer.company_name || '-'}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{customer.email || '-'}</td>
                    <td className="px-3 py-2">
                      {customer.errors.length > 0 ? (
                        <span className="text-red-600 dark:text-red-400 text-xs">
                          {customer.errors.join(', ')}
                        </span>
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedCustomers.length > 10 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Showing first 10 of {parsedCustomers.length} rows
            </p>
          )}
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className={`rounded-lg p-4 mb-6 ${
          importResult.errors.length === 0
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-start gap-3">
            <CheckCircle className={`h-5 w-5 mt-0.5 ${
              importResult.errors.length === 0 ? 'text-green-500' : 'text-yellow-500'
            }`} />
            <div>
              <p className={`font-medium ${
                importResult.errors.length === 0
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                Successfully imported {importResult.imported} customer{importResult.imported !== 1 ? 's' : ''}
              </p>
              {importResult.errors.length > 0 && (
                <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {importResult.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              {importResult.errors.length === 0 && (
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Redirecting to customers list...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {parsedCustomers.length > 0 && validCount > 0 && !importResult && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setFile(null)
              setParsedCustomers([])
              setParseErrors([])
              setImportResult(null)
            }}
          >
            Clear
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isImporting ? 'Importing...' : `Import ${validCount} Customer${validCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  )
}
