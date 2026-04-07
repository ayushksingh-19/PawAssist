import API, { canUseApi } from "./api";
import { buildFallbackOverview } from "./fallbackData";

export const loginUser = async ({ phone, name, city, petName }) => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.post("/auth/login", { phone, name, city, petName });
    return response.data;
  } catch {
    const user = {
      id: `local-user-${phone}`,
      name: name?.trim() || "Pet Parent",
      phone,
      city: city?.trim() || "Kolkata",
      petName: petName?.trim() || "",
    };

    return {
      user,
      overview: buildFallbackOverview(user),
    };
  }
};

export const requestOtp = async ({ phone }) => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.post("/auth/request-otp", { phone });
  return response.data;
};

export const loginWithOtp = async ({ phone, otp }) => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.post("/auth/login-with-otp", { phone, otp });
  return response.data;
};
