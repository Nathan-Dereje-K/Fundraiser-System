import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTrasactOfUserForCampaign,
  getTrasactOfUser,
  getTrasactOfCampaign,
} from "../api/transactionApi";

export const useTransactionOfUserForCampaign = (id, userId) => {
  return useQuery({
    queryKey: ["transaction", id, userId],
    queryFn: () => getTrasactOfUserForCampaign(id),
  });
};

export const useTransactionOfUser = (id) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTrasactOfUser(id),
  });
};

export const useTransactionOfCampaign = (id) => {
  return useQuery({
    queryKey: ["transactionhistory", id],
    queryFn: () => getTrasactOfCampaign(id),
  });
};
