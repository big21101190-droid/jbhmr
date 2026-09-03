export type PublicationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type IndexPolicy = 'INDEX' | 'NOINDEX';

export type FaqItem = {
  question: string;
  answer: string;
};

export type CompanySettings = {
  name: string;
  EnglishName: string;
  nationalPhone: string;
  daeguPhone: string;
  mobilePhone: string;
  smsPhone: string;
  email: string | null;
  address: string | null;
  representative: string | null;
  businessRegistrationNumber: string | null;
  businessHours: string | null;
  kakaoUrl: string | null;
  legacySiteUrl: string | null;
  plannedDomain: string | null;
};

export type ServiceContentStatus =
  | 'CONFIRMED_DETAIL'
  | 'CONFIRMED_BASIC'
  | 'NEEDS_MORE_INFO';

export type ServiceFact = {
  label: string;
  value: string;
};

export type ServiceStep = {
  title: string;
  body: string;
};

export type ServicePricingGroup = {
  title: string;
  columns: string[];
  rows: string[][];
};

export type ServicePricing = {
  title: string;
  description: string;
  groups: ServicePricingGroup[];
  notes: string[];
};

export type ServiceProvenance = {
  source: string;
  note: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  group: 'LOCAL' | 'INTERCITY' | 'JEJU' | 'TRAVEL';
  shortDescription: string;
  description: string;
  keywords: string[];
  image: string;
  contentStatus: ServiceContentStatus;
  heroTitle: string;
  heroAccent: string;
  summary: string;
  facts: ServiceFact[];
  items: string[];
  transport: string[];
  areas: string[];
  process: ServiceStep[];
  pricing: ServicePricing | null;
  trustNotes: string[];
  provenance: ServiceProvenance[];
  faqs: FaqItem[];
  active: boolean;
  sortOrder: number;
};

export type Region = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  type: 'METRO' | 'PROVINCE' | 'DISTRICT' | 'CITY' | 'AREA';
  description: string;
  nearbyRegions: string[];
  active: boolean;
  sortOrder: number;
  usesDaeguPhone: boolean;
};

export type LandingSection = {
  heading: string;
  body: string;
};

export type Landing = {
  id: string;
  regionId: string;
  serviceId: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  summary: string;
  sections: LandingSection[];
  faq: FaqItem[];
  ctaLabel: string;
  ctaLink: string;
  relatedRegions: string[];
  relatedServices: string[];
  status: PublicationStatus;
  indexPolicy: IndexPolicy;
  canonical: string | null;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  redirectTo: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type LandingInput = Omit<
  Landing,
  'id' | 'createdAt' | 'updatedAt' | 'publishedAt'
> & {
  id?: string;
};
