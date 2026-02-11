import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active sessions and sets the user
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }
        checkSession()

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Sign Up with email, password
    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        if (error) throw error

        // Create profile entry if signup successful and user exists
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email: email,
                updated_at: new Date()
            })
        }

        return data
    }

    // Sign In using email and password
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return data
    }

    // Sign Out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
    }

    const value = {
        signUp,
        signIn,
        signOut,
        user,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center h-screen bg-black text-white font-mono animate-pulse">
                    LOADING...
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}
