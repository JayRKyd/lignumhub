"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Search, User, Building2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Customer } from "@/types/types";

interface CustomerSelectorProps {
  onCustomerSelect: (customer: Customer | null) => void;
}

export const CustomerSelector = ({ onCustomerSelect }: CustomerSelectorProps) => {
  const { setValue } = useFormContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to select a customer and populate form
  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsOpen(false);
    setSearchQuery("");
    onCustomerSelect(customer);

    // Populate form fields and localStorage
    const fields: Record<string, string> = {
      email: customer.email || "",
      companyName: customer.company_name || customer.name,
      companyAddress: customer.address || "",
      companyCity: customer.city || "",
      companyState: customer.island || "",
      companyZip: customer.po_box || "",
      companyCountry: customer.country || "Bahamas",
      companyTaxId: customer.tax_id || "",
    };

    Object.entries(fields).forEach(([key, value]) => {
      setValue(key, value);
      localStorage.setItem(key, value);
    });

    localStorage.setItem("selectedCustomerId", customer.id);
  };

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || 'your-org-id-here';

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('organization_id', orgId)
        .order('name', { ascending: true });

      if (!error && data) {
        setCustomers(data);
        setFilteredCustomers(data);

        // Check for customer param in URL (client-side)
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const customerIdParam = urlParams.get('customer');
          if (customerIdParam) {
            const preselected = data.find(c => c.id === customerIdParam);
            if (preselected) {
              selectCustomer(preselected);
            }
          }
        }
      }
      setIsLoading(false);
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.company_name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleClearSelection = () => {
    setSelectedCustomer(null);
    onCustomerSelect(null);
    localStorage.removeItem("selectedCustomerId");
  };

  if (isLoading) {
    return (
      <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
        Select Existing Customer (Optional)
      </label>

      {selectedCustomer ? (
        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedCustomer.customer_type === 'business' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
              {selectedCustomer.customer_type === 'business' ? (
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {selectedCustomer.company_name || selectedCustomer.name}
              </p>
              {selectedCustomer.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCustomer.email}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="p-1 hover:bg-orange-100 dark:hover:bg-orange-800 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div
            className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 transition-colors bg-white dark:bg-slate-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search customers by name, company, or email..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {filteredCustomers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? "No customers found" : "No customers available"}
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => selectCustomer(customer)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    <div className={`p-2 rounded-full ${customer.customer_type === 'business' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
                      {customer.customer_type === 'business' ? (
                        <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {customer.company_name || customer.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.company_name && (
                          <span className="truncate">{customer.name}</span>
                        )}
                        {customer.email && (
                          <>
                            {customer.company_name && <span>•</span>}
                            <span className="truncate">{customer.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
