import Head from "next/head";
import styles from "../styles/Home.module.css";
import DashBoard from "../components/Dashboard";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>lmrdashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      <main className={styles.main}>
        <div style={{ width: "85%", height: "95%" }}>
          <DashBoard />
        </div>
      </main>
    </div>
  );
}
