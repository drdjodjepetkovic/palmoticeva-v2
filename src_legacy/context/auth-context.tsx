"use client";

import { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, logAnalyticsEvent } from '@/lib/firebase/client';
import { UserService } from '@/lib/services/user-service';
import { UserProfile, UserRole } from '@/types/user';
import { useRouter } from 'next/navigation';
import { requestVerification } from '@/lib/actions/admin-actions';
import { useEventBus } from './event-bus-context';
import { UserEventType } from '@/lib/events';
import { usePwaInstall } from "@/hooks/use-pwa-install";


interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  showWalkthrough: boolean;
  setShowWalkthrough: (show: boolean) => void;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderInternal = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const router = useRouter();
  const { emit } = useEventBus();
  const { canInstall } = usePwaInstall();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const unsubscribeProfile = UserService.subscribeToUserProfile(user.uid, (profileData) => {
          if (profileData) {
            setUserProfile(profileData);

            const pendingDataJSON = localStorage.getItem('pending_user_data');
            if (pendingDataJSON) {
              const pendingData = JSON.parse(pendingDataJSON);
              const updates: Partial<UserProfile> = {};
              let needsUpdate = false;

              if (!profileData.displayName && pendingData.displayName) {
                updates.displayName = pendingData.displayName;
                needsUpdate = true;
              }
              if (!profileData.phone && pendingData.phone) {
                updates.phone = pendingData.phone;
                needsUpdate = true;
              }

              if (needsUpdate) {
                UserService.updateUserProfile(user.uid, updates).then(() => {
                  localStorage.removeItem('pending_user_data');
                });
              } else {
                localStorage.removeItem('pending_user_data');
              }
            }

            // Check if verification needs to be requested automatically
            const pendingVerification = localStorage.getItem('pending_verification_request');
            if (pendingVerification === 'true' && !profileData.verificationRequested && profileData.role === 'authenticated') {
              requestVerification(user.uid).then(result => {
                if (result.success) {
                  console.log("Automated verification request sent successfully.");
                } else {
                  console.error("Automated verification request failed:", result.error);
                }
                localStorage.removeItem('pending_verification_request');
              });
            }

          } else {
            UserService.createUserProfile(user).then((newUserProfile) => {
              setUserProfile(newUserProfile);
              // This is the main trigger for new user onboarding: only the walkthrough.
              emit(UserEventType.WalkthroughStart);
            });
          }
        });

        setLoading(false);
        return () => unsubscribeProfile();

      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        sessionStorage.removeItem('pwa_prompted_this_session');
      }
    });

    return () => unsubscribe();
  }, [router, emit, canInstall]);

  const role = userProfile?.role || 'unauthenticated';

  const value = {
    user,
    userProfile,
    role,
    loading,
    showWalkthrough,
    setShowWalkthrough,
    setUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProviderInternal as AuthProvider };
