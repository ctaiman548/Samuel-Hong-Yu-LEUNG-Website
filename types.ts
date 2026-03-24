

export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  mobileImageUrl?: string;
  type: 'image-top' | 'image-bottom' | 'full' | 'video';
  theme: 'light' | 'dark';
}

export interface MenuItem {
  label: string;
  href: string;
  view?: 'home' | 'works' | 'upcomings' | 'about';
}

export interface Performance {
  date: string;
  occasion: string;
  venue: string;
  location: string;
  performer: string;
  ticketUrl?: string;
  mapUrl?: string;
}

export interface Work {
  id: string;
  title: string;
  year: string;
  instrumentation: string;
  duration: string;
  categories: string[];
  premiere?: Performance;
  description?: string;
  listenUrl?: string;
  remarks?: string;
  otherPerformances?: Performance[];
  programmeNotes?: string;
}

export interface UpcomingEvent {
  id: string;
  occasion: string;
  date: string;
  location: string;
  venue: string;
  performers: string;
  program: string;
  ticketUrl?: string;
  mapUrl?: string;
}