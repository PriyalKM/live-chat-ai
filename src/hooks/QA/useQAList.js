import { queryKeys } from "@/lib/constants";
import { getQAList } from "@/services/QA.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useQAList = (params) => {
  const { data, isLoading, isPending, isFetching } = useQuery({
    queryKey: [queryKeys.qa, params],
    queryFn: () => getQAList(params),
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return {
    qaList: data?.data || [],
    isLoading: isLoading || isPending || isFetching,
  };
};
