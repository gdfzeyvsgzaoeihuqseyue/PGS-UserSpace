export interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  username?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecretConfigured?: boolean;
  twoFactorTemporarilyDisabled?: boolean;
  status: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  skills?: string[] | null;
  profilePictureUrl?: string | null;
  coverPictureUrl?: string | null;
}

// export type UserUpdateData = Partial<Omit<User, 'id'>>;
export type UserUpdateData = Partial<User>;

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  requiresTwoFactor: boolean;
  twoFactorMethod: 'email' | 'app' | null;
  router: any;
}
