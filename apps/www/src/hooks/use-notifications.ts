import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserApi } from "./use-user-api";
import { useAuth } from "./use-auth";

export function useNotifications() {
  const userApi = useUserApi();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const walletAddress = auth.authenticated ? auth.activeWallet.address : null;

  const query = useQuery({
    queryKey: ["notifications", walletAddress],
    queryFn: async () => {
      try {
        const data = await userApi.notification.getNotifications({ limit: 50 });
        return data ?? [];
      } catch (err) {
        console.warn("[Notifications Fetch Error]", err);
        return [];
      }
    },
    enabled: auth.ready && auth.authenticated && Boolean(userApi?.notification),
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const items = query.data ?? [];
      if (items.length === 0) return;
      const unread = items.filter((n) => !n.readAt);
      if (unread.length === 0) return;
      await userApi.notification.batchUpdates(
        unread.map((n) => ({ id: n.id, readAt: new Date().toISOString() })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    ...query,
    notifications: query.data ?? [],
    clearAll: () => clearAllMutation.mutate(),
    isClearing: clearAllMutation.isPending,
  };
}
