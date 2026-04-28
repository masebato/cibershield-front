import { api } from "./axios";

export const getAssetsRequest = () => api.get("/auth/assets"); //Consultar la ruta correcta de esta función