import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FlowEditor from './pages/FlowEditor';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor/:id?" element={<FlowEditor />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
