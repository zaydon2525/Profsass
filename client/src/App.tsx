import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Groups from "@/pages/Groups";
import Materials from "@/pages/Materials";
import Grades from "@/pages/Grades";
import Schedule from "@/pages/Schedule";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/users" component={() => (
        <ProtectedRoute roles={['admin', 'professor']}>
          <Users />
        </ProtectedRoute>
      )} />
      <Route path="/groups" component={() => (
        <ProtectedRoute roles={['admin', 'professor']}>
          <Groups />
        </ProtectedRoute>
      )} />
      <Route path="/materials" component={() => (
        <ProtectedRoute>
          <Materials />
        </ProtectedRoute>
      )} />
      <Route path="/grades" component={() => (
        <ProtectedRoute>
          <Grades />
        </ProtectedRoute>
      )} />
      <Route path="/schedule" component={() => (
        <ProtectedRoute>
          <Schedule />
        </ProtectedRoute>
      )} />
      <Route path="/messages" component={() => (
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
