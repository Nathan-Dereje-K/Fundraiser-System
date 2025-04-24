import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postReport,
  getReportsByUserId,
  getAllReports,
} from "../api/reportApi";

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postReport,
    onSuccess: () => {
      queryClient.invalidateQueries(["campaigns"]);
    },
  });
};

export const useGetReportsByUserId = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReportsByUserId,
    select: (data) => data.data.reports,
  });
};

export const useGetAllReports = () => {
  return useQuery({
    queryKey: ["allReports"],
    queryFn: getAllReports,
    select: (data) => data.data.reports,
  });
};
