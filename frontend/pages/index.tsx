import Head from 'next/head';
import styles from '../styles/Home.module.css';
import DashBoardUserList from '../components/DashboardUserList';
import DashBoardDuccStats from '../components/DashboardDuccStats';
import DashBoardLineCountStats from '../components/DashboardLineCountStats';
import DashBoardTopWords from '../components/DashboardTopWords';
import DashBoardMessageList from '../components/DashboardMessageList';
import Navigation from '../components/Navigation';
import { Container, Row, Col } from 'reactstrap';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>lmrdashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      <main className={styles.main}>
        <div style={{ width: '100%', height: '100%' }}>
          <Container style={{ maxWidth: '100%' }}>
            <Row>
              <Col style={{ paddingTop: '0.5em', paddingBottom: '0.5em', paddingRight: '0.5em', paddingLeft: '0.5em' }}>
                <DashBoardUserList />
              </Col>
              <Col style={{ paddingTop: '0.5em', paddingBottom: '0.5em', paddingRight: '0.5em', paddingLeft: '0.5em' }}>
                <DashBoardLineCountStats />
              </Col>
              <Col style={{ paddingTop: '0.5em', paddingBottom: '0.5em', paddingRight: '0.5em', paddingLeft: '0.5em' }}>
                <DashBoardTopWords />
              </Col>
            </Row>
            <Row>
              <Col md={8} style={{ paddingTop: '0.5em', paddingBottom: '0.5em', paddingRight: '0.5em', paddingLeft: '0.5em' }} >
                <DashBoardMessageList />
              </Col>
              <Col md={4} style={{ paddingTop: '0.5em', paddingBottom: '0.5em', paddingRight: '0.5em', paddingLeft: '0.5em' }} >
                <DashBoardDuccStats />
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    </div>
  );
}
