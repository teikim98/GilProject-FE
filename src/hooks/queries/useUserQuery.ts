import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSimpleProfile, getDetailProfile } from "@/api/user";

export const useSimpleProfile = (userId: number) => {
  return useQuery({
    queryKey: ["simpleProfile", userId],
    queryFn: () => getSimpleProfile(userId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDetailProfile = () => {
  return useQuery({
    queryKey: ["detailProfile"],
    queryFn: getDetailProfile,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvalidateUserQueries = () => {
  const queryClient = useQueryClient();

  const invalidateUserQueries = async () => {
    // detailProfile 쿼리 무효화
    await queryClient.invalidateQueries({ queryKey: ["detailProfile"] });

    // simpleProfile 쿼리도 함께 무효화 (선택적)
    await queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "simpleProfile",
    });
  };

  return invalidateUserQueries;
};
