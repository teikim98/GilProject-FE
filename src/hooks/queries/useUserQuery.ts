import { useQuery } from "@tanstack/react-query";
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
