interface SendOTPRequest {
  email: string;
}

interface SendOTPResponse {
  message: string;
}

interface VerifyOTPRequest {
  email: string;
  password: string;
  code: string;
}

interface VerifyOTPResponse {
  message: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface ForgotPasswordResponse {
  email: string;
}

interface ResetPasswordResponse {
  token: string;
  newPassword: string;
}
interface RefreshTokenResponse {
  refreshToken: string;
}
