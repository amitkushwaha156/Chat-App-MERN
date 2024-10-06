import axios from "axios";
import toast from "react-hot-toast";

export const UploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chatimage"); // Replace with your upload preset

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dchrsxv9e/upload",
      formData
    );
    return response.data.secure_url; // Return the secure URL
  } catch (error) {
    // console.error("Error uploading file:", error);
    toast.error("Error uploading file");
    throw error; // Re-throw the error for handling in the calling function
  }
};

export const registerUser = async (userData) => {
  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

  try {
    await axios.post(URL, userData);
    toast.success("Registration successful!");
  } catch (error) {
    // console.error("Error:", error);
    toast.error(error?.response?.data?.message || error.message);
    throw error; // Re-throw the error for handling in the calling function
  }
};

export default UploadFile;
