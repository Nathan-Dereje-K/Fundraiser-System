import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCampaign,
  getCampaigns,
  postCampaign,
  putCampaign,
  deleteCampaign,
  getMyCampaigns,
} from "../api/campaignApi";

// Existing query hooks
export const useCampaign = (id) => {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
};

export const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });
};

// New mutation hooks
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries(["campaigns"]);
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCampaign,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["campaign", variables.id], data);
      queryClient.invalidateQueries(["campaigns"]);
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["campaigns"]);
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      // Add error toast here if needed
    },
  });
};

export const useMyCampaigns = () => {
  return useQuery({
    queryKey: ["myCampaigns"],
    queryFn: () => getMyCampaigns(),
    refetchOnWindowFocus: false,
  });
};
