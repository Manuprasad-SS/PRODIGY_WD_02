
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Employee, DashboardStats } from '../types';
import { analyzeWorkforceData } from '../services/geminiService';

interface DashboardProps {
  employees: Employee[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ employees }) => {
  const [analysis, setAnalysis] = useState<string>('Analyzing workforce trends...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stats: DashboardStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const avgSalary = total > 0 ? employees.reduce((acc, curr) => acc + curr.salary, 0) / total : 0;
    
    const deptMap: Record<string, number> = {};
    employees.forEach(e => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });

    const deptDistribution = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

    return {
      totalEmployees: total,
      activeCount: active,
      avgSalary,
      deptDistribution
    };
  }, [employees]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsAnalyzing(true);
      const depts = stats.deptDistribution.map(d => d.name);
      const result = await analyzeWorkforceData(stats.totalEmployees, stats.avgSalary, depts);
      setAnalysis(result);
      setIsAnalyzing(false);
    };

    if (employees.length > 0) {
      fetchAnalysis();
    }
  }, [stats]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Executive Summary</h2>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Headcount</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900">{stats.totalEmployees}</h3>
            <span className="text-emerald-600 text-sm font-semibold">+12% vs LY</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Status</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-indigo-600">{stats.activeCount}</h3>
            <span className="text-slate-400 text-sm">/ {stats.totalEmployees} current</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Average Compensation</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900">${Math.round(stats.avgSalary / 1000)}k</h3>
            <span className="text-amber-600 text-sm font-semibold">Competitive</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            Department Allocation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.deptDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {stats.deptDistribution.map((dept, index) => (
              <div key={dept.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-slate-600 font-medium">{dept.name} ({dept.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/30 rounded-lg">
                <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold">AI Talent Intelligence</h3>
            </div>
            
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 italic">
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white"></div>
                  <p>Quantum processing HR data...</p>
                </div>
              ) : (
                <p className="leading-relaxed text-indigo-100 leading-relaxed text-lg">
                  "{analysis}"
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-indigo-300 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Powered by Gemini 3.0 Flash
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
