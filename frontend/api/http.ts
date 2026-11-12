import {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  create,
} from "axios";
import {
  RegisteredCourse,
  User,
  UserCourse,
  UserResults,
  userType,
} from "@/types";

const API_BASE_URL = "http://localhost:8080/api/v1";

// Create axios instance with default config
const api: AxiosInstance = create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: enables cookies to be sent/received
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookies are automatically sent with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await api.post("/auth/refresh");

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth and let the app handle redirect
        // The useAuth hook will detect the 401 and redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export async function login(email: string, password: string) {
  const response = await api.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response;
}

// CURRENT USER
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>(`${API_BASE_URL}/users/current-user`, {
    withCredentials: true,
  });

  return response.data;
}

// USER AUTHENTICATION
export const createUser = async (userData: userType) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// LOGIN API

export const authenticate = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });

  return response.data;
};

// SIGN OUT API
export const logOut = async () => {
  // REMOVE CURRENT USER FROM ASYNC STORAGE

  const result = await api.post("/auth/signout");
  // Clear authentication token

  return result.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data;
};

// FORGOT PASSWORD API
export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// FETCH USER COURSES
export const fetchUserCourses = async (): Promise<UserCourse[]> => {
  const response = await api.get<UserCourse[]>(`/courses/user-courses`);
  return response.data;
};

export interface CourseRegistrationPayload {
  code: string;
  courseId: string;
  title: string;
  unit: number;
}

// REGISTER COURSES
export async function registerUserCourses(
  courses: CourseRegistrationPayload[],
) {
  const response = await api.post(`/register-courses`, { courses });
  return response.data;
}

// FETCH USER COURSES
export const fetchRegisteredCourses = async (): Promise<RegisteredCourse[]> => {
  const response = await api.get<RegisteredCourse[]>(
    `/register-courses/my-courses`,
  );
  return response.data;
};

// DELETE COURSES
export async function deleteUserCourses(id: string) {
  const response = await api.delete(`/register-courses/${id}`);
  return response.data;
}

// UPDATE COURSES
export async function updateUserCourses(courseIds: string[]) {
  const response = await api.patch(`/register-courses/update`, {
    courses: courseIds.map((courseId) => ({ courseId })),
  });
  return response.data;
}

// UPDATE USER ACADEMIC SEMESTERS AND LEVELS
export const updateUserAcademicDetails = async (academicData: {
  semester: string;
  level: number;
}) => {
  const response = await api.patch("/users/semester-level", academicData);
  return response.data;
};

// FETCH USER RESULTS
export const fetchUserResults = async (): Promise<UserResults[]> => {
  const response = await api.get<UserResults[]>("/results/my-results");
  return response.data;
};
