import { Debt, StrategyResult, Transaction } from "./types";
import { formatCurrency } from "./debt-utils";

export function exportDebtPayoffPDF(
  debts: Debt[],
  extraPayment: number,
  strategyResult: StrategyResult
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMin = debts.reduce((sum, d) => sum + d.minPayment, 0);
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SpendSensie - Debt Payoff Financial Report</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 0; line-height: 1.5; font-size: 12px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-b: 2px solid #10B981; padding-bottom: 12px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: -0.5px; }
          .subtitle { font-size: 11px; color: #64748B; font-weight: 500; }
          .report-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: #0F172A; }
          .meta-text { font-size: 11px; color: #64748B; margin-bottom: 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; rounded: 8px; border-radius: 8px; }
          .stat-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px; }
          .stat-val { font-size: 16px; font-weight: 800; color: #0F172A; }
          .stat-val-green { color: #10B981; }
          .stat-val-amber { color: #D97706; }
          .section-heading { font-size: 14px; font-weight: 700; color: #0F172A; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #F1F5F9; color: #475569; font-weight: 700; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #CBD5E1; }
          td { padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px; color: #334155; }
          .badge { background: #ECFDF5; color: #047857; font-weight: 700; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
          .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 10px; color: #94A3B8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SpendSensie</div>
            <div class="subtitle">Smart Financial Freedom Engine</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; font-size: 13px;">DEBT PAYOFF REPORT</div>
            <div class="subtitle">Generated: ${dateStr}</div>
          </div>
        </div>

        <div class="report-title">Active Strategy: ${strategyResult.strategy.toUpperCase()} METHOD</div>
        <div class="meta-text">Comprehensive debt payoff analysis based on a $${extraPayment}/month extra discretionary budget allocation.</div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Debt Balance</div>
            <div class="stat-val">${formatCurrency(totalDebt)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Monthly Minimums</div>
            <div class="stat-val">${formatCurrency(totalMin)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Time to Debt Free</div>
            <div class="stat-val stat-val-green">${strategyResult.totalMonths} months</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Interest Paid</div>
            <div class="stat-val stat-val-amber">${formatCurrency(strategyResult.totalInterestPaid)}</div>
          </div>
        </div>

        <div class="section-heading">Debts Included in Strategy</div>
        <table>
          <thead>
            <tr>
              <th>Debt Name</th>
              <th>Current Balance</th>
              <th>Min Payment</th>
              <th>APR %</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            ${debts
              .map(
                (d) => `
              <tr>
                <td><strong>${d.name}</strong></td>
                <td>${formatCurrency(d.balance)}</td>
                <td>${formatCurrency(d.minPayment)}</td>
                <td>${d.interestRate}%</td>
                <td><span class="badge">${d.category.replace("_", " ")}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="section-heading">Payoff Elimination Schedule</div>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Account Name</th>
              <th>Estimated Payoff Month</th>
            </tr>
          </thead>
          <tbody>
            ${strategyResult.payoffOrder
              .map(
                (p, idx) => `
              <tr>
                <td><strong>#${idx + 1}</strong></td>
                <td>${p.name}</td>
                <td>Month ${p.paidOffMonth}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          Generated automatically by SpendSensie Web App • Confidential Financial Document
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function exportBudgetPDF(transactions: Transaction[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netCashFlow = totalIncome - totalExpense;

  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SpendSensie - Budget & Cashflow Report</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 0; line-height: 1.5; font-size: 12px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-b: 2px solid #10B981; padding-bottom: 12px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: -0.5px; }
          .subtitle { font-size: 11px; color: #64748B; font-weight: 500; }
          .report-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: #0F172A; }
          .meta-text { font-size: 11px; color: #64748B; margin-bottom: 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; rounded: 8px; border-radius: 8px; }
          .stat-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px; }
          .stat-val { font-size: 16px; font-weight: 800; color: #0F172A; }
          .stat-val-green { color: #10B981; }
          .stat-val-red { color: #EF4444; }
          .section-heading { font-size: 14px; font-weight: 700; color: #0F172A; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #F1F5F9; color: #475569; font-weight: 700; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #CBD5E1; }
          td { padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px; color: #334155; }
          .income-tag { color: #047857; font-weight: 700; }
          .expense-tag { color: #DC2626; font-weight: 700; }
          .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 10px; color: #94A3B8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SpendSensie</div>
            <div class="subtitle">Smart Financial Freedom Engine</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; font-size: 13px;">BUDGET & CASHFLOW REPORT</div>
            <div class="subtitle">Generated: ${dateStr}</div>
          </div>
        </div>

        <div class="report-title">Monthly Income & Expense Breakdown</div>
        <div class="meta-text">Detailed transactional log and cashflow summary for personal financial management.</div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Monthly Income</div>
            <div class="stat-val stat-val-green">${formatCurrency(totalIncome)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Monthly Expenses</div>
            <div class="stat-val stat-val-red">${formatCurrency(totalExpense)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Net Monthly Cash Flow</div>
            <div class="stat-val ${netCashFlow >= 0 ? "stat-val-green" : "stat-val-red"}">${formatCurrency(netCashFlow)}</div>
          </div>
        </div>

        <div class="section-heading">Recorded Transactions</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                (t) => `
              <tr>
                <td>${t.date}</td>
                <td class="${t.type === "income" ? "income-tag" : "expense-tag"}">${t.type.toUpperCase()}</td>
                <td><strong>${t.title}</strong></td>
                <td>${t.category}</td>
                <td class="${t.type === "income" ? "income-tag" : "expense-tag"}">${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          Generated automatically by SpendSensie Web App • Confidential Financial Document
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
