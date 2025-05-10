// register input payload
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Login input payload
export interface LoginPayload {
  email: string;
  password: string;
}

//Auth Response
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: string;
}
