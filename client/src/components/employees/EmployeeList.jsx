import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee, toggleEmployeeStatus } from '../../lib/employeeSlice';
import EditEmployeePopover from './EditEmployeePopover';
import CreateEmployeePopover from './CreateEmployeePopover';

import { Pencil, Trash2 } from 'lucide-react';
import EmployeeAvatar from '../common/EmployeeAvatar';

const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { list: employees, loading } = useSelector((state) => state.employees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showCreatePopover, setShowCreatePopover] = useState(false);

    // Search and Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    // Search and Filter functions
    const filteredEmployees = employees?.data?.filter(employee => {
        const searchLower = searchTerm.toLowerCase();
        return (
            employee.name.toLowerCase().includes(searchLower) ||
            employee.email.toLowerCase().includes(searchLower) ||
            employee.mobile.toLowerCase().includes(searchLower) ||
            employee.employeeId.toLowerCase().includes(searchLower)
        );
    });

    // Sorting function
    const sortedEmployees = [...(filteredEmployees || [])].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
        }
        return a[sortField] < b[sortField] ? 1 : -1;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle status toggle
    const handleStatusToggle = async (employeeId) => {
        try {
            await dispatch(toggleEmployeeStatus({ id: employeeId })).unwrap();
            dispatch(fetchEmployees());
        } catch (error) {
            console.error('Failed to toggle status:', error);
            alert('Failed to toggle employee status');
        }
    };

    // Handle delete
    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await dispatch(deleteEmployee(employeeId)).unwrap();
                dispatch(fetchEmployees());
            } catch (error) {
                console.error('Failed to delete employee:', error);
            }
        }
    };

    const handleEditSuccess = () => {
        dispatch(fetchEmployees());
    };

    return (
        <div className="max-w-7xl mx-auto mt-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Employee List</h2>
                <button
                    onClick={() => setShowCreatePopover(true)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Create Employee
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email, number or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                        <tr>
                            <th onClick={() => handleSort('employeeId')} className="p-4 select-none cursor-pointer">
                                Unique ID {sortField === 'employeeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="p-4 select-none">Image</th>
                            <th onClick={() => handleSort('name')} className="p-4 select-none cursor-pointer">
                                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('email')} className="p-4 select-none cursor-pointer">
                                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="p-4 select-none">Mobile No</th>
                            <th className="p-4 select-none">Designation</th>
                            <th className="p-4 select-none">Gender</th>
                            <th className="p-4 select-none">Courses</th>
                            <th onClick={() => handleSort('createdAt')} className="p-4 select-none cursor-pointer">
                                Create Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="p-4 select-none">Status</th>
                            <th className="p-4 select-none">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.map((employee) => (
                            <tr key={employee._id} className="border-t border-gray-700">
                                <td className="p-4 text-[0.94rem]">{employee.employeeId}</td>
                                <td className="p-4">
                                    <EmployeeAvatar
                                        imageUrl={employee.imageUrl}
                                        name={employee.name}
                                    />
                                </td>
                                <td className="p-4 text-[0.94rem] truncate" title={employee.name}>
                                    {truncateText(employee.name, 10)}
                                </td>
                                <td className="p-4 text-[0.94rem]" title={employee.email}>
                                    {truncateText(employee.email, 20)}
                                </td>
                                <td className="p-4 text-[0.94rem]">{employee.mobile}</td>
                                <td className="p-4 text-[0.94rem]">{employee.designation}</td>
                                <td className="p-4 text-[0.94rem]">{employee.gender}</td>
                                <td className="p-4 text-[0.94rem]">{employee.courses.join(', ')}</td>
                                <td className="p-4 text-[0.94rem]">
                                    {new Date(employee.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleStatusToggle(employee._id)}
                                        className={`px-2 py-1 text-xs rounded ${employee.isActive
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <Pencil onClick={() => setSelectedEmployee(employee)} className='size-5 cursor-pointer hover:text-[var(--main-color)]' />
                                        <Trash2 onClick={() => handleDelete(employee._id)} className='size-5 cursor-pointer hover:text-[var(--main-color)]' />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedEmployees.length)} of {sortedEmployees.length} entries
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Popovers */}
            {selectedEmployee && (
                <EditEmployeePopover
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {showCreatePopover && (
                <CreateEmployeePopover
                    onClose={() => setShowCreatePopover(false)}
                    onSuccess={() => {
                        dispatch(fetchEmployees());
                        setShowCreatePopover(false);
                    }}
                />
            )}
        </div>
    );
};

export default EmployeeList;
