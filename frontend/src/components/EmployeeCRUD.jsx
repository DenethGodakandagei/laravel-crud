import { useEffect, useState } from "react"
import axios from "axios"

// laravel api endpoint
//const API_URL = "http://127.0.0.1:8000/api/employees"

// dotnet api endpoint
const API_URL = "http://localhost:5101/api/employees"

function EmployeeCRUD() {
  const [employees, setEmployees] = useState([])
  const [name, setName] = useState("")
  const [designation, setDesignation] = useState("")
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // New state for validation errors
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL)
      setEmployees(res.data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Validation Logic ---
  const validateForm = () => {
    let newErrors = {}
    if (!name.trim()) {
      newErrors.name = "Full name is required"
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters"
    }

    if (!designation.trim()) {
      newErrors.designation = "Designation is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, { name, designation });
    } else {
      await axios.post(API_URL, { name, designation });
    }

    // FIX: Safer way to close the modal
    const modalElement = document.getElementById('employeeModal');
    if (window.bootstrap && modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modal.hide();
    }

    resetForm();
    fetchEmployees(); // Refresh list
  } catch (error) {
    console.error("FULL ERROR OBJECT:", error); // Check this in F12 console!
    
    if (error.response && error.response.status === 422) {
      setErrors(error.response.data.errors);
    } else {
      // If it's a 500 error, this will show the specific message from Laravel
      const msg = error.response?.data?.message || "An unexpected error occurred.";
      alert("Error: " + msg);
    }
  }
};

  const resetForm = () => {
    setName(""); 
    setDesignation(""); 
    setEditId(null); 
    setErrors({});
  }

  const handleEdit = (emp) => {
    setErrors({}) // Clear errors when opening edit
    setEditId(emp.id); 
    setName(emp.name); 
    setDesignation(emp.designation)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Remove this employee?")) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        fetchEmployees()
      } catch (error) {
        alert("Failed to delete employee.")
      }
    }
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 className="fw-bold text-dark mb-1">Team Members</h2>
          <p className="text-muted small">Manage your organization's employees and their roles.</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-dark rounded-pill px-4 shadow-sm d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#employeeModal"
            onClick={resetForm}
          >
            <span className="me-2">+</span> Add Member
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-secondary small text-uppercase">
                  <th className="px-4 py-3">Member</th>
                  <th className="py-3">Designation</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.id} className="border-bottom">
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="avatar me-3 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{emp.name}</div>
                            <div className="text-muted small">ID: #{emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium">
                          {emp.designation}
                        </span>
                      </td>
                      <td className="py-3 text-end px-4">
                        <button 
                          className="btn btn-link text-decoration-none text-primary fw-medium me-3 p-0"
                          data-bs-toggle="modal" 
                          data-bs-target="#employeeModal" 
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-link text-decoration-none text-danger fw-medium p-0"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      {loading ? "Loading..." : "No employees found. Start by adding one!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Minimalist Modal */}
      <div className="modal fade" id="employeeModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="fw-bold">{editId ? "Update Profile" : "New Member"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm}></button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg bg-light border-0 rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => {setName(e.target.value); if(errors.name) setErrors({...errors, name: ''})}}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted text-uppercase">Role / Designation</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg bg-light border-0 rounded-3 ${errors.designation ? 'is-invalid' : ''}`}
                    placeholder="e.g. Lead Designer"
                    value={designation}
                    onChange={(e) => {setDesignation(e.target.value); if(errors.designation) setErrors({...errors, designation: ''})}}
                  />
                  {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 p-4">
                <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-dark rounded-pill px-4">
                  {editId ? "Save Changes" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        body { background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
        .card { transition: transform 0.2s ease; }
        .avatar { font-size: 0.9rem; letter-spacing: -0.5px; }
        .table thead th { font-weight: 600; letter-spacing: 0.5px; }
        .form-control:focus { background-color: #fff !important; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1); }
        .is-invalid { border: 1px solid #dc3545 !important; background-color: #fff !important; }
      `}</style>
    </div>
  )
}

export default EmployeeCRUD