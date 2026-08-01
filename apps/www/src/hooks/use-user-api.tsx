import { useContext } from "react";
import type UserApi from "@rhivadotfun/userapi";

import { UserApiContext } from "@/providers/UserApiProvider";

export const useUserApi = () => useContext(UserApiContext) as UserApi;
