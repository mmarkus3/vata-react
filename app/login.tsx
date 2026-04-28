import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { FC, useCallback, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AuthMode = 'signin' | 'signup';

const LoginScreen: FC = () => {
  const router = useRouter();
  const { signIn, signUp, isLoading, error: authError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAuth = useCallback(async () => {
    setLocalError(null);

    // Validation
    if (!email || !password) {
      setLocalError('Anna sähköposti ja salasana');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Tarkista sähköposti');
      return;
    }

    if (password.length < 6) {
      setLocalError('Salasanan tulee olla yli 6 merkkiä');
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.replace('/(app)');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kirjautuminen ei onnistunut';
      setLocalError(message);
    }
  }, [email, password, mode, signIn, signUp, router]);

  const toggleMode = useCallback(() => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setLocalError(null);
  }, [mode]);

  const displayError = localError || authError;

  return (
    <View className="flex-1 bg-white px-6 py-8 justify-center">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-4xl font-bold text-gray-900 mb-2">Tervetuloa Varasto- ja täyttö Appiin</Text>
        <Text className="text-lg text-gray-600">
          {mode === 'signin' ? 'Kirjaudu sisään' : 'Rekisteröidy'}
        </Text>
      </View>

      {/* Error Message */}
      {displayError && (
        <View className="bg-secondary-100 border border-secondary-400 rounded-lg p-4 mb-6">
          <Text className="text-secondary-700 text-sm font-semibold">{displayError}</Text>
        </View>
      )}

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Sähköposti</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
          placeholder="you@example.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Salasana</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry
          editable={!isLoading}
          value={password}
          onChangeText={setPassword}
        />
        {mode === 'signup' && (
          <Text className="text-xs text-gray-500 mt-2">Vähintään 6 merkkiä</Text>
        )}
      </View>

      {/* Auth Button */}
      <TouchableOpacity
        className={`rounded-lg py-3 flex-row items-center justify-center mb-4 ${isLoading ? 'bg-primary-400' : 'bg-primary-600 active:bg-primary-700'
          }`}
        onPress={handleAuth}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white font-semibold text-center">
            {mode === 'signin' ? 'Kirjaudu' : 'Luo tili'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Toggle Mode */}
      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-gray-600">
          {mode === 'signin' ? "Ei tunnusta?" : 'On jo tunnus?'}
        </Text>
        <TouchableOpacity onPress={toggleMode} disabled={isLoading}>
          <Text className="text-primary-600 font-semibold">
            {mode === 'signin' ? 'Rekisteröidy' : 'Kirjaudu'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
