
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

    // Add room details
    formData.append("roomTitle", roomData.roomTitle);
    formData.append("description", roomData.description);
    formData.append("location", roomData.location);
    formData.append("genderPreferrence", roomData.genderPreference);

    // Add room pictures
    images.forEach((image) => {
        formData.append("roomPictures", image);
    });

    const response = await api.post("/post/room", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export default api;

