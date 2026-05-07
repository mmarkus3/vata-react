import { useAuth } from '@/hooks/useAuth';
import { FC, useCallback, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AuthMode = 'signin' | 'signup' | 'forgot';

const LoginScreen: FC = () => {
  const { signIn, signUp, forgotPassword, isLoading, error: authError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAuth = useCallback(async () => {
    setLocalError(null);

    // Validation
    if (!email || (mode !== 'forgot' && !password)) {
      setLocalError('Anna sähköposti ja salasana');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Tarkista sähköposti');
      return;
    }

    if (mode !== 'forgot' && password.length < 6) {
      setLocalError('Salasanan tulee olla yli 6 merkkiä');
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password);
      } else {
        await forgotPassword(email);
      }
      // Navigation will be handled by the layout based on auth state
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kirjautuminen ei onnistunut';
      setLocalError(message);
    }
  }, [email, password, mode, signIn, signUp, forgotPassword]);

  const toggleMode = useCallback((newMode: AuthMode) => {
    if (newMode === 'forgot') {
      setMode(mode === 'signin' ? 'forgot' : 'signin');
    } else {
      setMode(mode === 'signin' ? 'signup' : 'signin');
    }
    setLocalError(null);
  }, [mode]);

  const displayError = localError || authError;

  return (
    <View className="flex-1 bg-white px-6 py-8 justify-center">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-4xl font-bold text-gray-900 mb-2">Tervetuloa Varasto- ja täyttö Appiin</Text>
        <Text className="text-lg text-gray-600">
          {mode === 'signin' ? 'Kirjaudu sisään' : mode === 'forgot' ? 'Palauta salasana' : 'Rekisteröidy'}
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
      {['signin', 'signup'].includes(mode) && (
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
      )}

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
            {mode === 'signin' ? 'Kirjaudu' : mode === 'forgot' ? 'Palauta' : 'Luo tili'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Toggle Mode */}
      {['signin', 'forgot'].includes(mode) && (
        <View className="flex-row items-center justify-center gap-2 mb-2">
          {mode === 'signin' && (
            <Text className="text-gray-600">
              Salasana unohtunut?
            </Text>
          )}
          <TouchableOpacity onPress={() => toggleMode('forgot')} disabled={isLoading}>
            <Text className="text-primary-600 font-semibold">
              {mode === 'signin' ? 'Palauta' : 'Peruuta'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {['signin', 'signup'].includes(mode) && (
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-gray-600">
            {mode === 'signin' ? "Ei tunnusta?" : 'On jo tunnus?'}
          </Text>
          <TouchableOpacity onPress={() => toggleMode('signup')} disabled={isLoading}>
            <Text className="text-primary-600 font-semibold">
              {mode === 'signin' ? 'Rekisteröidy' : 'Kirjaudu'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
