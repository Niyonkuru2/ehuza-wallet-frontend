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

// Userprofile
export interface UserProfile {
  name: string;
  email: string;
  imageUrl: string;
  userId: string;
  newPassword: string;
  createdAt: string;
}

export interface HeaderProps {
  user: {
    name: string;
    imageUrl: string;
  };
}
