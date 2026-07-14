export type AuthenticatedUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type AuthenticationResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type ApiErrorResponse = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};