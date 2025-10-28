// AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import LoadingScreen from '../components/LoadingScreen';
import type { Profile } from '../lib/supabaseOperations';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserName: (newName: string) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  isUserNew: () => Promise<boolean>;
  createProfile: (profileData: Partial<Profile>) => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
    }
    setProfile(data);
    return data;
  }, []);

  // Centralized session/profile check
  const handleSessionChange = useCallback(
    async (session: Session | null) => {
      setLoading(true);
      setSession(session);
      setUser(session?.user ?? null);

      const userId = session?.user?.id;
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      await fetchProfile(userId);
      setLoading(false);
      setInitialized(true);
    },
    [fetchProfile]
  );

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        await handleSessionChange(data.session);
      }
    };

    initializeAuth();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) handleSessionChange(session);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [handleSessionChange]);

  // Auth actions
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await handleSessionChange(data.session);
    return data;
  }, [handleSessionChange]);

  const signup = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    await handleSessionChange(data.session);
    return data;
  }, [handleSessionChange]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const updateUserName = useCallback(async (newName: string) => {
    if (!user) throw new Error('No authenticated user');
    const { data, error } = await supabase
      .from('users')
      .update({ name: newName })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile((prev) =>
      prev ? { ...prev, name: newName } : (data as Profile)
    );
  }, [user]);

  const isUserNew = useCallback(async (): Promise<boolean> => {
  if (!user) return false;
  if (profile) {
    return false
  }
  return true;
}, [user]);

const createProfile = useCallback(async (profileData: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: user?.id, ...profileData }])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    setProfile(data);
    return data;
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return null;
  }
}, [user]);


  // Memoize context value to prevent unnecessary rerenders
  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      login,
      signup,
      logout,
      updateUserName,
      fetchProfile,
      isUserNew,
      createProfile
    }),
    [user, session, profile, loading, login, signup, logout, updateUserName, fetchProfile, isUserNew, createProfile]
  );

  // Optional loading gate
  if (loading && !initialized)
    return <LoadingScreen />

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
