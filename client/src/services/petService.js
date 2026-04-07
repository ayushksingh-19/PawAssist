import API, { canUseApi } from "./api";

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }
};

export const createPet = async (userId, payload) => {
  if (!userId) {
    throw new Error("User id is required to create a pet.");
  }

  await requireApi();
  const response = await API.post(`/pets/${userId}`, payload);
  return response.data;
};

export const updatePet = async (userId, petId, payload) => {
  if (!userId || !petId) {
    throw new Error("User id and pet id are required to update a pet.");
  }

  await requireApi();
  const response = await API.put(`/pets/${userId}/${petId}`, payload);
  return response.data;
};

export const deletePet = async (userId, petId) => {
  if (!userId || !petId) {
    throw new Error("User id and pet id are required to delete a pet.");
  }

  await requireApi();
  const response = await API.delete(`/pets/${userId}/${petId}`);
  return response.data;
};
