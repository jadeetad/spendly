import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout       from "./components/Layout"
import Landing      from "./pages/Landing"
import SignIn       from "./pages/SignIn"
import SignUp       from "./pages/SignUp"
import Dashboard    from "./pages/Dashboard"
import AddExpense   from "./pages/AddExpense"
import Transactions from "./pages/Transactions"
import Analytics    from "./pages/Analytics"
import AIInsights   from "./pages/AIInsights"
import Cards        from "./pages/Cards"
import Settings     from "./pages/Settings"

// Layout wraps all app pages (everything except Landing, SignIn, SignUp)
// It provides the persistent sidebar with working nav
function AppLayout({ children }) {
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages — no sidebar */}
        <Route path="/"        element={<Landing />} />
        <Route path="/signin"  element={<SignIn />}  />
        <Route path="/signup"  element={<SignUp />}  />

        {/* App pages — all wrapped in Layout (sidebar stays visible) */}
        <Route path="/dashboard"    element={<AppLayout><Dashboard /></AppLayout>}    />
        <Route path="/add-expense"  element={<AppLayout><AddExpense /></AppLayout>}   />
        <Route path="/transactions" element={<AppLayout><Transactions /></AppLayout>} />
        <Route path="/analytics"    element={<AppLayout><Analytics /></AppLayout>}    />
        <Route path="/ai-insights"  element={<AppLayout><AIInsights /></AppLayout>}   />
        <Route path="/cards"        element={<AppLayout><Cards /></AppLayout>}        />
        <Route path="/settings"     element={<AppLayout><Settings /></AppLayout>}     />
      </Routes>
    </BrowserRouter>
  )
}