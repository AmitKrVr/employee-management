const EmployeeForm = ({
    formData,
    validationErrors,
    loading,
    handleChange,
    handleSubmit,
    onClose,
    submitButtonText,
    currentImageUrl = null,
}) => {
    const handleCourseChange = (e) => {
        const { name, checked } = e.target;

        const updatedCourses = checked ? [name] : [];

        handleChange({
            target: {
                name: "courses",
                value: updatedCourses,
            },
        });
    };

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-400 mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 bg-gray-700 rounded ${
                        validationErrors.name ? "border border-red-500" : ""
                    }`}
                    required
                />
                {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.name}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 bg-gray-700 rounded ${
                        validationErrors.email ? "border border-red-500" : ""
                    }`}
                    required
                />
                {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.email}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-400 mb-1">Mobile</label>
                <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10 digit mobile number"
                    className={`w-full p-2 bg-gray-700 rounded ${
                        validationErrors.mobile ? "border border-red-500" : ""
                    }`}
                    required
                />
                {validationErrors.mobile && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.mobile}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-400 mb-1">Designation</label>
                <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    required>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                </select>
            </div>

            <div>
                <label className="block text-gray-400 mb-1">Gender</label>
                <div className="space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="M"
                            checked={formData.gender === "M"}
                            onChange={handleChange}
                            className="mr-2"
                            required
                        />
                        Male
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="F"
                            checked={formData.gender === "F"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Female
                    </label>
                </div>
                {validationErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.gender}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-400 mb-1">
                    Select courses
                </label>
                <div className="space-x-4">
                    {["MCA", "BCA", "BSC"].map((course) => (
                        <label
                            key={course}
                            className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name={course}
                                checked={formData.courses?.[0] === course}
                                onChange={handleCourseChange}
                                className="mr-2"
                            />
                            {course}
                        </label>
                    ))}
                </div>
                {validationErrors.courses && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.courses}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-400 mb-1">
                    Profile Image
                </label>
                {currentImageUrl ? (
                    <div className="mb-2">
                        <img
                            src={`${API_URL}${currentImageUrl}`}
                            alt="Current profile"
                            className="w-24 h-24 object-cover rounded"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-gray-600 flex justify-center items-center mb-2">
                        No Image
                    </div>
                )}
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className={`w-full p-2 bg-gray-700 rounded ${
                        validationErrors.image ? "border border-red-500" : ""
                    }`}
                />
                {validationErrors.image && (
                    <p className="text-red-500 text-sm mt-1">
                        {validationErrors.image}
                    </p>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                    disabled={loading}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                    disabled={loading}>
                    {submitButtonText}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;
