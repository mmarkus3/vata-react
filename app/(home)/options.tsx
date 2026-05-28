import {
  buildCompanyOptionsPayload,
  emptyCompanyOptionsFormValues,
  toCompanyOptionsFormValues,
  validateCompanyOptionsForm,
  type CompanyOptionsFormValues,
} from '@/app/options/companyOptionsForm';
import Loading from '@/components/ui/loading';
import { useAuth } from '@/hooks/useAuth';
import { getCompanyOptions, updateCompanyOptions } from '@/services/options';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CompanyOptionsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const companyId = user?.profile?.company;
  const [values, setValues] = useState<CompanyOptionsFormValues>(emptyCompanyOptionsFormValues);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      if (!companyId) {
        setError(t('companyOptions.errors.companyMissing'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const options = await getCompanyOptions(companyId);

        if (isMounted) {
          setValues(toCompanyOptionsFormValues(options));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : t('companyOptions.errors.loadFailed'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOptions();

    return () => {
      isMounted = false;
    };
  }, [companyId, t]);

  const updateField = <K extends keyof CompanyOptionsFormValues>(field: K, value: CompanyOptionsFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const saveOptions = async () => {
    if (!companyId) {
      setError(t('companyOptions.errors.companyMissing'));
      return;
    }

    const validationError = validateCompanyOptionsForm(values);
    if (validationError) {
      setError(t(validationError));
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      await updateCompanyOptions(companyId, buildCompanyOptionsPayload(values));
      setSuccess(t('companyOptions.saved'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('companyOptions.errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!companyId) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-center text-base font-semibold text-gray-900">{t('companyOptions.errors.companyMissing')}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="px-4 py-5">
      <View className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">{t('companyOptions.title')}</Text>
        <Text className="mt-2 text-sm text-gray-500">{t('companyOptions.description')}</Text>

        <OptionField label={t('companyOptions.fields.delivery')} value={values.delivery} keyboardType="decimal-pad" onChangeText={(value) => updateField('delivery', value)} />
        <OptionField label={t('companyOptions.fields.over')} value={values.over} keyboardType="decimal-pad" onChangeText={(value) => updateField('over', value)} />
        <OptionField label={t('companyOptions.fields.vat')} value={values.vat} keyboardType="decimal-pad" onChangeText={(value) => updateField('vat', value)} />
        <OptionField label={t('companyOptions.fields.email')} value={values.email} keyboardType="email-address" autoCapitalize="none" onChangeText={(value) => updateField('email', value)} />

        <View className="mt-6 border-t border-gray-100 pt-5">
          <Text className="text-lg font-semibold text-gray-900">{t('companyOptions.vismapayTitle')}</Text>
          <OptionField label={t('companyOptions.fields.vismapayApiKey')} value={values.vismapayApiKey} autoCapitalize="none" onChangeText={(value) => updateField('vismapayApiKey', value)} />
          <OptionField label={t('companyOptions.fields.vismapayPrivateKey')} value={values.vismapayPrivateKey} autoCapitalize="none" onChangeText={(value) => updateField('vismapayPrivateKey', value)} />
        </View>

        {error ? <Text className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</Text> : null}
        {success ? <Text className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</Text> : null}

        <TouchableOpacity
          className={`mt-6 rounded-2xl py-4 ${isSaving ? 'bg-gray-400' : 'bg-primary-600 active:bg-primary-700'}`}
          onPress={saveOptions}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          <Text className="text-center text-base font-semibold text-white">
            {isSaving ? t('companyOptions.saving') : t('companyOptions.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

interface OptionFieldProps {
  label: string;
  value: string;
  keyboardType?: 'default' | 'decimal-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onChangeText: (value: string) => void;
}

function OptionField({ label, value, keyboardType = 'default', autoCapitalize = 'sentences', onChangeText }: OptionFieldProps) {
  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-semibold text-gray-700">{label}</Text>
      <TextInput
        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900"
        value={value}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onChangeText={onChangeText}
      />
    </View>
  );
}
