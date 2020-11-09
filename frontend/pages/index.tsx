import Head from "next/head";
import styles from "../styles/Home.module.css";
import DashBoard from "../components/Dashboard";
import Navigation from "../components/Navigation";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      <main className={styles.main}>
        <DashBoard />
      </main>
    </div>
  );
}
