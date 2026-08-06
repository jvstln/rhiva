import { useQuery } from "@tanstack/react-query";
import { useUserApi } from "@/hooks";

export function useRewardProfile() {
  const userApi = useUserApi();

  return useQuery({
    queryKey: ["rewards", "profile"],
    queryFn: () => userApi.user.getMe(),
    // enabled: !!userApi,
  });
}
