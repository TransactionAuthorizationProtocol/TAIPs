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
  Kilogram = "KGM",
  Gram = "GRM",
  Milligram = "MGM",
  Tonne = "TNE",
  
  // Volume
  Liter = "LTR",
  Milliliter = "MLT",
  CubicMillimeter = "MMQ",
  CubicCentimeter = "CMQ",
  CubicDecimeter = "DMQ",
  CubicMeter = "MTQ",
  
  // Length
  Millimeter = "MMT",
  Centimeter = "CMT",
  Decimeter = "DMT",
  Meter = "MTR",
  Kilometer = "KMT",
  
  // Area
  SquareMeter = "MTK",
  
  // Count
  Each = "EA",
  Piece = "PCE",
  NumberOfPairs = "NPR",
  
  // Time
  Second = "SEC",
  Minute = "MIN",
  Hour = "HUR",
  Day = "DAY",
  Week = "WEE",
  Month = "MON",
  Year = "ANN",
  
  // Other
  KilowattHour = "KWH",
  NumberOfArticles = "NAR",
}

/**
 * UBL Tax Category Code standard (UN/ECE 5305 Tax Category Code)
 * Based on UN/CEFACT and EU tax categories
 * 
 * @see {@link http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/TaxCategory-2.1.gc | UBL Tax Category Codes}
 * @see {@link https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL5305/ | PEPPOL BIS 3.0 Tax Category Codes}
 */
export enum TaxCategoryCode {
  StandardRate = "S",
  ZeroRated = "Z",
  ExemptFromTax = "E",
  VATReverseCharge = "AE",
  FreeExportItem = "G",
  OutsideScopeOfTax = "O",
  VATExemptIntraCommunity = "K",
  CanaryIslandsIndirectTax = "L",
  CeutaMelillaTax = "M",
  HigherRate = "H",
  LowerRate = "AA",
  TransferredVAT = "B",
  MixedTaxRate = "A",
  ExemptForResale = "AB",
  VATReverseChargeAlt = "AC",
  VATExemptIntraCommunityAlt = "AD",
  ExemptFromTaxDeprecated = "C",
  ExemptArticle309 = "D",
}

/**
 * UBL Tax Scheme Code standard (UN/ECE 5305 Tax Type Code)
 * Based on UN/CEFACT tax types
 * 
 * @see {@link http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/TaxScheme-2.1.gc | UBL Tax Scheme Codes}
 */
export enum TaxSchemeCode {
  ProfitTax = "AAA",
  CorporateIncomeTax = "AAB",
  PersonalIncomeTax = "AAC",
  SocialSecurityTax = "AAD",
  PropertyTax = "AAE",
  InheritanceTax = "AAF",
  GiftTax = "AAG",
  CapitalGainsTax = "AAH",
  WealthTax = "AAI",
  StampDuty = "AAJ",
  ConsumptionTax = "CST",
  CustomsDuty = "CUS",
  EnvironmentalTax = "ENV",
  ExciseTax = "EXC",
  ExportTax = "EXP",
  FreightTax = "FRT",
  GoodsAndServicesTax = "GST",
  ImportTax = "IMP",
  OtherTax = "OTH",
  SalesTax = "SAL",
  TurnoverTax = "TOT",
  ValueAddedTax = "VAT",
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
   * @example TaxCategoryCode.StandardRate
   * @example TaxCategoryCode.ZeroRated
   * @example TaxCategoryCode.ExemptFromTax
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
   * @example TaxSchemeCode.ValueAddedTax
   * @example TaxSchemeCode.GoodsAndServicesTax
   * @example TaxSchemeCode.SalesTax
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
   * @example UnitCode.Each
   * @example UnitCode.Kilogram
   * @example UnitCode.Hour
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
