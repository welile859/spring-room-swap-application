
import { useEffect, useState } from "react";
import { createRoom } from "../services/api.js";
import "./PostRoom.css";
import { useNavigate } from "react-router-dom";

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function PostRoom() {

    const navigate = useNavigate();
    const [roomTitle, setRoomTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [genderPreference, setGenderPreference] = useState("Any");

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [imageError, setImageError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const previewUrls = images.map((image) =>
            URL.createObjectURL(image)
        );

        setPreviews(previewUrls);

        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        setImageError("");
        setError("");
        setSuccess("");

        if (images.length + selectedFiles.length > MAX_IMAGES) {
            setImageError("You can upload a maximum of 3 photos.");
            event.target.value = "";
            return;
        }

        const invalidFile = selectedFiles.find(
            (file) => !file.type.startsWith("image/")
        );

        if (invalidFile) {
            setImageError("Please select image files only.");
            event.target.value = "";
            return;
        }

        const oversizedFile = selectedFiles.find(
            (file) => file.size > MAX_FILE_SIZE
        );

        if (oversizedFile) {
            setImageError("Each image must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        setImages((currentImages) => [
            ...currentImages,
            ...selectedFiles,
        ]);

        event.target.value = "";
    };

    const removeImage = (indexToRemove) => {
        setImages((currentImages) =>
            currentImages.filter(
                (_, index) => index !== indexToRemove
            )
        );

        setImageError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setImageError("");

        if (
            !roomTitle.trim() ||
            !description.trim() ||
            !location.trim()
        ) {
            setError("Please complete all required fields.");
            return;
        }

        if (images.length === 0) {
            setImageError("Please upload at least one room photo.");
            return;
        }

        const roomData = {
            roomTitle: roomTitle.trim(),
            description: description.trim(),
            location: location.trim(),
            genderPreference,
        };

        try {
            setLoading(true);

            await createRoom(roomData, images);

            setSuccess("Your room has been posted successfully.");

            setRoomTitle("");
            setDescription("");
            setLocation("");
            setGenderPreference("Any");
            setImages([]);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Could not post your room. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="post-room-page">
            <section className="post-room-container">

                <button
                    type="button"
                    className="return-home-button"
                    onClick={() => navigate("/home")}
                >
                    ← Return to Homepage
                </button>

                <header className="post-room-header">
                    <h1>Post a Room</h1>
                    <p>
                        Fill in the details below to list your room.
                    </p>
                </header>

                <form
                    className="post-room-form"
                    onSubmit={handleSubmit}
                >
                    <div className="room-image-section">
                        <label
                            className={`image-upload-area ${
                                images.length >= MAX_IMAGES
                                    ? "upload-disabled"
                                    : ""
                            }`}
                        >
                            <span className="upload-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2"
                                    />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="m21 15-5-5L5 21" />
                                </svg>
                            </span>

                            <strong>
                                {images.length === 0
                                    ? "Add up to 3 photos"
                                    : `${images.length} of 3 photos selected`}
                            </strong>

                            <span className="upload-button">
                                Choose Images
                            </span>

                            <span className="upload-hint">
                                Select clear photos of your room
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={images.length >= MAX_IMAGES}
                            />
                        </label>

                        {previews.length > 0 && (
                            <div className="room-image-previews">
                                {previews.map((preview, index) => (
                                    <div
                                        className="room-image-preview"
                                        key={preview}
                                    >
                                        <img
                                            src={preview}
                                            alt={`Room photo ${index + 1}`}
                                        />

                                        <button
                                            type="button"
                                            className="remove-image-button"
                                            onClick={() => removeImage(index)}
                                            aria-label={`Remove photo ${index + 1}`}
                                        >
                                            ×
                                        </button>

                                        <span className="photo-number">
                                            Photo {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {imageError && (
                            <p className="form-error" role="alert">
                                {imageError}
                            </p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="roomTitle">
                            Room Title <span>*</span>
                        </label>

                        <input
                            id="roomTitle"
                            type="text"
                            placeholder="e.g. Cozy room in Hatfield"
                            value={roomTitle}
                            onChange={(event) =>
                                setRoomTitle(event.target.value)
                            }
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">
                            Description <span>*</span>
                        </label>

                        <textarea
                            id="description"
                            placeholder="Tell us about the room, location, amenities..."
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={4}
                            maxLength={2000}
                            required
                        />

                        <span className="character-count">
                            {description.length}/2000
                        </span>
                    </div>

                    <div className="form-field">
                        <label htmlFor="location">
                            Location <span>*</span>
                        </label>

                        <input
                            id="location"
                            type="text"
                            placeholder="e.g. Hatfield, Pretoria"
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="genderPreference">
                            Gender Preference
                        </label>

                        <select
                            id="genderPreference"
                            value={genderPreference}
                            onChange={(event) =>
                                setGenderPreference(event.target.value)
                            }
                        >
                            <option value="Any">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {error && (
                        <div className="form-message error-message" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="form-message success-message" role="status">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="post-room-button"
                        disabled={loading}
                    >
                        {loading ? "Posting Room..." : "Post Room"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default PostRoom;
