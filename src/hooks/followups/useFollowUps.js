import { queryKeys } from "@/lib/constants";
import { getFollowups } from "@/services/followups.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFollowUps = (params) => {
  const { data, isLoading, isPending, isFetching } = useQuery({
    queryKey: [queryKeys.followups, params],
    queryFn: () => getFollowups(params),
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return {
    followups: data?.data || [],
    isLoading: isLoading || isPending || isFetching,
  };
};
