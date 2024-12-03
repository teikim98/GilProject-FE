import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeUser, unsubscribeUser } from "@/api/subscribe";

export const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => subscribeUser(userId),
    onSuccess: (_, userId) => {
      // simpleProfile 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["simpleProfile", userId],
      });
    },
  });
};

export const useUnsubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => unsubscribeUser(userId),
    onSuccess: (_, userId) => {
      // simpleProfile 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["simpleProfile", userId],
      });
    },
  });
};
