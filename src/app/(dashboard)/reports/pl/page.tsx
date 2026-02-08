import { TrendingUp, TrendingDown, DollarSign, Percent, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPLData } from './actions';
import { PLDateSelector } from './pl-date-selector';

export default async function PLReportPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const params = await searchParams;

  // Default to current month
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const startDate = params.start || defaultStart;
  const endDate = params.end || defaultEnd;

  const plData = await getPLData(startDate, endDate);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BSD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const grossProfit = plData.revenue - plData.cogs;
  const grossMargin = plData.revenue > 0 ? (grossProfit / plData.revenue) * 100 : 0;
  const netProfit = grossProfit - plData.totalExpenses;
  const netMargin = plData.revenue > 0 ? (netProfit / plData.revenue) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Profit & Loss Statement
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Financial summary for your business
          </p>
        </div>
        <div className="flex gap-2">
          <PLDateSelector startDate={startDate} endDate={endDate} />
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(plData.revenue)}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(plData.totalExpenses)}
              </p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <DollarSign className={`h-5 w-5 ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Margin</p>
              <p className={`text-2xl font-bold ${netMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercent(netMargin)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Percent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Income Statement
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Revenue Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Revenue
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-700 dark:text-gray-300">Sales Revenue</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(plData.revenue)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Total Revenue</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(plData.revenue)}
                </span>
              </div>
            </div>
          </div>

          {/* COGS Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Cost of Goods Sold
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-700 dark:text-gray-300">Direct Costs</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(plData.cogs)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Gross Profit</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(grossProfit)}
                  <span className="text-sm text-gray-500 ml-2">({formatPercent(grossMargin)} margin)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Operating Expenses
            </h3>
            <div className="space-y-2">
              {plData.expensesByCategory.length > 0 ? (
                plData.expensesByCategory.map((category: { name: string; amount: number }) => (
                  <div key={category.name} className="flex justify-between py-2">
                    <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-gray-500 dark:text-gray-400 text-center">
                  No expenses recorded for this period
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Total Operating Expenses</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(plData.totalExpenses)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between py-2">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Net Profit (Loss)</span>
              <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(netProfit)}
                <span className="text-sm text-gray-500 ml-2">({formatPercent(netMargin)} margin)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
