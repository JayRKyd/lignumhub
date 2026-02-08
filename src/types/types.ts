import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TicketMetric = {
  date: string;
  type: "created" | "resolved";
  count: number;
};

// Invoice types
export interface CompanyDetails {
  email?: string | null;
  companyName?: string | null;
  companyAddress?: string | null;
  companyCity?: string | null;
  companyState?: string | null;
  companyCountry?: string | null;
  companyLogo?: string | null;
  companyTaxId?: string | null;
  companyZip?: string | null;
}

export interface YourDetails {
  yourEmail?: string | null;
  yourName?: string | null;
  yourAddress?: string | null;
  yourCity?: string | null;
  yourState?: string | null;
  yourCountry?: string | null;
  yourLogo?: string | null;
  yourTaxId?: string | null;
  yourZip?: string | null;
}

export interface InvoiceItemDetails {
  note?: string | null;
  discount?: string | null;
  taxRate?: string | null;
  items: Item[];
  currency?: string;
  accentColor?: string;
}

export interface Item {
  itemDescription: string;
  qty?: number;
  amount?: number;
}

export interface InvoiceTerms {
  invoiceNumber?: string | null;
  issueDate?: string | null;
  dueDate?: string | null;
}

export interface PaymentDetails {
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  routingCode?: string | null;
  swiftCode?: string | null;
  transitNumber?: string | null;
  currency?: string;
}

export type InvoiceData = PaymentDetails &
  InvoiceTerms &
  InvoiceItemDetails &
  YourDetails &
  CompanyDetails;

// Database types (matching Supabase schema)
export interface Customer {
  id: string;
  organization_id: string;
  name: string;
  company_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  island?: string | null;
  po_box?: string | null;
  country?: string | null;
  customer_type: 'individual' | 'business';
  credit_terms?: string | null;
  credit_limit?: number | null;
  current_balance?: number | null;
  tax_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFormData {
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  island?: string;
  po_box?: string;
  country?: string;
  customer_type: 'individual' | 'business';
  credit_terms?: string;
  credit_limit?: number;
  tax_id?: string;
  notes?: string;
  tags?: string[];
}

export interface Invoice {
  id: string;
  organization_id: string;
  customer_id?: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  vat_amount?: number | null;
  total_amount: number;
  amount_paid?: number | null;
  balance_due?: number | null;
  sent_via?: string | null;
  sent_at?: string | null;
  pdf_url?: string | null;
  notes?: string | null;
  terms?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joined data
  customer?: Customer | null;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id?: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Organization {
  id: string;
  name: string;
  business_name?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  tax_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  invoice_id?: string | null;
  customer_id?: string | null;
  payment_date: string;
  amount: number;
  payment_method?: string | null;
  reference_number?: string | null;
  notes?: string | null;
  created_at?: string;
}

// Bahamas Islands
export const BAHAMAS_ISLANDS = [
  'New Providence',
  'Grand Bahama',
  'Abaco',
  'Andros',
  'Eleuthera',
  'Exuma',
  'Long Island',
  'Cat Island',
  'Bimini',
  'Inagua',
  'Acklins',
  'Berry Islands',
  'Crooked Island',
  'Mayaguana',
  'Ragged Island',
  'Rum Cay',
  'San Salvador',
  'Other',
] as const;

export type BahamasIsland = typeof BAHAMAS_ISLANDS[number];

// Credit/Payment Terms
export const CREDIT_TERMS = [
  'Due on Receipt',
  'Net 7',
  'Net 14',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Net 90',
  'End of Month',
] as const;

export type CreditTerm = typeof CREDIT_TERMS[number];
