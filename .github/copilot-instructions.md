---
name: "Vata React Storage App"
description: "Enforce coding patterns for React-Native Expo storage handling app with Tailwind/NativeWind, TypeScript, and Firebase integration. Applies to all TypeScript/TSX files in the workspace."
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Vata React Storage Handling App — Coding Guidelines

## Project Stack
- **Framework**: React-Native with Expo (latest)
- **Styling**: Tailwind CSS + NativeWind
- **Language**: TypeScript (strict mode)
- **Storage Backend**: Firebase
- **State Management**: React Hooks + Context API
- **Routing**: Expo Router

---

## 1. Component Structure & Naming

### File Organization
```
app/
├── _layout.tsx          # Root layout with navigation
├── index.tsx            # Home screen
├── global.css           # Global Tailwind directives
└── screens/             # Feature screens
    ├── storage.tsx
    └── settings.tsx

components/
├── common/              # Reusable UI components
│   ├── Button.tsx
│   └── LoadingSpinner.tsx
├── storage/             # Storage-specific components
│   ├── FileList.tsx
│   ├── UploadForm.tsx
│   └── StorageStats.tsx
└── providers/           # Context providers
    ├── FirebaseProvider.tsx
    └── StorageProvider.tsx

hooks/
├── useStorage.ts        # Custom storage hook
├── useFileUpload.ts
└── useFirebaseAuth.ts

services/
├── firebase.ts          # Firebase initialization
├── storage.ts           # Storage operations
└── firestore.ts         # Firestore operations

types/
├── index.ts             # Shared types
└── storage.ts           # Storage-related types
```

### Component Naming
- **Functional components**: PascalCase (e.g., `FileListItem`, `UploadForm`)
- **Custom hooks**: camelCase with `use` prefix (e.g., `useStorage`, `useFileUpload`)
- **Utilities/Services**: camelCase (e.g., `calculateStorageUsage`, `uploadFile`)
- **Types/Interfaces**: PascalCase with suffix (e.g., `FileData`, `UploadOptions`)

### Component Template
```typescript
// components/storage/FileList.tsx
import { FC, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useStorage } from '@/hooks/useStorage';
import FileListItem from './FileListItem';
import type { StorageFile } from '@/types/storage';

interface FileListProps {
  onItemSelect?: (file: StorageFile) => void;
}

const FileList: FC<FileListProps> = ({ onItemSelect }) => {
  const { files, isLoading, error } = useStorage();

  const handleItemPress = useCallback((file: StorageFile) => {
    onItemSelect?.(file);
  }, [onItemSelect]);

  if (error) {
    return <ErrorBoundary message={error} />;
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={files}
        renderItem={({ item }) => (
          <FileListItem file={item} onPress={handleItemPress} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState isLoading={isLoading} />}
      />
    </View>
  );
};

export default FileList;
```

---

## 2. State Management & Hooks

### Custom Hook Pattern
- Extract logic into custom hooks (minimize component logic)
- Use `useState` for local component state
- Use `useCallback` to optimize re-renders
- Document hook dependencies and side effects

```typescript
// hooks/useStorage.ts
import { useState, useEffect, useCallback } from 'react';
import { getAllFiles, deleteFile as deleteFileFromFirebase } from '@/services/storage';
import type { StorageFile } from '@/types/storage';

export const useStorage = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch files on mount
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllFiles();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch files');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await deleteFileFromFirebase(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  }, []);

  return { files, isLoading, error, deleteFile };
};
```

### Context for Global State
```typescript
// components/providers/StorageProvider.tsx
import React, { createContext, useContext, FC, ReactNode } from 'react';
import { useStorage } from '@/hooks/useStorage';
import type { StorageFile } from '@/types/storage';

interface StorageContextType {
  files: StorageFile[];
  isLoading: boolean;
  error: string | null;
  deleteFile: (id: string) => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const storage = useStorage();

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorageContext must be used within StorageProvider');
  }
  return context;
};
```

---

## 3. Styling with Tailwind & NativeWind

### Theme Colors
The app has a centralized theme with predefined colors:
- **Primary**: `primary-50` to `primary-900` (blue shades, use `primary-600` for main actions)
- **Secondary**: `secondary-50` to `secondary-900` (red shades, use for destructive actions)
- **Gray**: Standard gray palette for text and backgrounds

Define colors in `constants/colors.ts` and import for non-Tailwind contexts:
```typescript
import { themeColors } from '@/constants/colors';
// Use: color={themeColors.primary[600]}
```

### Tailwind Utility Classes
- Use utility-first approach with theme colors: `className="flex gap-4 bg-white rounded-lg p-4"`
- Use `primary-*` and `secondary-*` for theme colors instead of hardcoded colors
- Avoid inline styles; prefer Tailwind classes
- Use responsive prefixes: `md:`, `lg:`, `dark:` where applicable

### Common Patterns
```typescript
// Primary Action Button (uses theme primary color)
<TouchableOpacity
  className="bg-primary-600 rounded-lg px-4 py-3 active:bg-primary-700"
  onPress={handlePress}
>
  <Text className="text-white font-semibold text-center">Upload File</Text>
</TouchableOpacity>

// Destructive Button (uses theme secondary color)
<TouchableOpacity
  className="bg-secondary-600 rounded-lg px-4 py-3 active:bg-secondary-700"
  onPress={handleDelete}
>
  <Text className="text-white font-semibold text-center">Delete</Text>
</TouchableOpacity>

// Error Message (uses secondary colors for emphasis)
<View className="bg-secondary-100 border border-secondary-400 rounded-lg p-4">
  <Text className="text-secondary-700 text-sm font-semibold">Error message</Text>
</View>

// Card container
<View className="bg-white rounded-lg shadow-md p-4 mb-3">
  <Text className="text-lg font-bold text-gray-900 mb-2">Storage Usage</Text>
  <Text className="text-gray-600">2.5 GB / 15 GB</Text>
</View>

// Flex layout
<View className="flex-1 flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
  <Text className="flex-1 text-gray-900">{fileName}</Text>
  <Text className="text-gray-500 text-sm">{fileSize}</Text>
</View>
```

### Dark Mode & Theming
- Use Tailwind dark mode classes: `dark:bg-gray-900`, `dark:text-white`
- Ensure contrast ratios meet WCAG AA standards
- Test on actual devices (colors vary by hardware)
- For JavaScript/TypeScript values (not Tailwind classes), use `constants/colors.ts`

---

## 4. Firebase Integration & Storage

### Service Layer Pattern
```typescript
// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);
```

### Storage Operations
```typescript
// services/storage.ts
import { ref, uploadBytes, deleteObject, listAll, getBytes } from 'firebase/storage';
import { storage } from './firebase';
import type { StorageFile } from '@/types/storage';

export const uploadFile = async (fileName: string, fileData: Blob): Promise<string> => {
  try {
    const fileRef = ref(storage, `uploads/${fileName}`);
    const snapshot = await uploadBytes(fileRef, fileData);
    return snapshot.ref.fullPath;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error(`Failed to upload ${fileName}`);
  }
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Delete failed:', error);
    throw new Error('Failed to delete file');
  }
};

export const getAllFiles = async (): Promise<StorageFile[]> => {
  try {
    const listRef = ref(storage, 'uploads/');
    const result = await listAll(listRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => ({
        id: itemRef.name,
        name: itemRef.name,
        path: itemRef.fullPath,
        size: (await itemRef.getMetadata()).size,
        uploadedAt: new Date((await itemRef.getMetadata()).timeCreated),
      }))
    );
    
    return files;
  } catch (error) {
    console.error('Fetch files failed:', error);
    throw new Error('Failed to fetch files');
  }
};
```

---

## 5. Error Handling & Validation

### Error Boundary Component
```typescript
// components/common/ErrorBoundary.tsx
import { FC, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface ErrorBoundaryProps {
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ message, onRetry }) => {
  return (
    <View className="flex-1 items-center justify-center bg-red-50 p-4">
      <Text className="text-red-900 font-bold text-lg mb-2">⚠ Error</Text>
      <Text className="text-red-700 text-center mb-6">{message || 'Something went wrong'}</Text>
      {onRetry && (
        <TouchableOpacity
          className="bg-red-600 rounded-lg px-4 py-2"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### Input Validation
```typescript
// utils/validation.ts
export const validateFileName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'File name cannot be empty' };
  }
  if (name.length > 255) {
    return { valid: false, error: 'File name too long (max 255 chars)' };
  }
  if (!/^[\w\-. ]+$/.test(name)) {
    return { valid: false, error: 'Invalid file name characters' };
  }
  return { valid: true };
};

export const validateFileSize = (bytes: number, maxMB: number = 100): boolean => {
  return bytes <= maxMB * 1024 * 1024;
};
```

### Async/Try-Catch Pattern
```typescript
// Always use try-catch for async operations
const handleUpload = async () => {
  try {
    setIsLoading(true);
    const path = await uploadFile(fileName, fileData);
    setSuccessMessage(`File uploaded to ${path}`);
    refetchFiles();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    setError(message);
    console.error('Upload error:', err);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6. Type Safety & TypeScript

### Type Definitions
```typescript
// types/storage.ts
export interface StorageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  uploadedAt: Date;
  mimeType?: string;
  tags?: string[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface StorageStats {
  totalSize: number;
  totalFiles: number;
  quotaUsed: number;
  quotaLimit: number;
}

export type FileCategory = 'documents' | 'images' | 'videos' | 'other';
```

### Type Strictness
- Always export explicit types/interfaces
- Use `as const` for constant objects
- Avoid `any` — use `unknown` and type narrowing when needed
- Enable `strict: true` in `tsconfig.json`

---

## 7. Performance & Optimization

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
const FileListItem = memo(({ file, onPress }: Props) => {
  return <Text onPress={() => onPress(file)}>{file.name}</Text>;
});

// Memoize expensive calculations
const StorageStats = ({ files }: { files: StorageFile[] }) => {
  const stats = useMemo(
    () => ({
      total: files.reduce((sum, f) => sum + f.size, 0),
      count: files.length,
    }),
    [files]
  );

  return <Text>{stats.total} bytes across {stats.count} files</Text>;
};
```

### Lazy Loading
- Use pagination for large file lists
- Implement `FlatList` with `maxToRenderPerBatch` and `updateCellsBatchingPeriod`
- Debounce search/filter operations

```typescript
<FlatList
  data={files}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  onEndReached={loadMoreFiles}
  onEndReachedThreshold={0.5}
/>
```

---

## 8. Development Workflow

### Naming & Conventions
- Use `EXPO_PUBLIC_*` prefix for environment variables
- Keep variable names descriptive: `isLoading`, `hasError`, `shouldRender`
- Use boolean prefixes: `is`, `has`, `should`, `can`

### Code Quality
- Run `expo lint` before commits
- Ensure no TypeScript errors: `tsc --noEmit`
- Format with Prettier (configured in `package.json`)

### Commit Messages
```
feat: Add file upload with Firebase Storage
fix: Handle network errors in storage operations
refactor: Extract storage logic into custom hook
chore: Update dependencies
```

---

## Quick Reference Checklist

When creating new components/features:
- ✅ TypeScript strict types (`never any`)
- ✅ Tailwind utilities only (no inline styles)
- ✅ Custom hooks for reusable logic
- ✅ Firebase service layer encapsulation
- ✅ Try-catch error handling
- ✅ Meaningful error messages to users
- ✅ Loading/empty states in UI
- ✅ Accessibility: touch targets ≥44x44pt
- ✅ Performance: memo/useMemo for large lists

---

## Related Resources
- [React-Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Tailwind NativeWind](https://www.nativewind.dev/)
- [Firebase Web SDK](https://firebase.google.com/docs/web)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
