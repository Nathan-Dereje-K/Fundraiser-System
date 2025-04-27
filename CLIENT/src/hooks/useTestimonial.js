import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postTestimonial,
  getAllTestimonials,
  deleteTestimonial,
} from "../api/testimonialApi";
import { toast } from "react-toastify";

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error(
        "Failed to post the testimonial. May you don't have a completed campaign."
      );
    },
  });
};

export const useGetAllTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getAllTestimonials,
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("Failed to delete the testimonial. Please try again.");
    },
  });
};
