import { Navigation } from "./components/Navigation"
import { AuthProvider } from "./context/AuthContext"
import { DashboardProvider } from "./context/DashboardContext"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <>
    <AuthProvider>
      <DashboardProvider>
        <Navigation>
          <Dashboard />
        </Navigation>
      </DashboardProvider>
    </AuthProvider>
    
    </>
  )
}

export default App
