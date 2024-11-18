import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Please provide a valid email address",
    ],
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^[0-9]{10}$/, "Please provide a valid 10-digit mobile number"],
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    enum: {
      values: ["HR", "Manager", "Sales"],
      message: "Please select a valid designation",
    },
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["M", "F"],
      message: "Please select a valid gender",
    },
  },
  courses: {
    type: [
      {
        type: String,
        enum: {
          values: ["MCA", "BCA", "BSC"],
          message: "Invalid course selection",
        },
      },
    ],
    validate: [
      {
        validator: function (courses) {
          return courses && courses.length > 0 && courses.length <= 3;
        },
        message: "Please select between 1 and 3 courses",
      },
      {
        validator: function (courses) {
          const uniqueCourses = new Set(courses);
          return uniqueCourses.size === courses.length;
        },
        message: "Duplicate courses are not allowed",
      },
    ],
  },
  imageUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Modify the pre-save middleware to handle employeeId generation
employeeSchema.pre("save", async function (next) {
  if (!this.employeeId) {
    try {
      // Find the latest employee to get the last ID
      const lastEmployee = await this.constructor.findOne(
        {},
        { employeeId: 1 },
        { sort: { employeeId: -1 } }
      );

      let nextId = 1;
      if (lastEmployee && lastEmployee.employeeId) {
        // Extract the number from the last ID and increment it
        const lastIdNumber = parseInt(
          lastEmployee.employeeId.replace("EMP", "")
        );
        nextId = lastIdNumber + 1;
      }

      // Format: EMP001, EMP002, etc.
      this.employeeId = `EMP${String(nextId).padStart(3, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Email duplicate check middleware remains the same
employeeSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    const existingEmployee = await this.constructor.findOne({
      email: this.email,
    });
    if (
      existingEmployee &&
      existingEmployee._id.toString() !== this._id?.toString()
    ) {
      throw new Error("Email address already exists");
    }
  }
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
