import React, { useState } from "react";
import styles from "../css/AdminDashboard.module.css";

const ImageUpload = ({
    onImageUpload,
    currentImageUrl = "",
    label = "Image",
    uploadPath = "http://localhost:4000/api/products/upload-image"
    // uploadPath = "https://arogya-production.up.railway.app/api/products/upload-image",
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setUploadError("Please select an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size should be less than 5MB");
            return;
        }

        try {
            setUploading(true);
            setUploadError("");

            const formData = new FormData();
            formData.append("image", file);

            const token = localStorage.getItem("token");
            const response = await fetch(uploadPath, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onImageUpload(data.imageUrl);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Upload failed");
            }
        } catch (error) {
            setUploadError("Error uploading image: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.formGroup}>
            <label>{label}:</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentImageUrl && (
                    <img
                        src={currentImageUrl}
                        alt="Current product image"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #e1e5e9",
                        }}
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{
                        padding: "8px",
                        border: "2px solid #e1e5e9",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                    }}
                />
                {uploading && <small style={{ color: "#667eea" }}>Uploading...</small>}
                {uploadError && (
                    <small style={{ color: "#e74c3c" }}>{uploadError}</small>
                )}
                <small style={{ color: "#666" }}>
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                </small>
            </div>
        </div>
    );
};

export default ImageUpload;
