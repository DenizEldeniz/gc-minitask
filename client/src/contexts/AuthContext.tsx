import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export type RegisterProfile = {
  firstName: string
  lastName: string
}

export type UserProfile = {
  firstName: string
  lastName: string
  email: string
}

type AuthContextType = {
  user: User | null
  email: string | null
  profile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, profile?: RegisterProfile) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      setUser(u)
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid))
          setProfile(snap.exists() ? (snap.data() as UserProfile) : null)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const register = useCallback(async (email: string, password: string, prof?: RegisterProfile) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (prof) {
      const data: UserProfile = {
        firstName: prof.firstName.trim(),
        lastName: prof.lastName.trim(),
        email: email.trim().toLowerCase(),
      }
      await setDoc(doc(db, 'users', credential.user.uid), data)
      setProfile(data)
    }
  }, [])

  const logout = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  return (
    <AuthContext.Provider value={{ user, email: user?.email ?? null, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
