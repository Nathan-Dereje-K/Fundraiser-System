import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCampaign,
  getCampaigns,
  postCampaign,
  putCampaign,
  deleteCampaign,
  getMyCampaigns,
  searchCampaigns,
  doesUserOwnCampaign,
} from "../api/campaignApi";

// Existing query hooks
export const useCampaign = (id) => {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
};

export const useCampaigns = (search = "") => {
  return useQuery({
    queryKey: ["campaigns", search],
    queryFn: () => getCampaigns(search),
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

export const useSearchCampaigns = (search) => {
  return useQuery({
    queryKey: ["searchCampaigns", search],
    queryFn: () => searchCampaigns(search),
    enabled: search.length >= 2,
  });
};

export const useDoesUserOwnCampaign = (status = "approved") => {
  return useQuery({
    queryKey: ["doesUserOwnCampaign"],
    queryFn: () => doesUserOwnCampaign(status),
  });
};
