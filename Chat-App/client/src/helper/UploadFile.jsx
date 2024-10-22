import toast from "react-hot-toast";

export const UploadFile = async (file) => {
  if (file) {
    const reader = new FileReader();
    
    // Using a promise to wait for FileReader to load the file
    return  await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => {
        reject(new Error("Image loading failed."));
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    });
  }
};

export default UploadFile;



