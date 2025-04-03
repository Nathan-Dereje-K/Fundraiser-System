import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  initiatePayment,
  initiateToken,
  processPayment,
} from "../api/donateApi";
export const useDonate = () => {
  return useMutation({
    mutationFn: initiatePayment,
  });
};

export const useInitiateToken = () => {
  return useQuery({
    queryKey: ["token"],
    queryFn: initiateToken,
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processPayment,
    onSuccess: () => {
      queryClient.invalidateQueries("token");
    },
  });
};
