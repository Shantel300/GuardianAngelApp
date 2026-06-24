import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export type GuardianPreferences = {
  nickname: string;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  supportivePrompts: boolean;
  wellbeingNotifications: boolean;
};

export type GuardianConsent = {
  chatbot: boolean;
  monitoring: boolean;
  alerts: boolean;
  referral: boolean;
};

export type TrustedContact = {
  id: string;
  name: string;
  phone: string;
  isDefault: boolean;
};

export type GuardianChatMessage = {
  id: number;
  type: 'user' | 'assistant';
  text: string;
};

type NotificationStatus = 'unknown' | 'granted' | 'denied';

type GuardianContextValue = {
  ready: boolean;
  preferences: GuardianPreferences;
  consent: GuardianConsent;
  trustedContacts: TrustedContact[];
  chatMessages: GuardianChatMessage[];
  monitoringActive: boolean;
  notificationStatus: NotificationStatus;
  updatePreferences: (patch: Partial<GuardianPreferences>) => void;
  updateConsent: (patch: Partial<GuardianConsent>) => void;
  setTrustedContacts: (contacts: TrustedContact[]) => void;
  addChatMessage: (type: GuardianChatMessage['type'], text: string) => void;
  clearChat: () => void;
  setMonitoringActive: (active: boolean) => void;
  setNotificationStatus: (status: NotificationStatus) => void;
  clearSession: () => void;
  resetLocalData: () => Promise<void>;
};

const PREFERENCES_KEY = 'guardian.preferences.v1';
const CONSENT_KEY = 'guardian.consent.v1';
const CONTACTS_KEY = 'guardian.trusted-contacts.v1';
const INITIAL_MESSAGE: GuardianChatMessage = {
  id: 0,
  type: 'assistant',
  text: "Hi! I'm here to listen. What's on your mind?",
};

const DEFAULT_PREFERENCES: GuardianPreferences = {
  nickname: 'Friend',
  hapticsEnabled: true,
  reducedMotion: false,
  supportivePrompts: true,
  wellbeingNotifications: true,
};

const DEFAULT_CONSENT: GuardianConsent = {
  chatbot: true,
  monitoring: false,
  alerts: false,
  referral: false,
};

const GuardianContext = createContext<GuardianContextValue | null>(null);

function parseStored<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return { ...fallback, ...JSON.parse(value) };
  } catch {
    return fallback;
  }
}

export function GuardianProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] =
    useState<GuardianPreferences>(DEFAULT_PREFERENCES);
  const [consent, setConsent] = useState<GuardianConsent>(DEFAULT_CONSENT);
  const [trustedContacts, setTrustedContactsState] = useState<TrustedContact[]>([]);
  const [chatMessages, setChatMessages] = useState<GuardianChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>('unknown');

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      const [storedPreferences, storedConsent, storedContacts] =
        await Promise.all([
          AsyncStorage.getItem(PREFERENCES_KEY).catch(() => null),
          AsyncStorage.getItem(CONSENT_KEY).catch(() => null),
          SecureStore.getItemAsync(CONTACTS_KEY).catch(() => null),
        ]);
      if (!mounted) return;
      setPreferences(parseStored(storedPreferences, DEFAULT_PREFERENCES));
      setConsent(parseStored(storedConsent, DEFAULT_CONSENT));
      try {
        setTrustedContacts(storedContacts ? JSON.parse(storedContacts) : []);
      } catch {
        setTrustedContacts([]);
      }
      setReady(true);
    };
    void hydrate().catch(() => setReady(true));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)).catch(
      () => {}
    );
  }, [preferences, ready]);

  useEffect(() => {
    if (!ready) return;
    void AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(consent)).catch(
      () => {}
    );
  }, [consent, ready]);

  useEffect(() => {
    if (!ready) return;
    void SecureStore.setItemAsync(
      CONTACTS_KEY,
      JSON.stringify(trustedContacts)
    ).catch(() => {});
  }, [trustedContacts, ready]);

  const updatePreferences = useCallback(
    (patch: Partial<GuardianPreferences>) =>
      setPreferences((current) => ({ ...current, ...patch })),
    []
  );

  const updateConsent = useCallback(
    (patch: Partial<GuardianConsent>) =>
      setConsent((current) => ({ ...current, ...patch })),
    []
  );

  const setTrustedContacts = useCallback((contacts: TrustedContact[]) => {
    const hasDefault = contacts.some((contact) => contact.isDefault);
    setTrustedContactsState(
      contacts.map((contact, index) => ({
        ...contact,
        isDefault: hasDefault ? contact.isDefault : index === 0,
      }))
    );
  }, []);

  const addChatMessage = useCallback(
    (type: GuardianChatMessage['type'], text: string) => {
      setChatMessages((current) => [
        ...current,
        { id: Date.now() + current.length, type, text },
      ]);
    },
    []
  );

  const clearChat = useCallback(() => setChatMessages([INITIAL_MESSAGE]), []);

  const clearSession = useCallback(() => {
    clearChat();
    setMonitoringActive(false);
  }, [clearChat]);

  const resetLocalData = useCallback(async () => {
    await Promise.all([
      AsyncStorage.multiRemove([PREFERENCES_KEY, CONSENT_KEY]),
      SecureStore.deleteItemAsync(CONTACTS_KEY),
    ]);
    setPreferences(DEFAULT_PREFERENCES);
    setConsent(DEFAULT_CONSENT);
    setTrustedContactsState([]);
    setNotificationStatus('unknown');
    clearSession();
  }, [clearSession]);

  const value = useMemo<GuardianContextValue>(
    () => ({
      ready,
      preferences,
      consent,
      trustedContacts,
      chatMessages,
      monitoringActive,
      notificationStatus,
      updatePreferences,
      updateConsent,
      setTrustedContacts,
      addChatMessage,
      clearChat,
      setMonitoringActive,
      setNotificationStatus,
      clearSession,
      resetLocalData,
    }),
    [
      ready,
      preferences,
      consent,
      trustedContacts,
      chatMessages,
      monitoringActive,
      notificationStatus,
      updatePreferences,
      updateConsent,
      setTrustedContacts,
      addChatMessage,
      clearChat,
      clearSession,
      resetLocalData,
    ]
  );

  return (
    <GuardianContext.Provider value={value}>
      {children}
    </GuardianContext.Provider>
  );
}

export function useGuardian() {
  const value = useContext(GuardianContext);
  if (!value) {
    throw new Error('useGuardian must be used inside GuardianProvider');
  }
  return value;
}
