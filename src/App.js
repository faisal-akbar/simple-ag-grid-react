import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BasicTable from './components/BasicTable';
import Header from './components/Header';
import MySQLServerSide from './components/MySQLServerSide';
import OlympicServerSide from './components/Olympic';
import OracleServerSide from './components/OracleServerSide';
import RowGroupTable from './components/RowGroupTable';

function App() {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Header />
                        <BasicTable />
                    </Route>

                    <Route exact path="/row-group-table">
                        <Header />
                        <RowGroupTable />
                    </Route>
                    <Route exact path="/mysql-ssrm">
                        {/* <Header /> */}
                        <MySQLServerSide />
                    </Route>
                    <Route exact path="/oracle-ssrm">
                        {/* <Header /> */}
                        <OracleServerSide />
                    </Route>
                    <Route exact path="/olympic">
                        {/* <Header /> */}
                        <OlympicServerSide />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
