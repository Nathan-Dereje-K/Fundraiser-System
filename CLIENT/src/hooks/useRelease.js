import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  releaseMoney,
  suspendAndReallocate,
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

export const useSuspendReallocate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendAndReallocate,
    onSuccess: () => {
      queryClient.invalidateQueries("campaigns");
    },
  });
};
