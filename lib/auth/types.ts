import type { ApiResult } from "@/types/api";
import type { AppUser, Business, BusinessMembership } from "@/types/domain";

export type AuthSession = {
  user: AppUser;
};

export type AuthService = {
  /** Deferred — phone OTP later. Email is temporary primary for MVP slice. */
  requestPhoneOtp: (phone: string) => Promise<ApiResult<{ sent: true }>>;
  verifyPhoneOtp: (
    phone: string,
    token: string,
  ) => Promise<ApiResult<AuthSession>>;
  signUpWithEmail: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<ApiResult<AuthSession>>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<ApiResult<AuthSession>>;
  signOut: () => Promise<ApiResult<{ signedOut: true }>>;
  getSession: () => Promise<ApiResult<AuthSession | null>>;
};

export type MembershipWithBusiness = {
  membership: BusinessMembership;
  business: Business;
};
