import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, saveAdminSession } from '../../utils/adminAuth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const redirectTo = location.state?.from || '/admin/dashboard';

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password.trim(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login admin gagal.');
      }

      saveAdminSession(result.data);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(
        loginError.message === 'Failed to fetch'
          ? 'Backend belum berjalan. Jalankan npm run server atau npm run dev:full terlebih dahulu.'
          : loginError.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[440px] bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#1E2F4D] font-bold mb-8">
          <Icon icon="lucide:atom" className="w-7 h-7" />
          CitizenCare
        </Link>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1E2F4D] text-white flex items-center justify-center mb-4">
            <Icon icon="lucide:shield-check" className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E2F4D]">Login Admin</h1>
          <p className="text-sm text-gray-500 mt-2">Masuk untuk mengelola laporan warga.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#1E2F4D] mb-2">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username admin"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] outline-none focus:border-[#1E2F4D] text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1E2F4D] mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password admin"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] outline-none focus:border-[#1E2F4D] text-sm"
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <Icon icon="lucide:circle-alert" className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1E2F4D] text-white rounded-xl font-bold hover:bg-[#243B63] transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6">
          Akun development: admin / admin123. Ubah melalui file .env untuk produksi.
        </p>
      </div>
    </div>
  );
}
