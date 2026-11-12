import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  login,
  getCurrentUser,
  logOut,
  fetchUserCourses,
  registerUserCourses,
  updateUserCourses,
  deleteUserCourses,
  CourseRegistrationPayload,
  fetchRegisteredCourses,
  fetchUserResults,
  updateUserAcademicDetails,
} from "./http";
import { userSemesterLevelType } from "@/types";

export function useLoginUser() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return login(email, password);
    },
    onSuccess: (data) => {
      router.push("/dashboard");
      // Store user data in localStorage or any other storage
      localStorage.setItem("user", JSON.stringify(data));
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOut,

    onSuccess() {
      localStorage.removeItem("user");
      queryClient.removeQueries({ queryKey: ["current-user"] });
      router.push("/login");
    },
  });
}

// FETCH USER COURSES
export function useFetchUserCourses() {
  return useQuery({
    queryKey: ["user-courses"],
    queryFn: () => fetchUserCourses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// REGISTER COURSES
export function useRegisterCourses() {
  const queryClient = useQueryClient();

  const {
    mutate: registerCourses,
    isPending: isRegistering,
    isSuccess: registrationSucceeded,
    error: registrationError,
    // error,
  } = useMutation({
    mutationFn: (courses: CourseRegistrationPayload[]) =>
      registerUserCourses(courses),
    onSuccess: async () => {
      // Await refetch to ensure fresh data before navigation
      await queryClient.refetchQueries({
        queryKey: ["registeredCourses"],
        type: "active",
      });
    },
    // onError: () => {},
  });

  return {
    registerCourses,
    isRegistering,
    registrationError,
    registrationSucceeded,
  };
}

// FETCH REGISTERED COURSES
export function useFetchRegisteredCourses() {
  return useQuery({
    queryKey: ["registeredCourses"],
    queryFn: () => fetchRegisteredCourses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// DELETE USER COURSES
export function useDeleteUserCourses() {
  const queryClient = useQueryClient();
  const { mutate: deleteCourses, isPending } = useMutation({
    mutationFn: (courseId: string) => deleteUserCourses(courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-courses"] });
      await queryClient.invalidateQueries({ queryKey: ["registeredCourses"] });
    },
  });

  return { deleteCourses, isPending };
}

// UPDATE USER COURSES
export function useUpdateUserCourses() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateCourses, isPending: isUpdating } = useMutation({
    mutationFn: (courseIds: string[]) => updateUserCourses(courseIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-courses"] });
      router.back();
    },
  });

  return { updateCourses, isUpdating };
}

// FETCH USER RESULTS
export function useFetchUserResults() {
  return useQuery({
    queryKey: ["user-results"],
    queryFn: () => fetchUserResults(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// UPDATE SEMESTER AND LEVEL
// UPDATE USER ACADEMIC LEVEL AND SEMESTER
export function useUpdateUserSemestersAndLevels() {
  const queryClient = useQueryClient();
  const {
    mutate: updateAcademicDetails,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (academicData: userSemesterLevelType) =>
      updateUserAcademicDetails(academicData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.removeQueries({ queryKey: ["user-courses"] });
      queryClient.removeQueries({ queryKey: ["registeredCourses"] });
    },
  });
  return { updateAcademicDetails, isPending, isError, error, isSuccess };
}
