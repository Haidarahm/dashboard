import api from "./config";

/**
 * Fetch all employees
 * @param {object} params - The parameters for fetching employees
 * @param {number|null} params.is_secretary - 1 for secretaries, 0 for employees, null for all
 */
export const fetchEmployees = async (is_secretary) => {
  console.log(is_secretary)
  try {
    const response = await api.get("/api/admin/showEmployee",{
      params:{
        is_secretary:is_secretary
      }
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

/**
 * Add a new employee
 * @param {object} employeeData - The data for the new employee
 * @param {number} employeeData.is_secretary - 1 for secretary, 0 for other
 * @param {string} employeeData.first_name - The first name of the employee
 * @param {string} employeeData.last_name - The last name of the employee
 * @param {string} employeeData.email - The email of the employee
 * @param {string} employeeData.phone - The phone number of the employee
 * @param {string} employeeData.password - The password for the employee
 */
export const addEmployee = async (employeeData) => {
  try {
    const response = await api.post("/api/admin/addEmployee", employeeData);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

/**
 * Update an existing employee
 * @param {object} employeeData - The data for the employee to update
 * @param {number} employeeData.user_id - The ID of the user to update
 * @param {number} employeeData.is_secretary - 1 for secretary, 0 for other
 * @param {string} employeeData.first_name - The first name of the employee
 * @param {string} employeeData.last_name - The last name of the employee
 * @param {string} employeeData.email - The email of the employee
 * @param {string} employeeData.phone - The phone number of the employee
 * @param {string} [employeeData.password] - The new password (optional)
 */
export const updateEmployee = async (employeeData) => {
  try {
    const response = await api.post("/api/admin/editEmployee", employeeData);
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

/**
 * Delete an employee by their ID
 * @param {number} userId - The ID of the user to delete
 */
export const deleteEmployee = async (userId) => {
  try {
    const response = await api.delete("/api/admin/removeEmployee", {
      data: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
