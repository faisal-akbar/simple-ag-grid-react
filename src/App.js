import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import BasicTable from './components/BasicTable';
import Header from './components/Header';
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
                </Switch>
            </Router>
        </>
    );
}

export default App;
