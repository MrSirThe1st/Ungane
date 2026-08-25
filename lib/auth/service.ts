import {
  createBusinessAction,
  getAuthSession,
  signInWithEmailAction,
  signOutAction,
  signUpWithEmailAction,
} from "@/lib/auth/actions";
import { failureResult } from "@/lib/errors";
import type { AuthService } from "@/lib/auth/types";

/**
 * Server-oriented auth facade.
 * Phone OTP remains deferred — email is the temporary primary path.
 */
export function getAuthService(): AuthService {
  return {
    async requestPhoneOtp() {
      return failureResult(new Error("Phone OTP deferred"), {
        context: "requestPhoneOtp",
        fallback: "Connexion téléphone bientôt disponible.",
      });
    },
    async verifyPhoneOtp() {
      return failureResult(new Error("Phone OTP deferred"), {
        context: "verifyPhoneOtp",
        fallback: "Connexion téléphone bientôt disponible.",
      });
    },
    async signUpWithEmail(input) {
      return signUpWithEmailAction(input);
    },
    async signInWithEmail(email, password) {
      return signInWithEmailAction({ email, password });
    },
    async signOut() {
      return signOutAction();
    },
    async getSession() {
      const session = await getAuthSession();
      return { success: true, data: session };
    },
  };
}

export { createBusinessAction };
