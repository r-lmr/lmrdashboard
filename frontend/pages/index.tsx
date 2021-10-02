import React from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import styles from '../styles/Home.module.css';
import Dashboard from '../components/Dashboard';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        {/* Primary Meta Tags */}
        <title>LMR Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="title" content="LMR Dashboard" />
        <meta name="description" content="Dashboard for the #lmr IRC channel with real time chat and stats" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dash.linuxmasterrace.org/" />
        <meta property="og:title" content="LMR Dashboard" />
        <meta property="og:description" content="Dashboard for the #lmr IRC channel with real time chat and stats" />
        <meta property="og:image" content="https://dash.linuxmasterrace.org/static/meta.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://dash.linuxmasterrace.org/" />
        <meta property="twitter:title" content="LMR Dashboard" />
        <meta
          property="twitter:description"
          content="Dashboard for the #lmr IRC channel with real time chat and stats"
        />
        <meta property="twitter:image" content="https://dash.linuxmasterrace.org/static/meta.png" />
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
