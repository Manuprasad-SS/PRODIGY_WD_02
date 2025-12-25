
import React, { useState, useEffect } from 'react';
import { Employee, AuthState } from './types';
import { MOCK_EMPLOYEES } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Login from './components/Login';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'employees'>('dashboard');
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial data load from local storage or mock
    const savedData = localStorage.getItem('staff_manager_employees');
    if (savedData) {
      setEmployees(JSON.parse(savedData));
    } else {
      setEmployees(MOCK_EMPLOYEES);
    }

    const savedAuth = localStorage.getItem('staff_manager_auth');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
    
    setIsLoading(false);
  }, []);

  const saveToStorage = (data: Employee[]) => {
    localStorage.setItem('staff_manager_employees', JSON.stringify(data));
  };

  const handleLogin = (user: string) => {
    const newAuth = { isAuthenticated: true, user };
    setAuth(newAuth);
    localStorage.setItem('staff_manager_auth', JSON.stringify(newAuth));
  };

  const handleLogout = () => {
    const newAuth = { isAuthenticated: false, user: null };
    setAuth(newAuth);
    localStorage.removeItem('staff_manager_auth');
  };

  const handleAddEmployee = (data: Omit<Employee, 'id'>) => {
    const newEmployee = { ...data, id: crypto.randomUUID() };
    const updated = [newEmployee, ...employees];
    setEmployees(updated);
    saveToStorage(updated);
    setShowForm(false);
  };

  const handleUpdateEmployee = (data: Omit<Employee, 'id'>) => {
    if (!editingEmployee) return;
    const updated = employees.map(e => e.id === editingEmployee.id ? { ...data, id: e.id } : e);
    setEmployees(updated);
    saveToStorage(updated);
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this record? This action cannot be undone.')) {
      const updated = employees.filter(e => e.id !== id);
      setEmployees(updated);
      saveToStorage(updated);
    }
  };

  const handleUpdateBio = (id: string, bio: string) => {
    const updated = employees.map(e => e.id === id ? { ...e, bio } : e);
    setEmployees(updated);
    saveToStorage(updated);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Staff Manager Initializing</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 ml-64 p-10 max-w-7xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Staff Management Console</h1>
            <p className="text-slate-600">Logged in as <span className="text-indigo-600 font-bold">{auth.user}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            {currentView === 'employees' && (
              <button 
                onClick={() => {
                  setEditingEmployee(undefined);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                New Employee
              </button>
            )}
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <Dashboard employees={employees} />
        ) : (
          <EmployeeList 
            employees={employees} 
            onEdit={(e) => {
              setEditingEmployee(e);
              setShowForm(true);
            }} 
            onDelete={handleDeleteEmployee}
            onUpdateBio={handleUpdateBio}
          />
        )}

        {showForm && (
          <EmployeeForm 
            employee={editingEmployee}
            onSave={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
            onCancel={() => {
              setShowForm(false);
              setEditingEmployee(undefined);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
