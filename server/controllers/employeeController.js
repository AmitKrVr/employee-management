import Employee from "../models/Employee.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, courses } = req.body;

    // Log the received data for debugging
    console.log("Received data:", req.body);

    // Handle file upload if present
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create new employee without specifying employeeId
    const employee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses: Array.isArray(courses) ? courses : [courses], // Handle both array and single value
      imageUrl,
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({
      message: error.message || "Failed to create employee",
      error: error.toString(),
    });
  }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort("-createdAt");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get single employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle file upload if present
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Convert courses to array if it's a string
    if (updateData.courses && !Array.isArray(updateData.courses)) {
      updateData.courses = [updateData.courses];
    }

    // Remove image field if no new file is uploaded
    if (!req.file) {
      delete updateData.image;
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    res.json({
      success: true,
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating employee",
      error: error.toString(),
    });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Add this controller function
export const toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Toggle the isActive status
    employee.isActive = !employee.isActive;
    await employee.save();

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling employee status",
      error: error.message,
    });
  }
};
