"use client";

import styles from './SplashScreen.module.scss';

const SplashScreen = () => {
  return (
    <div className={styles.splashScreen}>
      <div className={styles.gradient}></div>
      <div className={styles.orbContainer}>
        <div className={styles.orbGlow}></div>
        <div className={styles.orb}>
          <div className={styles.orbInner}></div>
        </div>
      </div>
      <h1>LumaAI</h1>
      <p>Where imagination remembers.</p>
    </div>
  );
};

export default SplashScreen;
