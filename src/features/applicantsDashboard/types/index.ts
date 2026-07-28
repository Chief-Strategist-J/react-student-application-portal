export interface ApplicantAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: { lat: string; lng: string };
}

export interface ApplicantCompany {
  name: string;
  catchPhrase?: string;
  bs?: string;
}

export interface Applicant {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address?: ApplicantAddress;
  company?: ApplicantCompany;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Waitlisted';
}

export interface ApplicantsFilter {
  searchQuery: string;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
}
