import { useDispatch } from 'react-redux';
import { createEmployee } from '../../lib/employeeSlice';
import { useEmployeeForm } from '../../hooks/useEmployeeForm';
import EmployeeForm from './EmployeeForm';

const CreateEmployeePopover = ({ onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const {
        formData,
        validationErrors,
        loading,
        error,
        setError,
        setLoading,
        handleChange,
        validateFormData
    } = useEmployeeForm({
        name: '',
        email: '',
        mobile: '',
        designation: 'HR',
        gender: 'M',
        courses: [],
        image: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateFormData()) {
            return;
        }

        setLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'courses') {
                formData.courses.forEach(course => {
                    formDataToSend.append('courses', course);
                });
            } else if (formData[key] !== null && formData[key] !== '') {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const result = await dispatch(createEmployee(formDataToSend)).unwrap();
            if (result) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Error creating employee:', err);
            setError(err.message || 'Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create Employee</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
                )}

                <EmployeeForm
                    formData={formData}
                    validationErrors={validationErrors}
                    loading={loading}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                    submitButtonText={loading ? 'Creating...' : 'Create Employee'}
                    currentImageUrl={null}
                />
            </div>
        </div>
    );
};

export default CreateEmployeePopover;
