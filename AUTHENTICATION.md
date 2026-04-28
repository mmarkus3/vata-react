# Authentication Setup Guide

## Overview
The app now includes a complete authentication system with:
- ✅ Firebase Authentication (Email/Password)
- ✅ Login/Sign Up screen
- ✅ Protected routes (only accessible when signed in)
- ✅ Auth context + custom hook
- ✅ Auto-redirect based on auth state

## Project Structure
```
app/
├── _layout.tsx          # Root layout with auth routing logic
├── index.tsx            # Loading screen (redirects to login or app)
├── login.tsx            # Login/Sign Up screen
├── global.css           # Tailwind CSS
└── (app)/               # Protected routes (requires auth)
    ├── _layout.tsx      # Tab navigation for authenticated users
    ├── index.tsx        # Storage screen
    └── settings.tsx     # Settings + Sign Out

components/providers/
└── AuthProvider.tsx     # Context provider for auth state

hooks/
└── useAuth.ts           # Custom hook to access auth context

services/
└── firebase.ts          # Firebase initialization

types/
└── auth.ts              # TypeScript types for auth
```

## Setup Steps

### 1. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Email/Password** authentication:
   - In Firebase Console → Authentication → Sign-in methods
   - Enable "Email/Password"
4. Enable **Cloud Storage**:
   - In Firebase Console → Storage
   - Create a storage bucket
5. Enable **Firestore** (optional, for future features):
   - In Firebase Console → Firestore Database

### 2. Add Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Firebase credentials in `.env.local`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 3. Install Dependencies
Firebase was already added to `package.json`. If you haven't installed yet:
```bash
npm install
```

### 4. Run the App
```bash
npm run dev
# or
expo start
```

## How It Works

### Authentication Flow
1. App starts and loads `app/_layout.tsx` (root layout)
2. `AuthProvider` wraps the entire app and subscribes to Firebase auth state
3. `RootLayoutNav` component checks auth state:
   - **Not signed in**: Routes to `/login`
   - **Signed in**: Routes to `/(app)` (protected routes)
4. User can sign in or create account on login screen
5. After auth, user can access storage and settings screens

### Login Screen Features
- **Sign In Mode**: Enter email and password to log in
- **Sign Up Mode**: Create new account (toggle with link)
- **Validation**: 
  - Email format validation
  - Password minimum 6 characters
  - Error messages for auth failures
- **Loading State**: Shows activity indicator during auth

### Protected Routes
The `(app)` route group contains screens that require authentication:
- **Storage** (index.tsx): Main app screen - manage files
- **Settings** (settings.tsx): User info and sign out button

When user signs out, they're automatically redirected to `/login`.

## Using the Auth Hook

In any component, access authentication state:
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isLoading, error, signOut } = useAuth();

  return (
    <View>
      {user && <Text>Signed in as: {user.email}</Text>}
      {error && <Text>Error: {error}</Text>}
    </View>
  );
}
```

## Extending the Auth System

### Add More Auth Methods
Update `AuthProvider.tsx` to add:
- Google Sign-In
- Apple Sign-In
- Phone authentication
- Third-party providers

### Add User Profile
Store user metadata in Firestore:
```typescript
// After sign up, create user document
await setDoc(doc(firestore, 'users', user.uid), {
  email: user.email,
  createdAt: new Date(),
  displayName: user.displayName,
});
```

### Add Password Reset
Add a "Forgot Password" screen and use Firebase:
```typescript
import { sendPasswordResetEmail } from 'firebase/auth';
await sendPasswordResetEmail(auth, email);
```

## Troubleshooting

### Firebase credentials error
- ✓ Check `.env.local` file has correct values
- ✓ Ensure variables start with `EXPO_PUBLIC_`
- ✓ Restart dev server after changing `.env.local`

### Auth state not persisting
- ✓ This is normal - auth state resets when app restarts (Expo/dev mode)
- ✓ Use Firebase Realtime Database or Firestore for user data persistence

### Login screen stuck loading
- ✓ Check Firebase Console → Authentication → Settings
- ✓ Verify Email/Password auth is enabled
- ✓ Check browser console for Firebase errors

## Next Steps
- [ ] Add user profile screen
- [ ] Create file upload component (Firebase Storage)
- [ ] Add file list with Firestore
- [ ] Implement password reset
- [ ] Add social sign-in options
