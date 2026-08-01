import { useContext } from "react";

import { AuthContext, type TAuthContext } from "@/providers/PrivyProvider";

export const useAuth = () => useContext(AuthContext) as TAuthContext;
