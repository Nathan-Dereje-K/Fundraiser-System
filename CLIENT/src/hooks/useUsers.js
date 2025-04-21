import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import {
  fetchCurrentUser,
  fetchUsers,
  updateUser,
  fetchUser,
} from "../api/userApi";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // Cache for 5 min
    refetchOnWindowFocus: false, // Prevent unnecessary refetching
  });
};

export const useUsers = (page = 1, limit = 10, search = "") => {
  console.log(page, limit, search);

  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: fetchUsers,
  });
};
export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: fetchUser,
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Refresh users list after update
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });
};
export const refreshCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: queryClient.invalidateQueries(["currentUser"]),
  });
};
