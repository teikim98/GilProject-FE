import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeUser, unsubscribeUser } from "@/api/subscribe";

export const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation<number, Error, number>({
    mutationFn: async (userId: number) => {
      const result = await subscribeUser(userId);
      return result;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["simpleProfile", userId],
      });
    },
  });
};

export const useUnsubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (userId: number) => {
      await unsubscribeUser(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["simpleProfile", userId],
      });
    },
  });
};
