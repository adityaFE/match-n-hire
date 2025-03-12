import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updatePassword,
  reauthenticateWithCredential, 
  EmailAuthProvider,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    // Force reauth by adding a timestamp parameter
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      login_hint: '',
      // Add a random query parameter to force a refresh
      auth_flow_type: 'popup',
      state: Date.now().toString()
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateUserPassword = async (user: User, currentPassword: string, newPassword: string) => {
  try {
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
