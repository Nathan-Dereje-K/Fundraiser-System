import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  releaseMoney,
  suspendCampaign,
  withdrawMoney,
} from "../api/releaseApi";

export const useReleaseMoney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: releaseMoney,
    onSuccess: () => {
      queryClient.invalidateQueries("campaigns");
    },
  });
};

export const useWithdrawMoney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawMoney,
    onSuccess: () => {
      queryClient.invalidateQueries("campaigns");
    },
  });
};

export const useSuspendCampaign = () => {
  return useMutation({ mutationFn: suspendCampaign });
};
