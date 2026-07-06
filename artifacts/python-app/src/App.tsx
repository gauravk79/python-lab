import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from './pages/Home';
import { AuthProvider } from './context/auth-context';
import { ProgressProvider } from './context/progress-context';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        <div className="min-h-screen flex items-center justify-center font-sans">
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
