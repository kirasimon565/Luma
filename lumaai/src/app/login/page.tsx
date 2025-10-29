'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import pb from '@/lib/pocketbase';

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // PocketBase's authWithPassword can take either a username or an email
      await pb.collection('users').authWithPassword(identity, password);
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (err: any) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Username or Email"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
