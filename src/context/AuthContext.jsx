import { createContext, useContext, useState } from "react"

// This is a simple local auth context.
// Later you'll replace this with Supabase's useSession() hook.
// For now it lets the app know if someone is "signed in" or not.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // user = null means guest. user = { name, email, persona } means signed in.
  const [user, setUser] = useState(null)

  const signIn = (userData) => setUser(userData)
  const signOut = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}