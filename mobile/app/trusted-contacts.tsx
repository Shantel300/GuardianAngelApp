import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import PageHeader from '../components/PageHeader';
import BentoCard from '../components/BentoCard';
import PrimaryButton from '../components/PrimaryButton';
import { TrustedContact, useGuardian } from '../context/GuardianContext';
import { COLORS, RADIUS, SPACING, TYPE } from '../constants/theme';

export default function TrustedContactsScreen() {
  const { width } = useWindowDimensions();
  const narrow = width < 380;
  const { trustedContacts, setTrustedContacts } = useGuardian();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPhone('');
  };

  const save = () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    if (!cleanName || !/^[+\d][\d\s-]{5,}$/.test(cleanPhone)) {
      Alert.alert('Check the details', 'Enter a name and a valid phone number.');
      return;
    }
    if (editingId) {
      setTrustedContacts(
        trustedContacts.map((contact) =>
          contact.id === editingId
            ? { ...contact, name: cleanName, phone: cleanPhone }
            : contact
        )
      );
    } else {
      setTrustedContacts([
        ...trustedContacts,
        {
          id: `${Date.now()}`,
          name: cleanName,
          phone: cleanPhone,
          isDefault: trustedContacts.length === 0,
        },
      ]);
    }
    resetForm();
  };

  const edit = (contact: TrustedContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
  };

  const remove = (contact: TrustedContact) => {
    Alert.alert('Remove trusted contact?', contact.name, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          setTrustedContacts(
            trustedContacts.filter((item) => item.id !== contact.id)
          ),
      },
    ]);
  };

  const makeDefault = (id: string) =>
    setTrustedContacts(
      trustedContacts.map((contact) => ({
        ...contact,
        isDefault: contact.id === id,
      }))
    );

  const prepareMessage = (contact: TrustedContact) => {
    Alert.alert(
      `Message ${contact.name}?`,
      'A neutral check-in message will be prepared. You must press Send yourself.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Prepare',
          onPress: async () => {
            const body = encodeURIComponent(
              'Could you please check in with me when you can?'
            );
            const separator = Platform.OS === 'ios' ? '&' : '?';
            const url = `sms:${contact.phone}${separator}body=${body}`;
            if (await Linking.canOpenURL(url)) await Linking.openURL(url);
            else Alert.alert('Messaging unavailable', 'Please contact them manually.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PageHeader title="Trusted Contacts" subtitle="Encrypted on this device" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <BentoCard>
            <Text style={styles.formTitle}>
              {editingId ? 'Edit contact' : 'Add a trusted person'}
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nickname or first name"
              placeholderTextColor={COLORS.outline}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor={COLORS.outline}
              keyboardType="phone-pad"
            />
            <View style={styles.formActions}>
              {editingId && (
                <PrimaryButton
                  label="Cancel"
                  variant="ghost"
                  onPress={resetForm}
                  style={styles.action}
                />
              )}
              <PrimaryButton
                label={editingId ? 'Save changes' : 'Add contact'}
                icon="person-add"
                onPress={save}
                style={styles.action}
              />
            </View>
          </BentoCard>

          {trustedContacts.length === 0 ? (
            <View style={styles.empty}>
              <MaterialIcons name="group-add" size={42} color={COLORS.outline} />
              <Text style={styles.emptyTitle}>No trusted contacts yet</Text>
              <Text style={styles.emptyText}>
                Add someone you would feel comfortable contacting for support.
              </Text>
            </View>
          ) : (
            trustedContacts.map((contact) => (
              <BentoCard key={contact.id} style={[styles.contact, narrow && styles.contactNarrow]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {contact.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.contactText, narrow && styles.contactTextNarrow]}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{contact.name}</Text>
                    {contact.isDefault && (
                      <Text style={styles.defaultBadge}>DEFAULT</Text>
                    )}
                  </View>
                  <Text style={styles.phone}>{contact.phone}</Text>
                  {!contact.isDefault && (
                    <Pressable onPress={() => makeDefault(contact.id)}>
                      <Text style={styles.link}>Make default</Text>
                    </Pressable>
                  )}
                </View>
                <View style={styles.contactActions}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => prepareMessage(contact)}
                    accessibilityLabel={`Prepare message to ${contact.name}`}
                  >
                    <MaterialIcons name="sms" size={20} color={COLORS.tertiary} />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => edit(contact)}
                    accessibilityLabel={`Edit ${contact.name}`}
                  >
                    <MaterialIcons name="edit" size={20} color={COLORS.secondary} />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => remove(contact)}
                    accessibilityLabel={`Remove ${contact.name}`}
                  >
                    <MaterialIcons name="delete-outline" size={21} color={COLORS.primary} />
                  </Pressable>
                </View>
              </BentoCard>
            ))
          )}

          <View style={styles.note}>
            <MaterialIcons name="info-outline" size={17} color={COLORS.secondary} />
            <Text style={styles.noteText}>
              Guardian Angel never contacts anyone automatically in this prototype.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scroll: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: SPACING.page,
    paddingBottom: 28,
    gap: 12,
  },
  formTitle: { ...TYPE.titleSm, color: COLORS.onSurface, marginBottom: 8 },
  input: {
    ...TYPE.bodyMd,
    color: COLORS.onSurface,
    minHeight: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceLow,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  formActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  action: { flex: 1 },
  empty: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20 },
  emptyTitle: { ...TYPE.titleSm, color: COLORS.onSurface, marginTop: 10 },
  emptyText: {
    ...TYPE.bodyMd,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },
  contact: { flexDirection: 'row', alignItems: 'center', minHeight: 82 },
  contactNarrow: { flexWrap: 'wrap' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.secondaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...TYPE.titleSm, color: COLORS.secondary },
  contactText: { flex: 1, marginLeft: 12 },
  contactTextNarrow: { minWidth: 150 },
  contactActions: { flexDirection: 'row', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  name: { ...TYPE.titleSm, color: COLORS.onSurface },
  phone: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 2 },
  defaultBadge: {
    ...TYPE.labelSm,
    fontSize: 9,
    color: COLORS.tertiary,
    backgroundColor: COLORS.tertiaryTint,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  link: { ...TYPE.labelSm, color: COLORS.secondary, marginTop: 5 },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: COLORS.secondaryTint,
    borderRadius: RADIUS.md,
  },
  noteText: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, flex: 1 },
});
