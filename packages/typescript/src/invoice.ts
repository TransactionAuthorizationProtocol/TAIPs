// TAP Invoice Types and Data Structures
// Based on TAIP-16 specification and UBL standards

import { IsoCurrency } from "./currencies";

/**
 * UBL Unit of Measure Code standard
 * Based on UN/CEFACT code list
 * 
 * @see {@link http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/UnitOfMeasureCode-2.1.gc | UBL Unit of Measure Codes}
 */
export enum UnitCode {
  // Mass
  KGM = "KGM", // Kilogram
  GRM = "GRM", // Gram
  MGM = "MGM", // Milligram
  TNE = "TNE", // Tonne (metric ton)
  
  // Volume
  LTR = "LTR", // Liter
  MLT = "MLT", // Milliliter
  MMQ = "MMQ", // Cubic millimeter
  CMQ = "CMQ", // Cubic centimeter
  DMQ = "DMQ", // Cubic decimeter
  MTQ = "MTQ", // Cubic meter
  
  // Length
  MMT = "MMT", // Millimeter
  CMT = "CMT", // Centimeter
  DMT = "DMT", // Decimeter
  MTR = "MTR", // Meter
  KMT = "KMT", // Kilometer
  
  // Area
  MTK = "MTK", // Square meter
  
  // Count
  EA = "EA",   // Each
  PCE = "PCE", // Piece
  NPR = "NPR", // Number of pairs
  
  // Time
  SEC = "SEC", // Second
  MIN = "MIN", // Minute
  HUR = "HUR", // Hour
  DAY = "DAY", // Day
  WEE = "WEE", // Week
  MON = "MON", // Month
  ANN = "ANN", // Year
  
  // Other
  KWH = "KWH", // Kilowatt hour
  NAR = "NAR", // Number of articles
}

/**
 * UBL Tax Category Code standard (UN/ECE 5305 Tax Category Code)
 * Based on UN/CEFACT and EU tax categories
 * 
 * @see {@link http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/TaxCategory-2.1.gc | UBL Tax Category Codes}
 * @see {@link https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL5305/ | PEPPOL BIS 3.0 Tax Category Codes}
 */
export enum TaxCategoryCode {
  S = "S",     // Standard rate
  Z = "Z",     // Zero rated goods
  E = "E",     // Exempt from tax
  AE = "AE",   // VAT Reverse Charge
  G = "G",     // Free export item, tax not charged
  O = "O",     // Services outside scope of tax
  K = "K",     // VAT exempt for EEA intra-community supply
  L = "L",     // Canary Islands general indirect tax
  M = "M",     // Tax for production, services and importation in Ceuta and Melilla
  H = "H",     // Higher rate
  AA = "AA",   // Lower rate
  B = "B",     // Transferred (VAT)
  A = "A",     // Mixed tax rate
  AB = "AB",   // Exempt for resale
  AC = "AC",   // VAT Reverse Charge (alternative to AE)
  AD = "AD",   // VAT exempt for EEA intra-community supply (alternative to K)
  C = "C",     // Exempt from tax (deprecated, use E instead)
  D = "D",     // Exempt based on article 309
}

/**
 * UBL Tax Scheme Code standard (UN/ECE 5305 Tax Type Code)
 * Based on UN/CEFACT tax types
 * 
 * @see {@link http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/TaxScheme-2.1.gc | UBL Tax Scheme Codes}
 */
export enum TaxSchemeCode {
  AAA = "AAA", // Profit tax
  AAB = "AAB", // Corporate income tax
  AAC = "AAC", // Personal income tax
  AAD = "AAD", // Social security tax
  AAE = "AAE", // Property tax
  AAF = "AAF", // Inheritance tax
  AAG = "AAG", // Gift tax
  AAH = "AAH", // Capital gains tax
  AAI = "AAI", // Wealth tax
  AAJ = "AAJ", // Stamp duty
  CST = "CST", // Consumption tax
  CUS = "CUS", // Customs duty
  ENV = "ENV", // Environmental tax
  EXC = "EXC", // Excise tax
  EXP = "EXP", // Export tax
  FRT = "FRT", // Freight tax
  GST = "GST", // Goods and Services Tax
  IMP = "IMP", // Import tax
  OTH = "OTH", // Other tax
  SAL = "SAL", // Sales tax
  TOT = "TOT", // Turnover tax
  VAT = "VAT", // Value Added Tax
}

/**
 * UBL Document Type Code standard
 * Based on UBL 2.1 document types
 * 
 * @see {@link http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/DocumentTypeCode-2.1.gc | UBL Document Type Codes}
 */
export enum DocumentTypeCode {
  // Order and Quotation Documents
  Order = "Order",
  OrderResponse = "OrderResponse",
  OrderChange = "OrderChange",
  OrderCancellation = "OrderCancellation",
  Quotation = "Quotation",
  
  // Delivery Documents
  DespatchAdvice = "DespatchAdvice",
  ReceiptAdvice = "ReceiptAdvice",
  
  // Invoice Documents
  Invoice = "Invoice",
  CreditNote = "CreditNote",
  DebitNote = "DebitNote",
  SelfBilledInvoice = "SelfBilledInvoice",
  
  // Payment Documents
  RemittanceAdvice = "RemittanceAdvice",
  Statement = "Statement",
  
  // Certificate Documents
  CertificateOfOrigin = "CertificateOfOrigin",
  
  // Contract Documents
  Contract = "Contract",
  
  // Other Documents
  Timesheet = "Timesheet",
  Waybill = "Waybill",
  Manifest = "Manifest",
}

/**
 * Tax Category
 * Represents a tax category with its rate and scheme
 */
export interface TaxCategory {
  /**
   * Tax category identifier
   * Uses UBL Tax Category Code standard
   * 
   * @example "S" // Standard rate
   * @example "Z" // Zero rated goods
   * @example "E" // Exempt from tax
   */
  id: TaxCategoryCode;
  
  /**
   * Tax rate percentage
   * 
   * @example 20.0 // 20% VAT
   * @example 0.0  // Zero rate
   */
  percent: number;
  
  /**
   * Tax scheme identifier
   * Uses UBL Tax Scheme Code standard
   * 
   * @example "VAT" // Value Added Tax
   * @example "GST" // Goods and Services Tax
   * @example "SAL" // Sales Tax
   */
  taxScheme: TaxSchemeCode | string;
}

/**
 * Line Item
 * Represents an individual item in an invoice
 */
export interface LineItem {
  /**
   * Unique identifier for the line item within the invoice
   */
  id: string;
  
  /**
   * Description of the item or service
   */
  description: string;
  
  /**
   * Product name
   * Based on schema.org/Product
   * If not provided, description serves as the display name
   * 
   * @example "Premium Widget Model A"
   */
  name?: string;
  
  /**
   * URL to an image of the product
   * Based on schema.org/Product
   * 
   * @example "https://example.com/products/widget-a.jpg"
   */
  image?: string;
  
  /**
   * URL to the product page
   * Based on schema.org/Product
   * 
   * @example "https://example.com/products/widget-a"
   */
  url?: string;
  
  /**
   * Quantity of the item
   */
  quantity: number;
  
  /**
   * Unit of measure code
   * Uses UBL Unit of Measure Code standard
   * 
   * @example "EA" // Each
   * @example "KGM" // Kilogram
   * @example "HUR" // Hour
   */
  unitCode?: UnitCode;
  
  /**
   * Price per unit
   */
  unitPrice: number;
  
  /**
   * Total amount for this line item
   * Typically quantity × unitPrice
   */
  lineTotal: number;
  
  /**
   * Tax category information specific to this line item
   */
  taxCategory?: TaxCategory;
}

/**
 * Tax Subtotal
 * Breakdown of taxes by category
 */
export interface TaxSubtotal {
  /**
   * Amount subject to this tax
   */
  taxableAmount: number;
  
  /**
   * Tax amount for this category
   */
  taxAmount: number;
  
  /**
   * Tax category information
   */
  taxCategory: TaxCategory;
}

/**
 * Tax Total
 * Aggregate tax information for the invoice
 */
export interface TaxTotal {
  /**
   * Total tax amount for the invoice
   */
  taxAmount: number;
  
  /**
   * Breakdown of taxes by category
   */
  taxSubtotal?: TaxSubtotal[];
}

/**
 * Order Reference
 * Reference to a related order
 */
export interface OrderReference {
  /**
   * Order identifier
   */
  id: string;
  
  /**
   * Date when the order was issued
   * ISO 8601 date format (YYYY-MM-DD)
   */
  issueDate?: string;
}

/**
 * Additional Document Reference
 * Reference to an additional document related to the invoice
 */
export interface AdditionalDocumentReference {
  /**
   * Document identifier
   */
  id: string;
  
  /**
   * Type of document
   * Uses UBL Document Type Code standard
   */
  documentType?: DocumentTypeCode;
  
  /**
   * URL where the document can be accessed
   */
  url?: string;
}

/**
 * Invoice
 * Represents a detailed invoice as defined in TAIP-16
 * 
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-16.md | TAIP-16: Invoices}
 */
export interface Invoice {
  /**
   * Unique identifier for the invoice
   * 
   * @example "INV001"
   * @validation Must be a unique identifier for the invoice
   */
  id: string;
  
  /**
   * Date when the invoice was issued
   * ISO 8601 date format (YYYY-MM-DD)
   * 
   * @example "2025-04-22"
   * @validation Must be a valid date in ISO 8601 format
   */
  issueDate: string;
  
  /**
   * Currency code for the invoice amounts
   * ISO 4217 currency code
   * Should be consistent with the currency field in the Payment Request if present
   * 
   * @example "USD"
   * @example "EUR"
   * @validation Must be a valid ISO 4217 currency code
   */
  currencyCode: IsoCurrency;
  
  /**
   * Individual items being invoiced
   * 
   * @validation Must be an array of LineItem objects
   */
  lineItems: LineItem[];
  
  /**
   * Aggregate tax information
   * 
   * @validation Must be a TaxTotal object if present
   */
  taxTotal?: TaxTotal;
  
  /**
   * Total amount of the invoice, including taxes
   * Must match the amount in the Payment Request body
   * 
   * @validation Must be a positive number
   */
  total: number;
  
  /**
   * Sum of line totals before taxes
   * 
   * @validation Must be a positive number if present
   */
  subTotal?: number;
  
  /**
   * Date when payment is due
   * ISO 8601 date format (YYYY-MM-DD)
   * 
   * @example "2025-05-22"
   * @validation Must be a valid date in ISO 8601 format if present
   */
  dueDate?: string;
  
  /**
   * Additional notes or terms for the invoice
   * 
   * @validation Must be a string if present
   */
  note?: string;
  
  /**
   * Terms of payment
   * 
   * @example "Net 30"
   * @validation Must be a string if present
   */
  paymentTerms?: string;
  
  /**
   * Buyer's accounting code
   * Used to route costs to specific accounts
   * 
   * @validation Must be a string if present
   */
  accountingCost?: string;
  
  /**
   * Reference to a related order
   * 
   * @validation Must be an OrderReference object if present
   */
  orderReference?: OrderReference;
  
  /**
   * References to additional documents
   * 
   * @validation Must be an array of AdditionalDocumentReference objects if present
   */
  additionalDocumentReference?: AdditionalDocumentReference[];
}
