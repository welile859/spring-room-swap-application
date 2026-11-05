
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.delete("/auth/logout");
    return response.data;
};

export const registerUser = async (registerData) => {
    const response = await api.post("/auth/register", registerData);
    return response.data;
};

export const createRoom = async (roomData, images) => {
    const formData = new FormData();

    formData.append("roomData", JSON.stringify(roomData));

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await api.post("/rooms", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export default api;
