'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api-client';
import { IUser } from '../../../../shared/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const result = await apiFetch<IUser>('/api/users/me');
      setLoading(false);

      if (result.error) {
        setError(result.error.message);
      } else if (result.data) {
        setUser(result.data);
      }
    }
    loadSession();
  }, []);

  const handleLogout = async () => {
    const result = await apiFetch<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });

    if (!result.error) {
      router.push('/');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}><h3>Loading session profile...</h3></div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#FFF', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
        <h2 style={{ color: '#DC2626' }}>Session Authentication Error</h2>
        <p style={{ color: '#7F1D1D' }}>{error}</p>
        <button onClick={() => router.push('/')} style={{ padding: '0.5rem 1rem', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#111827' }}>Protected Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#374151', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '6px', border: '1px solid #F3F4F6' }}>
        <h3 style={{ marginTop: 0, color: '#374151' }}>Welcome back, {user?.name}!</h3>
        <p><strong>Session ID:</strong> {user?.id}</p>
        <p><strong>Email Address:</strong> {user?.email}</p>
        <p><strong>Role Permissions:</strong> <span style={{ textTransform: 'capitalize', background: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{user?.role}</span></p>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '2rem', textAlign: 'center' }}>
        This page was guarded by Next.js edge middleware. Tampering with cookies will revoke session permissions immediately.
      </p>
    </div>
  );
}
