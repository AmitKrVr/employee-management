import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateEmployee } from '../../lib/employeeSlice';
import EmployeeForm from './EmployeeForm';
import { useEmployeeForm } from '../../hooks/useEmployeeForm';


const EditEmployeePopover = ({ employee, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const {
        formData,
        validationErrors,
        loading,
        setLoading,
        error,
        setError,
        handleChange,
        validateFormData
    } = useEmployeeForm({
        ...employee,
        image: null // Reset image since we don't want to send it unless changed
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFormData()) return;

        setLoading(true);
        setError(null);

        const formDataToSend = new FormData();

        // Append all form data except image if not changed
        Object.keys(formData).forEach(key => {
            if (key === 'image' && !formData[key]) return;
            if (key === 'courses') {
                formData.courses.forEach(course => {
                    formDataToSend.append('courses', course);
                });
            } else if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            await dispatch(updateEmployee({
                id: employee._id,
                formData: formDataToSend
            })).unwrap();

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit Employee</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <EmployeeForm
                    formData={formData}
                    validationErrors={validationErrors}
                    loading={loading}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                    submitButtonText={loading ? 'Updating...' : 'Update Employee'}
                    currentImageUrl={employee.imageUrl}
                />
            </div>
        </div>
    );
};

export default EditEmployeePopover;
