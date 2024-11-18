import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../lib/employeeSlice";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { list: employees, loading } = useSelector(
        (state) => state.employees
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEmployees());
    }, []);

    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto mt-8">
            {/* Header Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome {user?.name || "Admin"}
                </h1>
                <p className="text-gray-400">
                    Manage your account and view your information
                </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        User Information
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-gray-400">Name:</label>
                            <p>{user?.name}</p>
                        </div>
                        <div>
                            <label className="text-gray-400">Email:</label>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-4">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            onClick={() => navigate("/employees")}>
                            View Employee List
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <label className="text-gray-400">
                                Total Employees:
                            </label>
                            {loading ? (
                                ""
                            ) : (
                                <p className="font-bold">{employees.count}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
