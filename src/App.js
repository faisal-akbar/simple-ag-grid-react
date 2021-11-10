import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BasicTable from './components/BasicTable';
import APIContextProvider from './components/Context/apiContext';
import Layout from './components/Layout';
import MySQLServerSide from './components/MySQLServerSide';
import OlympicServerSide from './components/Olympic';
import OracleServerSide from './components/OracleServerSide';
import RowGroupTable from './components/RowGroupTable';

function App() {
    return (
        <>
            <Router>
                <APIContextProvider>
                    <Layout>
                        <Switch>
                            <Route exact path="/">
                                <BasicTable />
                            </Route>

                            <Route exact path="/row-group-table">
                                <RowGroupTable />
                            </Route>
                            <Route exact path="/mysql-ssrm">
                                <MySQLServerSide />
                            </Route>
                            <Route exact path="/oracle-ssrm">
                                <OracleServerSide />
                            </Route>
                            <Route exact path="/olympic">
                                <OlympicServerSide />
                            </Route>
                        </Switch>
                    </Layout>
                </APIContextProvider>
            </Router>
        </>
    );
}

export default App;
