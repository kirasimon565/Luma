"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './LoginPage.module.scss';
import rippleStyles from '@/styles/ripple.module.scss';
import clsx from 'clsx';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Enter the Luma World</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={clsx(styles.button, rippleStyles.ripple)}>
            Login
          </button>
        </form>
        <p className={styles.link}>
          Don't have an account?{" "}
          <Link href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
