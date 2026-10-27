import React, { useState, useEffect } from 'react';
import { X, Edit3, Save } from 'lucide-react';
import { OfficeEmployeeData } from '../../types/office';

interface EditEmployeeModalProps {
  employee: OfficeEmployeeData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEmployee: (empId: string, updates: {
    name: string;
    role: string;
    department: string;
    parent_id: string | null;
  }) => Promise<void>;
  existingEmployees: OfficeEmployeeData[];
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  employee,
  isOpen,
  onClose,
  onUpdateEmployee,
  existingEmployees
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Core Engineering');
  const [parentId, setParentId] = useState('agent-giriraj');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setRole(employee.role);
      setDepartment(employee.department || 'Core Engineering');
      setParentId(employee.parent_id || 'none');
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdateEmployee(employee.id, {
        name: name.trim(),
        role: role.trim(),
        department,
        parent_id: parentId === 'none' ? null : parentId
      });
      onClose();
    } catch (err) {
      console.error('Failed to update employee', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Edit Employee Details</h3>
              <p className="text-xs text-slate-400">Update name, role, and manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Role / Job Title</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Executive">Executive</option>
              <option value="Operations">Operations</option>
              <option value="Core Engineering">Core Engineering</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Product & Design">Product & Design</option>
            </select>
          </div>

          {/* Reporting Manager */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reporting Manager</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="none">Top Authority (None)</option>
              {existingEmployees
                .filter((emp) => emp.id !== employee.id)
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role.split('/')[0].trim()})
                  </option>
                ))}
            </select>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition shadow-lg shadow-sky-500/25 active:scale-98 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Employee Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
