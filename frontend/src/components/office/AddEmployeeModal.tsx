import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { OfficeEmployeeData } from '../../types/office';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (emp: {
    name: string;
    role: string;
    department: string;
    parent_id: string | null;
    clothingColor: string;
    hairStyle: 'short' | 'parted' | 'bob' | 'ponytail' | 'curly' | 'fade';
  }) => Promise<void>;
  existingEmployees: OfficeEmployeeData[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  existingEmployees
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Developer');
  const [department, setDepartment] = useState('Core Engineering');
  const [parentId, setParentId] = useState('agent-giriraj');
  const [clothingColor, setClothingColor] = useState('#2563eb');
  const [hairStyle, setHairStyle] = useState<'short' | 'parted' | 'bob' | 'ponytail' | 'curly' | 'fade'>('short');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddEmployee({
        name: name.trim(),
        role: role.trim(),
        department,
        parent_id: parentId === 'none' ? null : parentId,
        clothingColor,
        hairStyle
      });
      setName('');
      onClose();
    } catch (err) {
      console.error('Failed to add employee', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorPresets = [
    { label: 'Blue', hex: '#2563eb' },
    { label: 'Indigo', hex: '#4f46e5' },
    { label: 'Emerald', hex: '#059669' },
    { label: 'Cyan', hex: '#0891b2' },
    { label: 'Purple', hex: '#9333ea' },
    { label: 'Pink', hex: '#db2777' },
    { label: 'Amber', hex: '#d97706' },
    { label: 'Dark Navy', hex: '#1e1b4b' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Add New Employee</h3>
              <p className="text-xs text-slate-400">Add an AI agent to the 3D office</p>
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
            <label className="block text-slate-300 font-semibold mb-1">Employee Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Yash Vardhan"
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
              placeholder="e.g. Senior Backend Engineer"
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
              {existingEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role.split('/')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Appearance & Color */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hair Style</label>
              <select
                value={hairStyle}
                onChange={(e) => setHairStyle(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-500 text-xs"
              >
                <option value="short">Short</option>
                <option value="parted">Parted</option>
                <option value="fade">Fade</option>
                <option value="curly">Curly</option>
                <option value="bob">Bob</option>
                <option value="ponytail">Ponytail</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Outfit Color</label>
              <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setClothingColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      clothingColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition shadow-lg shadow-sky-500/25 active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding Employee...' : 'Add Employee to Office'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
