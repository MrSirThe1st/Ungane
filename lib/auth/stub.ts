import type { AuthService } from "./types";

/** Dev-only stub — not used by getAuthService() anymore. */
export const stubAuthService: AuthService = {
  async requestPhoneOtp(phone) {
    console.info("[auth:stub] requestPhoneOtp", phone);
    return { success: true, data: { sent: true } };
  },

  async verifyPhoneOtp(phone, token) {
    console.info("[auth:stub] verifyPhoneOtp", { phone, token });
    return {
      success: true,
      data: {
        user: {
          id: "stub-user",
          phone,
          email: null,
          name: null,
        },
      },
    };
  },

  async signUpWithEmail(input) {
    console.info("[auth:stub] signUpWithEmail", input.email);
    return {
      success: true,
      data: {
        user: {
          id: "stub-user",
          phone: null,
          email: input.email,
          name: input.name,
        },
      },
    };
  },

  async signInWithEmail(email) {
    console.info("[auth:stub] signInWithEmail", email);
    return {
      success: true,
      data: {
        user: {
          id: "stub-user",
          phone: null,
          email,
          name: null,
        },
      },
    };
  },

  async signOut() {
    return { success: true, data: { signedOut: true } };
  },

  async getSession() {
    return { success: true, data: null };
  },
};
