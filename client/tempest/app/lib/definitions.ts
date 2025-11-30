// AUTH TYPES
export interface AuthState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  re_password: string;
}

export interface ActivateData {
  uid: string;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// USER TYPES
export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture_url: string;
  about_me: string;
  gender: string;
  country: string;
  city: string;
  rating: number;
  num_reviews: number;
}

// PROPERTIES TYPES
export interface Property {
  id: string;
  user: User;
  title: string;
  slug: string;
  description: string;
  price_per_night: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  guests: number;
  location: string;
  category: string;
  favorited: string;
  image_url: string;
  liked: string;
  image: string;
  views: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  user: User;
  property: Property;
  property_id: string;
  start_date: string;
  end_date: string;
  number_of_nights: number;
  guests: number;
  total_amount: number;
  created_at: string;
}

// CHAT TYPES
export interface Conversation {
  id: string;
  reservation: Reservation;
  guest: User;
  landlord: User;
  created_at: string;
}

export type Message = {
  id: string;
  conversation_id: string;
  sender: User;
  text: string;
  created_at: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// URL PARAMETERS

export interface PropertyFilterParams {
  location?: string;
  start_date?: string;
  end_date?: string;
  guests?: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}
