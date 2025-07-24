import { queryKeys } from "@/lib/constants";
import { getAlerts } from "@/services/alerts.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAlerts = (params) => {
  const { data, isLoading, isPending, isFetching } = useQuery({
    queryKey: [queryKeys.alerts, params],
    queryFn: () => getAlerts(params),
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return {
    alerts: data?.data || [],
    isLoading: isLoading || isPending || isFetching,
  };
};
