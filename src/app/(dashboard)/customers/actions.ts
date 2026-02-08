'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Customer, CustomerFormData } from '@/types/types'

// For now, using a placeholder organization ID
// In production, this should come from the authenticated user's session
const getOrganizationId = async () => {
  // TODO: Get from authenticated user's session
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // return user?.user_metadata?.organization_id
  return process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || 'your-org-id-here'
}

export async function getCustomers(search?: string): Promise<Customer[]> {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  let query = supabase
    .from('customers')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }

  return data || []
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .eq('organization_id', orgId)
    .single()

  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }

  return data
}

export async function createCustomer(formData: CustomerFormData): Promise<{ success: boolean; error?: string; customer?: Customer }> {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { data, error } = await supabase
    .from('customers')
    .insert({
      ...formData,
      organization_id: orgId,
      current_balance: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/customers')
  return { success: true, customer: data }
}

export async function updateCustomer(id: string, formData: Partial<CustomerFormData>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { error } = await supabase
    .from('customers')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) {
    console.error('Error updating customer:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/customers')
  revalidatePath(`/customers/${id}`)
  return { success: true }
}

export async function deleteCustomer(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) {
    console.error('Error deleting customer:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/customers')
  return { success: true }
}

export async function getCustomerInvoices(customerId: string) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .eq('organization_id', orgId)
    .order('invoice_date', { ascending: false })

  if (error) {
    console.error('Error fetching customer invoices:', error)
    return []
  }

  return data || []
}

export async function importCustomersFromCSV(customers: CustomerFormData[]): Promise<{ success: boolean; imported: number; errors: string[] }> {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const errors: string[] = []
  let imported = 0

  for (const customer of customers) {
    const { error } = await supabase
      .from('customers')
      .insert({
        ...customer,
        organization_id: orgId,
        current_balance: 0,
      })

    if (error) {
      errors.push(`Failed to import ${customer.name}: ${error.message}`)
    } else {
      imported++
    }
  }

  revalidatePath('/customers')
  return { success: errors.length === 0, imported, errors }
}
