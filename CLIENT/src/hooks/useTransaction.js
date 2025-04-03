import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrasactOfUserForCampaign } from "../api/transactionApi";

export const useTransactionOfUserForCampaign = (id, userId) => {
  return useQuery({
    queryKey: ["transaction", id, userId],
    queryFn: () => getTrasactOfUserForCampaign(id),
  });
};
