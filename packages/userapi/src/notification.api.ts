import type {
  notificationSchema,
  notificationUpdateSchema,
  notificationQueryParamsSchema,
} from "@rhivadotfun/api";

import { ApiImpl } from "./api-impl";

export default class NotificationAPI extends ApiImpl {
  protected path: string = "/notifications";

  getQuote(params: ReturnType<typeof notificationQueryParamsSchema.encode>) {
    return ApiImpl.getData(
      this.xior.get<ReturnType<typeof notificationSchema.encode>[]>(
        this.buildPathWithQueryString(this.path, params),
      ),
    );
  }

  getNotifications(
    params?: ReturnType<typeof notificationQueryParamsSchema.encode>,
  ) {
    return this.getQuote(params ?? {});
  }

  batchUpdates(updates: ReturnType<typeof notificationUpdateSchema.encode>[]) {
    return ApiImpl.getData(
      this.xior.post<ReturnType<typeof notificationSchema.encode>[]>(
        this.buildPath("/batch"),
        updates,
      ),
    );
  }
}
