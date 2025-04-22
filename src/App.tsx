import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PolicyListPage from './pages/PolicyListPage';
import PolicyCreatePage from './pages/PolicyCreatePage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import { Button } from '@/components/ui/button';
import { UserProvider } from './context/UserContext';
import UserSelectorDropdown from './components/common/UserSelectorDropdown';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <header className="border-b sticky top-0 bg-background z-10">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
              <Link to="/" className="text-2xl font-bold">
                Policy Hub
              </Link>
              <nav className="flex items-center gap-4">
                <UserSelectorDropdown />
                <Button variant="link" asChild>
                  <Link to="/">Policies</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link to="/policies/new">Create Policy</Link>
                </Button>
              </nav>
            </div>
          </header>
          
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PolicyListPage />} />
              <Route path="/policies/new" element={<PolicyCreatePage />} />
              <Route path="/policies/:id" element={<PolicyDetailPage />} />
            </Routes>
          </main>
          
          <footer className="border-t py-4 mt-auto">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              <p>Policy Management Console - {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
