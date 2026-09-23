// Mocked but realistic UK visa data — hardcoded per PRD Section 6.
export const UK_VISA_DATA = {
  name: 'UK Standard Visitor Visa',
  type: 'Standard Visitor',
  purposes: ['Tourism', 'Business', 'Family Visit', 'Student Visitor'],
  fee: {
    standard: '£135',
    priority: '£500 (in addition to the standard fee)',
  },
  // Only the FEE figures below were checked against official GOV.UK sources
  // (Home Office immigration and nationality fees tables, 8 April 2026; visit
  // visa fees are unchanged in the 8 October 2026 table). Everything else in
  // this file — documents, processing times, validity, community insights,
  // updates — is prototype data and has not been re-verified.
  feesCheckedOn: '23 September 2026',
  processing: {
    standard: '3 weeks',
    priority: '5 working days',
  },
  validity: 'Up to 6 months per visit',
  entry: 'Multiple entry (up to 10 years)',
  // Single source of truth for the AI Copilot's system prompt (see
  // src/api/copilot.js) — grounds fee answers in this exact data instead of
  // the model's own (sometimes stale) training-data memory. Keep in sync
  // with overviewByPurpose above; there is deliberately one place to edit
  // fee numbers.
  feeTable: {
    standard: '£135',
    priority: '£500 in addition to the standard fee',
    longTerm: { twoYear: '£506', fiveYear: '£903', tenYear: '£1,128' },
    childDiscount: 'The GOV.UK fee table lists no separate reduced rate for children — children pay the same fee as adults',
    superPriority: '£1,000 in addition to the application fee (availability and timings vary — check GOV.UK)',
  },
  // Purpose-specific overview stats — realistic differences per visit type.
  overviewByPurpose: {
    Tourism: {
      fee: '£135',
      feeSub: 'priority service +£500',
      processing: '3 weeks',
      processingSub: 'standard · 5 working days priority',
      validity: 'Up to 6 months per visit',
      validitySub: 'long-term 2, 5 & 10-year visas available',
      entry: 'Multiple entry',
      entrySub: 'unlimited visits while the visa is valid',
      note: 'Peak season (May–August) processing regularly stretches to 5–6 weeks — apply at least 8 weeks before a summer trip.',
    },
    Business: {
      fee: '£135 single trip',
      feeSub: '£506 for a 2-year long-term multi-entry visa',
      processing: '3 weeks',
      processingSub: 'priority (5 working days) widely used for business',
      validity: 'Up to 6 months per visit',
      validitySub: '180 days maximum stay per entry',
      entry: 'Multiple entry',
      entrySub: 'frequent travellers: 2, 5 or 10-year visas (£506 / £903 / £1,128)',
      note: 'Permitted: meetings, conferences, site visits, negotiating contracts. Not permitted: paid work for a UK company or supplying services to UK clients.',
    },
    'Family Visit': {
      fee: '£135',
      feeSub: 'priority service +£500',
      processing: '3–4 weeks',
      processingSub: 'sponsor immigration-status checks can add time',
      validity: 'Up to 6 months per visit',
      validitySub: '10-year visa popular with parents of UK residents',
      entry: 'Multiple entry',
      entrySub: 'unlimited visits while the visa is valid',
      note: "UKVI verifies your sponsor's UK status (BRP, passport or settled status). Applications without sponsor proof are frequently refused.",
    },
    'Student Visitor': {
      fee: '£135',
      feeSub: '£228 for the 6–11 month Short-term Study visa',
      processing: '3 weeks',
      processingSub: 'standard · 5 working days priority',
      validity: 'Up to 6 months of study',
      validitySub: 'up to 11 months for English language courses',
      entry: 'Valid for the course period',
      entrySub: 're-apply for any further course of study',
      note: 'Courses up to 6 months run on the Standard Visitor visa. English language courses of 6–11 months need the separate Short-term Study visa (£228).',
    },
  },
  applicationCentre: 'VFS Global India',
  applicationOnline: 'GOV.UK (apply online before VFS appointment)',
  source: 'UK Home Office · GOV.UK · VFS Global India',
  sourceUrl: 'https://www.gov.uk/standard-visitor-visa',
  vfsUrl: 'https://www.vfsglobal.com/en/individuals/index.html',
  cities: [
    'Mumbai',
    'Delhi',
    'Chennai',
    'Bangalore',
    'Hyderabad',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Chandigarh',
    'Cochin',
  ],
  coreDocuments: [
    'Valid passport (must be valid for full duration of stay)',
    'Online UK visa application completed at GOV.UK',
    'Biometric enrollment confirmation (VFS Global appointment)',
    'Bank statements — last 6 months, showing consistent balance',
    'Employment letter (role, salary, leave approval on company letterhead)',
    'Salary slips — last 3 months',
    'Income Tax Returns — last 2 financial years',
    'Travel itinerary (flights + accommodation plan)',
    "Purpose of visit letter (written by applicant, in applicant's own words)",
    'Proof of strong ties to India (property documents, family, confirmed employment)',
  ],
  additionalDocuments: {
    Tourism: [
      'Hotel or Airbnb booking confirmations for entire UK stay',
      'Detailed day-by-day travel itinerary',
    ],
    Business: [
      'Invitation letter from UK company (company letterhead, signed)',
      'Business card or company ID',
    ],
    'Family Visit': [
      'Invitation letter from UK-based family member',
      'Proof of relationship (birth/marriage certificate)',
      "Sponsor's UK immigration status (BRP, passport, or settled status letter)",
    ],
    'Student Visitor': [
      'Course acceptance letter or Confirmation of Acceptance for Studies (CAS)',
      'Proof of course fees paid or financial sponsorship letter',
    ],
  },
  rejectionReasons: [
    { source: 'verified', text: 'Insufficient financial evidence — balance too low or unexplained irregular deposits' },
    { source: 'verified', text: 'Purpose of visit not clearly or convincingly established' },
    { source: 'verified', text: 'Applicant failed to demonstrate strong ties to home country' },
    { source: 'verified', text: 'Inconsistencies between submitted documents (dates, names, amounts)' },
    { source: 'verified', text: 'Overstay risk assessed as high based on applicant profile' },
    { source: 'community', text: 'Lump-sum deposits made within 4–8 weeks of application — raises credibility concerns' },
    { source: 'community', text: 'Generic or copy-pasted purpose of visit letter — easy for caseworkers to identify' },
    { source: 'community', text: 'No prior international travel history without compensating evidence of ties to India' },
  ],
  communityInsights: [
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Tourism',
      source: 'Reddit r/ukvisa', date: 'April 2026',
      text: 'Prior Schengen or US visa significantly strengthens a first-time UK application. UKVI views it as evidence you respect visa conditions and intend to return home.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Tourism',
      source: 'Immigration Forum', date: 'March 2026',
      text: 'UKVI checks your financial trajectory over 6 months — not just current balance. Gradual, consistent savings look far more credible than a sudden large transfer before applying.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Tourism',
      source: 'Travel Blog (VisaJourney.in)', date: 'February 2026',
      text: 'Priority processing (~5 working days) costs around £250 extra but is worth it for time-sensitive trips. Standard 3-week processing regularly extends to 5–6 weeks in peak summer season.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Tourism',
      source: 'Quora', date: 'January 2026',
      text: 'Your purpose of visit letter matters more than most applicants realise. Write it yourself in your own words — a copied template is easy to identify and weakens your case.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Business',
      source: 'Forum', date: 'March 2026',
      text: 'For business visits, the UK company invitation letter is critical — it must be on official letterhead, signed, and clearly state the purpose, duration, and that your employer is sponsoring the trip.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Family Visit',
      source: 'Reddit r/ukvisa', date: 'April 2026',
      text: 'Sponsor (UK-based family member) must provide proof of their immigration status — BRP card, passport bio page, or settled status letter. Without this, family visit applications are frequently refused.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Tourism',
      source: 'YouTube (VisaVlogs)', date: 'February 2026',
      text: 'Fixed deposits are accepted as proof of funds, but only if held for at least 3 months before the application date. Last-minute FDs created to inflate balance are regularly flagged by UKVI.',
    },
    {
      flag: '🇬🇧', destination: 'UK', purpose: 'Tourism',
      source: 'Forum', date: 'January 2026',
      text: 'First-time travellers with no international travel history should write an especially strong cover letter emphasising ties to India — property ownership, family dependents, stable long-term employment.',
    },
  ],
  recentUpdates: [
    {
      type: 'verified', color: 'blue',
      text: 'UK Standard Visitor Visa fee is £135 (up from £127), effective from 8 April 2026.',
      source: 'GOV.UK', date: 'April 2026',
    },
    {
      type: 'community', color: 'amber',
      text: 'VFS Global India appointment slots are booking 3–4 weeks ahead in Mumbai and Delhi.',
      source: 'Community', date: 'May 2026',
    },
    {
      type: 'verified', color: 'green',
      text: 'Biometric data enrolled at VFS remains valid for 10 years — no re-enrollment needed for repeat applications.',
      source: 'GOV.UK', date: '2023',
    },
  ],
}

// Home page — suggested Copilot questions (PRD 5.1)
export const HOME_COPILOT_QUESTIONS = [
  'How much bank balance do I need for a UK visa?',
  'Can I visit family and do tourism on the same UK visa?',
  'My employer letter is in Hindi — will that be accepted?',
  'I have no prior travel history. Can I still get a UK visa?',
]

// Copilot page — suggested questions panel (PRD 5.3)
export const COPILOT_SUGGESTED_QUESTIONS = [
  'How much bank balance is required for a UK visa?',
  'Can I use fixed deposits as proof of funds?',
  'What makes a strong purpose of visit letter?',
  'Do I need travel insurance for a UK visa?',
  "What if I've never travelled abroad before?",
  'How early should I apply before my travel date?',
  'Can a self-employed person apply for a UK visa?',
  'What happens if my UK visa is rejected?',
]

// Home page — visa type pills (PRD 5.1: shown instead of destinations)
export const VISA_TYPE_PILLS = [
  { label: 'Tourist Visit', purpose: 'Tourism' },
  { label: 'Business Visit', purpose: 'Business' },
  { label: 'Family Visit', purpose: 'Family Visit' },
  { label: 'Student Visitor', purpose: 'Student Visitor' },
]
