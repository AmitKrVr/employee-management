export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name cannot exceed 50 characters";
  return "";
};

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) return "Please provide a valid email address";
  return "";
};

export const validateMobile = (mobile) => {
  if (!mobile) return "Mobile number is required";
  if (!/^\d*$/.test(mobile)) return "Only numbers are allowed";
  if (mobile.length !== 10) return "Mobile number must be exactly 10 digits";
  return "";
};

export const validateImage = (file) => {
  if (!file) return "";
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type))
    return "Only JPG and PNG files are allowed";
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) return "File size must be less than 5MB";
  return "";
};

export const validateForm = (formData) => {
  const errors = {
    name: validateName(formData.name),
    email: validateEmail(formData.email),
    mobile: validateMobile(formData.mobile),
    image: validateImage(formData.image),
  };

  return {
    errors,
    isValid: !Object.values(errors).some((error) => error !== ""),
  };
};
