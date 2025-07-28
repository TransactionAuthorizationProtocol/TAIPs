// ISO 20022 External Purpose Codes and Category Purpose Codes
// Generated from external_purpose_code.json and external_category_purpose_code.json

/**
 * ISO 20022 External Purpose Code
 * Standardized code indicating the specific purpose of a financial transaction.
 * 
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
export type ExternalPurposeCode =
  /** Transaction moves funds between 2 accounts of same account holder at the same bank. */
  | "ACCT"
  /** Payments for donation, sponsorship, advisory, intellectual and other copyright services. */
  | "ADCS"
  /** Transaction is related to a payment associated with administrative management. */
  | "ADMG"
  /** Transaction is an advance payment. */
  | "ADVA"
  /** Payment concerning active employment policy. */
  | "AEMP"
  /** Transaction is related to the agricultural domain. */
  | "AGRT"
  /** Transaction is a payment for air transport related business. */
  | "AIRB"
  /** Transaction is the payment of allowances. */
  | "ALLW"
  /** Transaction is the payment of alimony. */
  | "ALMY"
  /** Card Settlement-Settlement of AMEX transactions. */
  | "AMEX"
  /** Transaction settles annuity related to credit, insurance, investments, other. */
  | "ANNI"
  /** Transaction is a payment for anesthesia services. */
  | "ANTS"
  /** Transaction is related to a payment associated with an Account Receivable Entry */
  | "AREN"
  /** Utilities-Settlement of Authenticated Collections transactions. */
  | "AUCO"
  /** US mutual fund trailer fee (12b-1) payment */
  | "B112"
  /** Transaction is related to a payment made as incentive to encourage parents to have more children */
  | "BBSC"
  /** Transaction is the payment of a domestic bearer cheque. */
  | "BCDM"
  /** Transaction is the payment of a foreign bearer cheque. */
  | "BCFG"
  /** Transaction is related to a payment made to assist parent/guardian to maintain child. */
  | "BECH"
  /** Transaction is related to a payment to a person who is unemployed/disabled. */
  | "BENE"
  /** Transaction is related to a payment of business expenses. */
  | "BEXP"
  /** Cash collateral related to any securities traded out beyond 3 days which include treasury notes, JGBs and Gilts. */
  | "BFWD"
  /** Delayed draw funding. Certain issuers may utilize delayed draw loans whereby the lender is committed to fund cash within a specified period once a call is made by the issuer. The lender receives a fee for entering into such a commitment */
  | "BKDF"
  /** Bank loan fees. Cash activity related to specific bank loan fees, including (a) agent / assignment fees; (b) amendment fees; (c) commitment fees; (d) consent fees; (e) cost of carry fees; (f) delayed compensation fees; (g) facility fees; (h) fronting fees; (i) funding fees; (j) letter of credit assignment fees */
  | "BKFE"
  /** Bank loan funding memo. Net cash movement for the loan contract final notification when sent separately from the loan contract final notification instruction. */
  | "BKFM"
  /** Accrued interest payments. Specific to bank loans. */
  | "BKIP"
  /** Principal paydowns. Specific to bank loans */
  | "BKPP"
  /** Transaction is related to a payment associated with building maintenance. */
  | "BLDM"
  /** Bond Forward pair-off cash net movement */
  | "BNET"
  /** Transaction is related to a payment associated with a Back Office Conversion Entry */
  | "BOCE"
  /** Securities Lending-Settlement of Bond transaction. */
  | "BOND"
  /** Transaction is related to payment of a bonus. */
  | "BONU"
  /** US mutual fund trailer fee (12b-1) rebate payment */
  | "BR12"
  /** Transaction is a payment for bus transport related business. */
  | "BUSB"
  /** Securities Lending-Settlement of Corporate Actions: Bonds transactions. */
  | "CABD"
  /** Securities Lending-Settlement of Corporate Actions: Equities transactions. */
  | "CAEQ"
  /** Transaction is the payment of custodian account management fee where custodian bank and current account servicing bank coincide */
  | "CAFI"
  /** Transaction is a general cash management instruction. */
  | "CASH"
  /** Card Settlement-Settlement of Credit Card transactions. */
  | "CBCR"
  /** Transaction is related to capital building fringe fortune, ie capital building in general */
  | "CBFF"
  /** Transaction is related to capital building fringe fortune for retirement */
  | "CBFR"
  /** A Service that is settling money for a bulk of card transactions, while referring to a specific transaction file or other information like terminal ID, card acceptor ID or other transaction details. */
  | "CBLK"
  /** Transaction is related to a payment of cable TV bill. */
  | "CBTV"
  /** Payments made by Government institute related to cash compensation, helplessness, disability. These payments are made by the Government institution as a social benefit in addition to regularly paid salary or pension. */
  | "CCHD"
  /** Cash Collateral related to a Cross Currency Interest Rate Swap, indicating the exchange of fixed interest payments in one currency for those in another. */
  | "CCIR"
  /** Cash Collateral associated with an ISDA or Central Clearing Agreement that is covering the initial margin requirements for OTC trades clearing through a CCP. */
  | "CCPC"
  /** Cash Collateral associated with an ISDA or Central Clearing Agreement that is covering the variation margin requirements for OTC trades clearing through a CCP. */
  | "CCPM"
  /** Transaction is related to a payment of credit card account. */
  | "CCRD"
  /** CCP Segregated initial margin: Initial margin on OTC Derivatives cleared through a CCP that requires segregation */
  | "CCSM"
  /** Transaction is related to a payment of credit card bill. */
  | "CDBL"
  /** Purchase of Goods and Services with additional Cash disbursement at the POI (Cashback) */
  | "CDCB"
  /** ATM Cash Withdrawal in an unattended or Cash Advance in an attended environment (POI or bank counter) */
  | "CDCD"
  /** ATM Cash Withdrawal in an unattended or Cash Advance in an attended environment (POI or bank counter) with surcharging. */
  | "CDCS"
  /** A combined service which enables the card acceptor to perform an authorisation for a temporary amount and a completion for the final amount within a limited time frame. Deferred Payment is only available in the unattended environment. Examples where this service is widely used are unattended petrol pumps and phone booths */
  | "CDDP"
  /** Payment related to a credit default event */
  | "CDEP"
  /** A service which allows the card acceptor to effect a credit to a cardholder' account. Unlike a Merchant Refund, an Original Credit is not preceded by a card payment. This service is used for example for crediting winnings from gaming. */
  | "CDOC"
  /** Purchase of Goods which are equivalent to cash like coupons in casinos. */
  | "CDQC"
  /** Transaction is the payment of capital falling due where custodian bank and current account servicing bank coincide */
  | "CFDI"
  /** Transaction is related to a payment of cancellation fee. */
  | "CFEE"
  /** Transaction is related to a direct debit where the mandate was generated by using data from a payment card at the point of sale. */
  | "CGDD"
  /** Transaction is a payment for charity reasons. */
  | "CHAR"
  /** Transaction is a payment of car loan principal payment. */
  | "CLPR"
  /** Transaction is payment of commodities. */
  | "CMDT"
  /** Transaction is a collection of funds initiated via a credit transfer or direct debit. */
  | "COLL"
  /** Transaction is related to a payment of commercial credit or debit. (formerly CommercialCredit) */
  | "COMC"
  /** Transaction is payment of commission. */
  | "COMM"
  /** Transaction is related to the payment of a compensation relating to interest loss/value date adjustment and can include fees. */
  | "COMP"
  /** Transaction is a payment used by a third party who can collect funds to pay on behalf of consumers, ie credit counseling or bill payment companies. */
  | "COMT"
  /** Transaction is related to settlement of a trade, e.g. a foreign exchange deal or a securities transaction. */
  | "CORT"
  /** Transaction is related to payment of costs. */
  | "COST"
  /** Cash penalties related to securities transaction, including CSDR Settlement Discipline Regime. */
  | "CPEN"
  /** Transaction is related to carpark charges. */
  | "CPKC"
  /** Transaction is payment of copyright. */
  | "CPYR"
  /** Cash collateral related to trading of credit default swap. */
  | "CRDS"
  /** Cash collateral related to a combination of various types of trades. */
  | "CRPR"
  /** Cash collateral related to cash lending/borrowing; letter of Credit; signing of master agreement. */
  | "CRSP"
  /** Cash collateral related to opening of a credit line before trading. */
  | "CRTL"
  /** Transaction is related to cash disbursement. */
  | "CSDB"
  /** Transaction is a payment by a company to a bank for financing social loans to employees. */
  | "CSLP"
  /** Transaction is a payment for convalescence care facility services. */
  | "CVCF"
  /** Card Settlement-Settlement of Debit Card transactions. */
  | "DBCR"
  /** Collection of funds initiated via a debit transfer. */
  | "DBTC"
  /** Transaction is related to a debit card payment. */
  | "DCRD"
  /** Purpose of payment is the settlement of charges payable by the debtor in relation to an underlying customer credit transfer. */
  | "DEBT"
  /** Transaction is related to a payment concerning dependent support, for example child support or support for a person substantially financially dependent on the support provider. */
  | "DEPD"
  /** Transaction is releted to a payment of deposit. */
  | "DEPT"
  /** Transaction is related to a derivatives transaction */
  | "DERI"
  /** Card Settlement-Settlement of Diners transactions. */
  | "DICL"
  /** Transaction is payment of dividends. */
  | "DIVD"
  /** Transaction is a payment is for use of durable medical equipment. */
  | "DMEQ"
  /** Transaction is a payment for dental services. */
  | "DNTS"
  /** Transaction is the payment of a disbursement due to a specific type of printed order for a payment of a specified sum, issued by a bank or a post office (Zahlungsanweisung zur Verrechnung) */
  | "DSMT"
  /** Code used to pre-advise the account servicer of a forthcoming deliver against payment instruction. */
  | "DVPM"
  /** E-Commerce payment with payment guarantee of the issuing bank. */
  | "ECPG"
  /** E-Commerce payment return. */
  | "ECPR"
  /** E-Commerce payment without payment guarantee of the issuing bank. */
  | "ECPU"
  /** Transaction is related to a payment of study/tuition fees. */
  | "EDUC"
  /** Utilities-Settlement of Low value Credit transactions. */
  | "EFTC"
  /** Utilities-Settlement of Low value Debit transactions. */
  | "EFTD"
  /** Transaction is related to a payment of electricity bill. */
  | "ELEC"
  /** Transaction is related to a utility operation. */
  | "ENRG"
  /** Transaction is related to ePayment. */
  | "EPAY"
  /** Cash collateral related to trading of equity option (Also known as stock options). */
  | "EQPT"
  /** Securities Lending-Settlement of Equities transactions. */
  | "EQTS"
  /** Cash collateral related to equity swap trades where the return of an equity is exchanged for either a fixed or a floating rate of interest. */
  | "EQUS"
  /** Transaction is related to a payment of estate tax. */
  | "ESTX"
  /** Transaction is related to a Service that is first reserving money from a card account and then is loading an e-purse application by this amount. */
  | "ETUP"
  /** Cash collateral related to trading of an exotic option for example a non-standard option. */
  | "EXPT"
  /** Cash collateral related to trading of exchanged traded derivatives in general (Opposite to Over the Counter (OTC)). */
  | "EXTD"
  /** Payment related to a factor update */
  | "FACT"
  /** Financial aid by State authorities for abolition of consequences of natural disasters. */
  | "FAND"
  /** A Service that is settling card transaction related fees between two parties. */
  | "FCOL"
  /** Transaction is the payment for late fees & charges. E.g Credit card charges */
  | "FCPM"
  /** Payment of fees/charges. */
  | "FEES"
  /** Transaction is a payment for ferry related business. */
  | "FERB"
  /** Cash collateral related to a fixed income instrument */
  | "FIXI"
  /** Card Settlement-Settlement of Fleet transactions. */
  | "FLCR"
  /** Cash associated with a netting of futures payments. Refer to CCPM codeword for netting of initial and variation margin through a CCP */
  | "FNET"
  /** FX trades with a value date in the future. */
  | "FORW"
  /** Transaction is related to a foreign exchange operation. */
  | "FREX"
  /** Cash related to futures trading activity. */
  | "FUTR"
  /** Cash collateral payment against a Master Forward Agreement (MFA) where the cash is held in a segregated account and is not available for use by the client. Includes any instruments with a forward settling date such TBAs, repurchase agreements and bond forwards */
  | "FWBC"
  /** Cash collateral payment against a Master Forward Agreement (MFA) where the cash is owned and may be used by the client when returned. Includes any instruments with a forward settling date such TBAs, repurchase agreements and bond forwards */
  | "FWCC"
  /** Transaction is related to a payment of Foreign Worker Levy */
  | "FWLV"
  /** Any cash payment related to the collateral for a Master Agreement forward, which is segregated, and not available for use by the client. Example master agreement forwards include TBA, repo and Bond Forwards. */
  | "FWSB"
  /** Any cash payment related to the collateral for a Master agreement forward, which is owned by the client and is available for use by the client when it is returned to them from the segregated account. Example master agreement forwards include TBA, repo and Bond Forwards. */
  | "FWSC"
  /** FX netting if cash is moved by separate wire instead of within the closing FX instruction */
  | "FXNT"
  /** Salary and Benefits-Allowance from government to support family. */
  | "GAFA"
  /** Salary and Benefits-Allowance from government to individuals to support payments of housing. */
  | "GAHO"
  /** General-Payments towards a purchase or winnings received from gambling, betting or other wagering activities. */
  | "GAMB"
  /** Transaction is related to a payment of gas bill. */
  | "GASB"
  /** Transaction is related to purchase and sale of goods. */
  | "GDDS"
  /** Transaction is related to purchase and sale of goods and services. */
  | "GDSV"
  /** Compensation to unemployed persons during insolvency procedures. */
  | "GFRP"
  /** Payment with no commercial or statutory purpose. */
  | "GIFT"
  /** Transaction is related to a payment of government insurance. */
  | "GOVI"
  /** Transaction is a payment to or from a government department. */
  | "GOVT"
  /** Transaction is related to purchase and sale of goods and services with cash back. */
  | "GSCB"
  /** Transaction is the payment of Goods & Services Tax */
  | "GSTX"
  /** Transaction is payment to category A Austrian government employees. */
  | "GVEA"
  /** Transaction is payment to category B Austrian government employees. */
  | "GVEB"
  /** Transaction is payment to category C Austrian government employees. */
  | "GVEC"
  /** Transaction is payment to category D Austrian government employees. */
  | "GVED"
  /** Payment to victims of war violence and to disabled soldiers. */
  | "GWLT"
  /** Transaction is related to a hedging operation. */
  | "HEDG"
  /** Transaction is related to a payment of property loan. */
  | "HLRP"
  /** Transaction is related to the settlement of a property loan. */
  | "HLST"
  /** Transaction is a payment for home health care services. */
  | "HLTC"
  /** Transaction is a payment of health insurance. */
  | "HLTI"
  /** Transaction is a contribution by an employer to the housing expenditures (purchase, construction, renovation) of the employees within a tax free fringe benefit system */
  | "HREC"
  /** Transaction is a payment for hospital care services. */
  | "HSPC"
  /** Transaction is related to a payment of housing tax. */
  | "HSTX"
  /** Transaction is reimbursement of credit card payment. */
  | "ICCP"
  /** Transaction is a payment for intermediate care facility services. */
  | "ICRF"
  /** Transaction is reimbursement of debit card payment. */
  | "IDCP"
  /** Transaction is payment for an installment/hire-purchase agreement. */
  | "IHRP"
  /** Transaction is a payment of car insurance premium. */
  | "INPC"
  /** Transaction is related to an insurance premium refund. */
  | "INPR"
  /** Transaction is related to the payment of an insurance claim. */
  | "INSC"
  /** Transaction is related to a payment of an installment. */
  | "INSM"
  /** Transaction is payment of an insurance premium. */
  | "INSU"
  /** Transaction is an intra-company payment, ie, a payment between two companies belonging to the same group. */
  | "INTC"
  /** Transaction is payment of interest. */
  | "INTE"
  /** Transaction is a payment between two accounts belonging to the same party (intra-party payment), where party is a natural person (identified by a private ID, not organisation ID). */
  | "INTP"
  /** Transaction is related to a payment of income tax. */
  | "INTX"
  /** Transaction is for the payment of mutual funds, investment products and shares */
  | "INVS"
  /** Transaction in which the amount is available to the payee immediately. */
  | "IPAY"
  /** Transaction in which the Return of the amount is fully returned. */
  | "IPCA"
  /** Transaction in which the amount is available to the payee immediately, done for donations, with sending the address data of the payer. */
  | "IPDO"
  /** Transaction in which the amount is available to the payee immediately, done in E-commerce, without sending the address data of the payer. */
  | "IPEA"
  /** Transaction in which the amount is available to the payee immediately, done in E-commerce, with sending the address data of the payer. */
  | "IPEC"
  /** Transaction in which the amount is available to the payee immediately, done in E-commerce. */
  | "IPEW"
  /** Transaction in which the amount is available to the payee immediately, done at POS. */
  | "IPPS"
  /** Transaction in which the Return of the amount is fully or partial returned. */
  | "IPRT"
  /** Transaction is made via an unattending vending machine by using 2-factor-authentification. */
  | "IPU2"
  /** Transaction is made via an unattending vending machine by without using 2-factor-authentification. */
  | "IPUW"
  /** Transaction is the payment for invoices. */
  | "IVPT"
  /** Net payment related to a buy-in. When an investment manager is bought in on a sell trade that fails due to a failed securities lending recall, the IM may seize the underlying collateral to pay for the buy-in. Any difference between the value of the collateral and the sell proceeds would be paid or received under this code */
  | "LBIN"
  /** Transaction is a payment of labor insurance. */
  | "LBRI"
  /** Free movement of cash collateral. Cash collateral paid by the borrower is done separately from the delivery of the shares at loan opening or return of collateral done separately from return of the loaned security. Note: common when the currency of the security is different the currency of the cash collateral. */
  | "LCOL"
  /** Fee payments, other than rebates, for securities lending. Includes (a) exclusive fees; (b) transaction fees; (c) custodian fees; (d) minimum balance fees */
  | "LFEE"
  /** Transaction is payment of a license fee. */
  | "LICF"
  /** Transaction is a payment of life insurance. */
  | "LIFI"
  /** Bank initiated account transfer to support zero target balance management, pooling or sweeping. */
  | "LIMA"
  /** Cash collateral payments resulting from the marked-to-market of a portfolio of loaned equity securities */
  | "LMEQ"
  /** Cash collateral payments resulting from the marked-to-market of a portfolio of loaned fixed income securities */
  | "LMFI"
  /** Cash collateral payments resulting from the marked-to-market of a portfolio of loaned securities where the instrument types are not specified */
  | "LMRK"
  /** Transaction is related to transfer of loan to borrower. */
  | "LOAN"
  /** Transaction is related to repayment of loan to lender. */
  | "LOAR"
  /** General-Payment towards a purchase or winnings received from lottery activities. */
  | "LOTT"
  /** Securities lending rebate payments */
  | "LREB"
  /** Revenue payments made by the lending agent to the client */
  | "LREV"
  /** Payments made by a borrower to a lending agent to satisfy claims made by the investment manager related to sell fails from late loan recall deliveries */
  | "LSFL"
  /** Transaction is a payment for long-term care facility services. */
  | "LTCF"
  /** Transaction is contribution to medical aid fund. */
  | "MAFC"
  /** Transaction is related to a medical aid refund. */
  | "MARF"
  /** Daily margin on listed derivatives – not segregated as collateral associated with an FCM agreement. Examples include listed futures and options margin payments; premiums for listed options not covered in the MT54X message */
  | "MARG"
  /** MBS Broker Owned Segregated (40Act/Dodd Frank) Cash Collateral - Any cash payment related to the collateral for a Mortgage Back Security, which is segregated, and not available for use by the client. */
  | "MBSB"
  /** MBS Client Owned Cash Segregated (40Act/Dodd Frank) Cash Collateral - Any cash payment related to the collateral for a Mortgage Back Security, which is owned by the client and is available for use by the client when it is returned to them from the segregated account */
  | "MBSC"
  /** Transaction is the payment of a domestic multi-currency cheque */
  | "MCDM"
  /** Transaction is the payment of a foreign multi-currency cheque */
  | "MCFG"
  /** Transaction is a payment for medical care services. */
  | "MDCS"
  /** Initial futures margin. Where such payment is owned by the client and is available for use by them on return */
  | "MGCC"
  /** Margin Client Owned Segregated Cash Collateral - Any cash payment related to the collateral for initial futures margin, which is owned by the client and is available for use by the client when it is returned to them from the segregated account. */
  | "MGSC"
  /** Securities Lending-ettlement of Money Market PCH. */
  | "MOMA"
  /** A service which enables a user to use an app on its mobile to pay a merchant or other business payees by initiating a payment message. Within this context, the account information or an alias of the payee might be transported through different channels to the app, for example QR Code, NFC, Bluetooth, other Networks. */
  | "MP2B"
  /** A service which enables a user to use an app on its mobile to initiate moving funds from his/her bank account to another person's bank account while not using the account number but an alias information like an MSISDN as account addressing information in his/her app. */
  | "MP2P"
  /** Transaction is related to a payment for multiple service types. */
  | "MSVC"
  /** A Service that is first reserving money from a card account and then is loading a prepaid mobile phone amount by this amount. */
  | "MTUP"
  /** Transaction is related to a netting operation. */
  | "NETT"
  /** Transaction is related to a payment of net income tax. */
  | "NITX"
  /** Transaction is related to a payment for type of services not specified elsewhere. */
  | "NOWS"
  /** Transaction is related to a payment of network charges. */
  | "NWCH"
  /** Transaction is related to a payment of network communication. */
  | "NWCM"
  /** Client owned collateral identified as eligible for OCC pledging */
  | "OCCC"
  /** Transaction is the payment of a domestic order cheque */
  | "OCDM"
  /** Transaction is the payment of a foreign order cheque */
  | "OCFG"
  /** Transaction is related to a payment of opening fee. */
  | "OFEE"
  /** Cash collateral payment for OTC options associated with an FCM agreement. Where such payment is segregated and not available for use by the client */
  | "OPBC"
  /** Cash collateral payment for OTC options associated with an FCM agreement. Where such payment is not segregated and is available for use by the client upon return */
  | "OPCC"
  /** Option Broker Owned Segregated Cash Collateral - Any cash payment related to the collateral for an OTC option, which is segregated, and not available for use by the client. */
  | "OPSB"
  /** Option Client Owned Cash Segregated Cash Collateral - Any cash payment related to the collateral for an OTC option, which is owned by the client and is available for use by the client when it is returned to them from the segregated account */
  | "OPSC"
  /** Cash collateral related to trading of option on Foreign Exchange. */
  | "OPTN"
  /** Cash collateral related to Over-the-counter (OTC) Derivatives in general for example contracts which are traded and privately negotiated. */
  | "OTCD"
  /** Other payment purpose. */
  | "OTHR"
  /** Transaction is related to a payment of other telecom related bill. */
  | "OTLC"
  /** Transaction is related to a pre-authorized debit origination */
  | "PADD"
  /** Transaction is related to the payment of payroll. */
  | "PAYR"
  /** Final payment to complete the purchase of a property. */
  | "PCOM"
  /** Payment of the deposit required towards purchase of a property. */
  | "PDEP"
  /** Transaction is contribution to pension fund. */
  | "PEFC"
  /** Payment based on enforcement orders except those arising from judicial alimony decrees. */
  | "PENO"
  /** Transaction is the payment of pension. */
  | "PENS"
  /** Transaction is related to a payment of telephone bill. */
  | "PHON"
  /** Payment of funds from a lender as part of the issuance of a property loan. */
  | "PLDS"
  /** Transfer or extension of a property financing arrangement to a new deal or loan provider, without change of ownership of property. */
  | "PLRF"
  /** Transaction is related to a payment associated with a Point of Purchase Entry. */
  | "POPE"
  /** Transaction is a payment of property insurance. */
  | "PPTI"
  /** Transaction is related to a payment of a price. */
  | "PRCP"
  /** Transaction is related to a precious metal operation. */
  | "PRME"
  /** Transaction is related to payment terms specifications */
  | "PTSP"
  /** Transaction is related to a payment of property tax. */
  | "PTXP"
  /** Instant Payments-Settlement of Rapid Payment Instruction (RPI) transactions. */
  | "RAPI"
  /** Transaction is related to a payment associated with a re-presented check entry */
  | "RCKE"
  /** Transaction is related to a payment of receipt. */
  | "RCPT"
  /** Transaction is related to a payment of road tax. */
  | "RDTX"
  /** Transaction is the payment of a rebate. */
  | "REBT"
  /** Transaction is the payment of a refund. */
  | "REFU"
  /** Transaction is for general rental/lease. */
  | "RELG"
  /** Transaction is the payment of rent. */
  | "RENT"
  /** Transaction is for account overdraft repayment */
  | "REOD"
  /** Cash collateral related to a repurchase agreement transaction. */
  | "REPO"
  /** Retail payment including e-commerce and online shopping. */
  | "RETL"
  /** Benefit for the duration of occupational rehabilitation. */
  | "RHBS"
  /** Transaction is related to a reimbursement of a previous erroneous transaction. */
  | "RIMB"
  /** Transaction is related to a payment of a recurring installment made at regular intervals. */
  | "RINP"
  /** Transaction is a payment for railway transport related business. */
  | "RLWY"
  /** Utilities-Settlement of Unauthenticated Collections transactions. */
  | "RMCO"
  /** Transaction is the payment of royalties. */
  | "ROYA"
  /** Bi-lateral repo broker owned collateral associated with a repo master agreement – GMRA or MRA Master Repo Agreements */
  | "RPBC"
  /** Repo client owned collateral associated with a repo master agreement – GMRA or MRA Master Repo Agreements */
  | "RPCC"
  /** Bi-lateral repo interest net/bulk payment at rollover/pair-off or other closing scenarios where applicable */
  | "RPNT"
  /** Bi-lateral repo broker owned segregated cash collateral associated with a repo master agreement */
  | "RPSB"
  /** Repo client owned segregated collateral associated with a repo master agreement */
  | "RPSC"
  /** Cash payment resulting from a Round Robin */
  | "RRBN"
  /** Transaction is related to a reimbursement for commercial reasons of a correctly received credit transfer. */
  | "RRCT"
  /** Transaction is related to a Request to Pay. */
  | "RRTP"
  /** Code used to pre-advise the account servicer of a forthcoming receive against payment instruction. */
  | "RVPM"
  /** Cash collateral related to a reverse repurchase agreement transaction. */
  | "RVPO"
  /** Transaction is the payment of salaries. */
  | "SALA"
  /** Card Settlement-Settlement of ATM transactions. */
  | "SASW"
  /** Transfer to / from savings or to retirement account. */
  | "SAVG"
  /** Cash collateral related to a Securities Buy Sell Sell Buy Back */
  | "SBSC"
  /** Cash collateral related to Exotic single currency interest rate swap. */
  | "SCIE"
  /** Cash collateral related to Single Currency Interest Rate Swap. */
  | "SCIR"
  /** Cash collateral related to Combination of securities-related exposure types. */
  | "SCRP"
  /** Transaction is related to purchase and sale of services. */
  | "SCVE"
  /** Transaction is the payment of securities. */
  | "SECU"
  /** Transaction is the payment of a purchase of securities where custodian bank and current account servicing bank coincide */
  | "SEPI"
  /** Transaction is related to service charges charged by a service provider. */
  | "SERV"
  /** Short Sale broker owned collateral associated with a prime broker agreement */
  | "SHBC"
  /** Short Sale client owned collateral associated with a prime brokerage agreement */
  | "SHCC"
  /** Cash Collateral related to a Short Sell */
  | "SHSL"
  /** Cash collateral related to Securities lending and borrowing. */
  | "SLEB"
  /** Cash collateral related to a Secured loan. */
  | "SLOA"
  /** Transaction is payment of a well formatted payment slip. */
  | "SLPI"
  /** Split payments. To be used when cash and security movements for a security trade settlement are instructed separately. */
  | "SPLT"
  /** Salary or pension payment for more months in one amount or a delayed payment of salaries or pensions. */
  | "SPSP"
  /** Transaction is a social security benefit, ie payment made by a government to support individuals. */
  | "SSBE"
  /** Transaction is related to a payment of study/tuition costs. */
  | "STDY"
  /** Transaction is related to a payment of information or entertainment services either in printed or electronic form. */
  | "SUBS"
  /** Transaction is related to a payment to a supplier. */
  | "SUPP"
  /** Cash collateral payment for swaps associated with an ISDA agreement. . Where such payment is segregated and not available for use by the client. Includes any cash collateral payments made under the terms of a CSA agreement for instruments such as swaps and FX forwards. */
  | "SWBC"
  /** Cash collateral payment for swaps associated with an ISDA agreement. Where such payment is not segregated and is available for use by the client upon return. Includes any cash collateral payments made under the terms of a CSA agreement for instruments such as swaps and FX forwards. */
  | "SWCC"
  /** Final payments for a swap contract */
  | "SWFP"
  /** Partial payment for a swap contract */
  | "SWPP"
  /** Cash collateral related to an option on interest rate swap. */
  | "SWPT"
  /** Reset payment for a swap contract */
  | "SWRS"
  /** Swaps Broker Owned Segregated Cash Collateral - Any cash payment related to the collateral for Swap margin , which is segregated, and not available for use by the client. This includes any collateral identified in a CSA agreement such as Swap or FX Forward collateral. */
  | "SWSB"
  /** Swaps Client Owned Segregated Cash Collateral - Any cash payment related to the collateral for Swap margin, which is owned by the client and is available for use by the client when returned from the segregated account. This includes any collateral identified in a CSA agreement such as Swap or FX Forward collateral. */
  | "SWSC"
  /** Upfront payment for a swap contract */
  | "SWUF"
  /** Transaction is the refund of a tax payment or obligation. */
  | "TAXR"
  /** Transaction is the payment of taxes. */
  | "TAXS"
  /** TBA pair-off cash wire net movement */
  | "TBAN"
  /** Cash collateral related to a To Be Announced (TBA) */
  | "TBAS"
  /** Cash collateral payment (segregated) for TBA securities associated with a TBA Master Agreement. Where such payment is segregated and not available for use by the client. */
  | "TBBC"
  /** Cash collateral payment (for use by client)for TBA securities associated with a TBA Master Agreement. Where such payment is not segregated and is available for use by the client upon return. */
  | "TBCC"
  /** Transaction is related to a payment of telecommunications related bill. */
  | "TBIL"
  /** Transaction is related to a payment associated with charges levied by a town council. */
  | "TCSC"
  /** Transaction is related to a payment initiated via telephone. */
  | "TELI"
  /** Any non-US mutual fund trailer fee (retrocession) payment (use ISIN to determine onshore versus offshore designation) */
  | "TLRF"
  /** Any non-US mutual fund trailer fee (retrocession) rebate payment (use ISIN to determine onshore versus offshore designation) */
  | "TLRR"
  /** Cash payment resulting from a TMPG Claim */
  | "TMPG"
  /** Tri-Party Repo related interest */
  | "TPRI"
  /** Tri-party Repo related net gain/loss cash movement */
  | "TPRP"
  /** Transaction is related to a trade services operation. */
  | "TRAD"
  /** Cash collateral related to a combination of treasury-related exposure types. */
  | "TRCP"
  /** Transaction is related to treasury operations. */
  | "TREA"
  /** Transaction is related to a payment of a trust fund. */
  | "TRFD"
  /** Transaction is payment of a beneficiary prefilled payment slip where beneficiary to payer information is truncated. */
  | "TRNC"
  /** Transaction is for the payment to top-up pre-paid card and electronic road pricing for the purpose of transportation */
  | "TRPT"
  /** Transaction is the payment of a travellers cheque */
  | "TRVC"
  /** Transaction is for the payment to common utility provider that provide gas, water and/or electricity. */
  | "UBIL"
  /** Transaction is purchase of Unit Trust */
  | "UNIT"
  /** Transaction is the payment of value added tax. */
  | "VATX"
  /** Transaction is a payment for vision care services. */
  | "VIEW"
  /** Transaction is related to a payment initiated via internet. */
  | "WEBI"
  /** Transaction is related to a payment of withholding tax. */
  | "WHLD"
  /** Transaction is related to a payment of water bill. */
  | "WTER";

/**
 * ISO 20022 External Category Purpose Code  
 * High-level classification of the purpose of a financial transaction.
 *
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
export type ExternalCategoryPurposeCode =
  /** Transaction is the payment of a bonus. */
  | "BONU"
  /** Transaction is a general cash management instruction. */
  | "CASH"
  /** A service that is settling money for a bulk of card transactions, while referring to a specific transaction file or other information like terminal ID, card acceptor ID or other transaction details. */
  | "CBLK"
  /** Transaction is related to a payment of credit card. */
  | "CCRD"
  /** Transaction is a payment towards a Party for the collection of cash by the Cash in Transit company. */
  | "CGWV"
  /** Transaction is a direct debit for a cash order of notes and/or coins. */
  | "CIPC"
  /** Transaction is a direct debit for a cash order of notes and/or coins. */
  | "CONC"
  /** Transaction is related to settlement of a trade, eg a foreign exchange deal or a securities transaction. */
  | "CORT"
  /** Cross border transaction initiated by US natural person that is subject to compliance with Dodd Frank 1073. */
  | "CTDF"
  /** Transaction is related to a payment of debit card. */
  | "DCRD"
  /** Transaction is the payment of dividends. */
  | "DIVI"
  /** Code used to pre-advise the account servicer of a forthcoming deliver against payment instruction. */
  | "DVPM"
  /** Transaction is related to ePayment. */
  | "EPAY"
  /** Foreign Currency Transaction that is processed between two domestic financial institutions. */
  | "FCDT"
  /** Transaction is related to the payment of a fee and interest. */
  | "FCIN"
  /** A service that is settling card transaction related fees between two parties. */
  | "FCOL"
  /** Transaction is a payment to or from a government department. */
  | "GOVT"
  /** General Person-to-Person Payment. Debtor and Creditor are natural persons. */
  | "GP2P"
  /** Transaction is related to the payment of a hedging operation. */
  | "HEDG"
  /** Transaction is reimbursement of credit card payment. */
  | "ICCP"
  /** Transaction is reimbursement of debit card payment. */
  | "IDCP"
  /** Transaction is an intra-company payment, ie, a payment between two companies belonging to the same group. */
  | "INTC"
  /** Transaction is the payment of interest. */
  | "INTE"
  /** Transaction is related to identify cash handling via Night Safe or Lockbox by bank or vendor on behalf of a physical store. */
  | "LBOX"
  /** Transaction is related to the transfer of a loan to a borrower. */
  | "LOAN"
  /** Mobile P2B Payment */
  | "MP2B"
  /** Mobile P2P Payment */
  | "MP2P"
  /** Other payment purpose. */
  | "OTHR"
  /** Transaction is the payment of pension. */
  | "PENS"
  /** Collection used to re-present previously reversed or returned direct debit transactions. */
  | "RPRE"
  /** Transaction is related to a reimbursement for commercial reasons of a correctly received credit transfer. */
  | "RRCT"
  /** Code used to pre-advise the account servicer of a forthcoming receive against payment instruction. */
  | "RVPM"
  /** Transaction is the payment of salaries. */
  | "SALA"
  /** Transfer to / from savings or to retirement account. */
  | "SAVG"
  /** Transaction is the payment of securities. */
  | "SECU"
  /** Transaction is a social security benefit, ie payment made by a government to support individuals. */
  | "SSBE"
  /** Transaction is related to a payment to a supplier. */
  | "SUPP"
  /** Classification: Cash Management. Transaction relates to a cash management instruction, requesting a sweep of the account of the Debtor above an agreed floor amount, up to a target or zero balance. The purpose is to move the funds from multiple accounts to a single bank account. Funds can move domestically or across border and more than one bank can be used. */
  | "SWEP"
  /** Transaction is the payment of taxes. */
  | "TAXS"
  /** Classification: Cash Management. Transaction relates to a cash management instruction, requesting to top the account of the Creditor above a certain floor amount, up to a target or zero balance. The floor amount, if not pre-agreed by the parties involved, may be specified. */
  | "TOPG"
  /** Transaction is related to the payment of a trade finance transaction. */
  | "TRAD"
  /** Transaction is related to treasury operations. E.g. financial contract settlement. */
  | "TREA"
  /** Transaction is the payment of value added tax. */
  | "VATX"
  /** Transaction to be processed as a domestic payment instruction originated from a foreign bank. */
  | "VOST"
  /** Transaction is the payment of withholding tax. */
  | "WHLD"
  /** Transaction relates to a cash management instruction, requesting to zero balance the account of the Debtor. Zero Balance Accounts empty or fill the balances in accounts at the same bank, in the same country into or out of a main account each day. */
  | "ZABA";

/**
 * ISO 20022 External Purpose Code type
 * Union type of all possible purpose code values.
 */
export type PurposeCode = ExternalPurposeCode;

/**
 * ISO 20022 External Category Purpose Code type  
 * Union type of all possible category purpose code values.
 */
export type CategoryPurposeCode = ExternalCategoryPurposeCode;