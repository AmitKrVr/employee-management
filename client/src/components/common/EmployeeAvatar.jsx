import { useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getInitials = (name) => {
    if (!name) return "??";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
};

const getRandomColor = (name) => {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
    ];
    const index = name?.length ? name.length % colors.length : 0;
    return colors[index];
};

const EmployeeAvatar = ({ imageUrl, name, className = "w-12 h-12" }) => {
    const [imageError, setImageError] = useState(false);

    if (!imageUrl || imageError) {
        return (
            <div
                className={`${className} rounded-full flex items-center justify-center ${getRandomColor(
                    name
                )} text-white font-semibold`}
                title={name}>
                {getInitials(name)}
            </div>
        );
    }

    return (
        <div
            className={`${className} rounded-full overflow-hidden bg-gray-700`}>
            <img
                src={`${API_URL}${imageUrl}`}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
            />
        </div>
    );
};

export default EmployeeAvatar;
