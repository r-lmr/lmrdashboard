import React from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import styles from '../styles/Home.module.css';
import Dashboard from '../components/Dashboard';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>lmrdashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      <main className={styles.main}>
        <div style={{ width: '100%', height: '100%' }}>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}
