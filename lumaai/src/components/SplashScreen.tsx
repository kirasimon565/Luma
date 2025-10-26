"use client";

import Image from 'next/image';
import styles from './SplashScreen.module.scss';

const SplashScreen = () => {
  return (
    <div className={styles.splashScreen}>
      <div className={styles.logoContainer}>
        <Image src="/logo.svg" alt="LumaAI Logo" width={150} height={150} className={styles.logo} />
      </div>
      <h1 className={styles.title}>LumaAI</h1>
      <p className={styles.tagline}>Where imagination remembers.</p>
    </div>
  );
};

export default SplashScreen;
