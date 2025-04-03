import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCampaign, getCampaigns } from "../api/campaignApi";

export const useCampaign = (id) => {
  if (!id) {
    return { campaign: null, isPending: false, error: "Invalid campaign ID" };
  }
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaign(id),
  });
};

export const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });
};
