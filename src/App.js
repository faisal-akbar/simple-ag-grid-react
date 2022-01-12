import { Route, Routes } from 'react-router-dom';
import BasicTable from './components/ClientSide/BasicTable';
import RowGroupTable from './components/ClientSide/RowGroupTable';
import APIContextProvider from './components/Context/apiContext';
import NotificationContextProvider from './components/Context/notificationContext';
import Layout from './components/Layout';
import MsSqlServerSide from './components/MSSQL/MsSqlServerSide';
import MySQLMemo from './components/MySQL/MySQLMemo';
import MySQLServerSide from './components/MySQL/MySQLServerSide';
import OlympicServerSide from './components/MySQL/Olympic';
import MySQLNivo from './components/NivoChart/MySQLNivo';
import OracleServerSide from './components/Oracle/OracleServerSide';
import SocketApp from './components/Socket/SocketApp';

function App() {
    return (
        <NotificationContextProvider>
            {/* <SocketContext.Provider value={socket}> */}
            <APIContextProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<BasicTable />} />
                        <Route path="/row-group-table" element={<RowGroupTable />} />
                        <Route path="/mysql" element={<MySQLServerSide />} />
                        <Route path="/mysql-memo" element={<MySQLMemo />} />
                        <Route path="/mysql-nivo" element={<MySQLNivo />} />
                        <Route path="/mssql" element={<MsSqlServerSide />} />
                        <Route path="/oracle" element={<OracleServerSide />} />
                        <Route path="/olympic" element={<OlympicServerSide />} />
                        <Route path="/socket" element={<SocketApp />} />
                    </Routes>
                </Layout>
            </APIContextProvider>
            {/* </SocketContext.Provider> */}
        </NotificationContextProvider>
    );
}

export default App;
