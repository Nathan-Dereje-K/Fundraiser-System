import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postReport, getAllReports, deleteReport } from "../api/reportApi";
import { toast } from "react-toastify";

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postReport,
    onSuccess: () => {
      queryClient.invalidateQueries(["campaigns"]);
    },
  });
};

export const useGetAllReports = () => {
  return useQuery({
    queryKey: ["allReports"],
    queryFn: getAllReports,
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReports"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete the report. Please try again.");
    },
  });
};
