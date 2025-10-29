import styles from './page.module.scss';

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
      </header>
      <main className={styles.main}>
        <p>Welcome to your professional dashboard.</p>
        {/* Other components and content will go here */}
      </main>
    </div>
  );
}
