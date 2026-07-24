import type { createReferralSchema, userSchema } from "@rhivadotfun/api";

import { ApiImpl } from "./api-impl";

export default class UserAPI extends ApiImpl {
  protected path = "/users";

  getMe() {
    return ApiImpl.getData(
      this.xior.get<ReturnType<typeof userSchema.encode>>(
        this.buildPath("/me"),
      ),
    );
  }

  refer(params: ReturnType<typeof createReferralSchema.encode>) {
    return ApiImpl.getData(
      this.xior.post<{ success: boolean }>("/referrals", params),
    );
  }
}
