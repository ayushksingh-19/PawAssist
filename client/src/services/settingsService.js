import API, { canUseApi } from "./api";

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }
};

export const fetchSettings = async (userId) => {
  if (!userId) {
    throw new Error("User id is required to load settings.");
  }

  await requireApi();
  const response = await API.get(`/auth/settings/${userId}`);
  return response.data;
};

export const saveSettings = async (userId, payload) => {
  if (!userId) {
    throw new Error("User id is required to save settings.");
  }

  await requireApi();
  const response = await API.put(`/auth/settings/${userId}`, payload);
  return response.data;
};

export const savePassword = async (userId, currentPassword, nextPassword) => {
  if (!userId) {
    throw new Error("User id is required to change password.");
  }

  await requireApi();
  const response = await API.put(`/auth/password/${userId}`, {
    currentPassword,
    nextPassword,
  });
  return response.data;
};

export const removeAccount = async (userId) => {
  if (!userId) {
    throw new Error("User id is required to delete account.");
  }

  await requireApi();
  const response = await API.delete(`/auth/account/${userId}`);
  return response.data;
};
