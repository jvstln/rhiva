import { ApiImpl } from "../api-impl";
import type {
	transferSchema,
	transactionResponseSchema,
} from "@rhivadotfun/api";

export default class ActionAPI extends ApiImpl {
	protected path: string = "/transactions/actions";

	transfer(params: ReturnType<typeof transferSchema.encode>) {
		return ApiImpl.getData(
			this.xior.post<ReturnType<typeof transactionResponseSchema.encode>>(
				this.buildPath("/transfer"),
				params,
			),
		);
	}
}
