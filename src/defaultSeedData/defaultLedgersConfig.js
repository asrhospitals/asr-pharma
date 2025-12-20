/**
 * Default Ledgers Configuration
 * Contains the list of default ledgers to be created for each company
 * Format: { ledgerName, groupName, balanceType, sortOrder }
 */

const defaultLedgersConfig = [
  {
    ledgerName: "Capital Account",
    groupName: "Capital Account",
    balanceType: "Credit",
    sortOrder: 1,
  },
  {
    ledgerName: "Drawings",
    groupName: "Capital Account",
    balanceType: "Debit",
    sortOrder: 2,
  },
  {
    ledgerName: "Cash",
    groupName: "Cash-in-Hand",
    balanceType: "Debit",
    sortOrder: 3,
  },
  {
    ledgerName: "Bank Account",
    groupName: "Bank Accounts",
    balanceType: "Debit",
    sortOrder: 4,
  },
  {
    ledgerName: "Sales",
    groupName: "Sales Accounts",
    balanceType: "Credit",
    sortOrder: 5,
  },
  {
    ledgerName: "Purchase",
    groupName: "Purchase Accounts",
    balanceType: "Debit",
    sortOrder: 6,
  },
  {
    ledgerName: "Salaries",
    groupName: "Indirect Expense",
    balanceType: "Debit",
    sortOrder: 7,
  },
  {
    ledgerName: "Rent Paid",
    groupName: "Indirect Expense",
    balanceType: "Debit",
    sortOrder: 8,
  },
  {
    ledgerName: "Telephone Expenses",
    groupName: "Indirect Expense",
    balanceType: "Debit",
    sortOrder: 9,
  },
  {
    ledgerName: "Electricity Charges",
    groupName: "Indirect Expense",
    balanceType: "Debit",
    sortOrder: 10,
  },
  {
    ledgerName: "Commission Received",
    groupName: "Indirect Income",
    balanceType: "Credit",
    sortOrder: 11,
  },
  {
    ledgerName: "Discount Received",
    groupName: "Indirect Income",
    balanceType: "Credit",
    sortOrder: 12,
  },
  {
    ledgerName: "CGST Input",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 13,
  },
  {
    ledgerName: "SGST Input",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 14,
  },
  {
    ledgerName: "IGST Input",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 15,
  },
  {
    ledgerName: "CGST Input (RCM)",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 16,
  },
  {
    ledgerName: "SGST Input (RCM)",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 17,
  },
  {
    ledgerName: "IGST Input (RCM)",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 18,
  },
  {
    ledgerName: "CGST Output",
    groupName: "Duties & Taxes",
    balanceType: "Credit",
    sortOrder: 19,
  },
  {
    ledgerName: "SGST Output",
    groupName: "Duties & Taxes",
    balanceType: "Credit",
    sortOrder: 20,
  },
  {
    ledgerName: "IGST Output",
    groupName: "Duties & Taxes",
    balanceType: "Credit",
    sortOrder: 21,
  },
  {
    ledgerName: "Sundry Debtors",
    groupName: "Sundry Debtors",
    balanceType: "Debit",
    sortOrder: 22,
  },
  {
    ledgerName: "Sundry Creditors",
    groupName: "Sundry Creditors",
    balanceType: "Credit",
    sortOrder: 23,
  },
  {
    ledgerName: "Sales Return",
    groupName: "Sales Accounts",
    balanceType: "Debit",
    sortOrder: 24,
  },
  {
    ledgerName: "Purchase Return",
    groupName: "Purchase Accounts",
    balanceType: "Credit",
    sortOrder: 25,
  },
  {
    ledgerName: "Loan from Bank",
    groupName: "Secured Loans",
    balanceType: "Credit",
    sortOrder: 26,
  },
  {
    ledgerName: "Loan from Friends",
    groupName: "Unsecured Loans",
    balanceType: "Credit",
    sortOrder: 27,
  },
  {
    ledgerName: "Depreciation",
    groupName: "Indirect Expense",
    balanceType: "Debit",
    sortOrder: 28,
  },
  {
    ledgerName: "Income Tax",
    groupName: "Duties & Taxes",
    balanceType: "Credit",
    sortOrder: 29,
  },
  {
    ledgerName: "TDS Receivable",
    groupName: "Duties & Taxes",
    balanceType: "Debit",
    sortOrder: 30,
  },
  {
    ledgerName: "TDS Payable",
    groupName: "Duties & Taxes",
    balanceType: "Credit",
    sortOrder: 31,
  },
  {
    ledgerName: "Advance to Staff",
    groupName: "Loans & Advances (Asset)",
    balanceType: "Debit",
    sortOrder: 32,
  },
  {
    ledgerName: "Interest Received",
    groupName: "Indirect Income",
    balanceType: "Credit",
    sortOrder: 33,
  },
  {
    ledgerName: "Interest Paid",
    groupName: "Indirect Expense",
    balanceType: "Debit",
    sortOrder: 34,
  },
  {
    ledgerName: "Rounding Off",
    groupName: "Indirect Income",
    balanceType: "Credit",
    sortOrder: 35,
  },
];

module.exports = defaultLedgersConfig;
