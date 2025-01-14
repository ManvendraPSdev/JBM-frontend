import axios from "axios";
const upload = async (files) => {
    let urls = [];
    try {
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
            );
            formData.append(
                "cloud_name",
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            );
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                }/image/upload`,
                formData
            );
            urls.push(response.data.secure_url);
        }
        return urls;
    } catch (error) {
        alert("Error while uploading the images", error);
        return;
    }
};

export { upload};