import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, CircleUser, ScrollText } from "lucide-react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus, logoutUser } from "../lib/authSlice";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="w-full sticky top-0 left-0 z-50 bg-[var(--body-color)]">
            <div className="max-w-[1160px] m-auto">
                <div className="z-50 flex justify-between items-center h-20">
                    <div className="md:flex items-center hidden">
                        <Link to="/" className="">
                            <div className="text-lg sm:text-2xl font-bold">
                                <span className="text-[var(--main-color)]">
                                    C
                                </span>
                                ompany
                            </div>
                        </Link>

                        <div className="hidden md:block ml-10 space-x-6">
                            <Link
                                to="/"
                                className="font-medium px-3 py-1.5 hover:text-[var(--hover-color)] hover:bg-gray-700 rounded-md">
                                Home
                            </Link>
                            <Link
                                to="/employees"
                                className="font-medium px-3 py-1.5 hover:text-[var(--hover-color)] hover:bg-gray-700 rounded-md">
                                Employee List
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Logo */}
                    <Link to="/" className="md:hidden">
                        <div className="text-lg sm:text-2xl font-bold">
                            Q
                            <span className="text-[var(--main-color)]">
                                Tilt
                            </span>
                        </div>
                    </Link>

                    {/* Right Side - logout and User */}
                    {isAuthenticated && (
                        <div className="hidden sm:flex  items-center gap-x-4">
                            <div className="flex min-w-max hover:text-[var(--main-color)]">
                                {user?.name}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full block px-4 py-2 text-sm font-medium">
                                Sign Out
                            </button>
                        </div>
                    )}

                    <div className="relative sm:hidden pl-3 py-5 group">
                        {isAuthenticated ? (
                            // Authenticated User View
                            <>
                                <CircleUser className="size-8 group-hover:text-[var(--main-color)] group-hover:scale-125 transition-all duration-300 cursor-pointer" />
                                <div className="hidden group-hover:block origin-top-right absolute right-0 mt-5 w-44 rounded-md shadow-lg bg-white bg-opacity-75 backdrop-blur-lg ring-1 ring-black ring-opacity-5 transition-all duration-300">
                                    <div className="py-1" role="menu">
                                        {/* User Name */}
                                        <div className="block px-4 py-2 text-sm text-black font-bold text-center text-[var(--hover-color)]">
                                            {user?.name}
                                        </div>

                                        <NavLink
                                            to="employee-list"
                                            className="w-full text-left block px-4 py-2 text-sm text-black hover:bg-[var(--container-color)] hover:text-[var(--hover-color)] font-medium"
                                            role="menuitem">
                                            <ScrollText className="mr-2 h-5 w-5 inline" />{" "}
                                            Employee List
                                        </NavLink>

                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-black hover:bg-[var(--container-color)] hover:text-[var(--hover-color)] font-medium"
                                            role="menuitem">
                                            <LogOut className="mr-2 h-5 w-5 inline" />{" "}
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Non-authenticated User View
                            <CircleUser
                                onClick={() => navigate("/login")}
                                className="size-8 hover:text-[var(--main-color)] hover:scale-125 transition-all duration-300 cursor-pointer"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
