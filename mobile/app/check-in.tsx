import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';

type CheckInOption = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  nextAction: () => void;
};

export default function CheckInScreen() {
  const router = useRouter();

  const checkInOptions: CheckInOption[] = [
    {
      id: 'fine',
      label: "I'm fine",
      description: 'Close the alert and continue your day',
      emoji: '✓',
      nextAction: () => {
        router.back();
      }
    },
    {
      id: 'exercising',
      label: "I'm exercising",
      description: 'Heart rate changes explained by activity',
      emoji: '🏃',
      nextAction: () => {
        router.back();
      }
    },
    {
      id: 'stressed',
      label: 'I feel stressed',
      description: 'Get support with grounding exercises',
      emoji: '😰',
      nextAction: () => {
        router.replace('/(tabs)/support');
      }
    },
    {
      id: 'cravings',
      label: "I'm experiencing cravings",
      description: 'Access recovery support resources',
      emoji: '🆘',
      nextAction: () => {
        router.replace('/(tabs)/support');
      }
    },
    {
      id: 'help',
      label: 'I need help',
      description: 'Connect with a trusted person or emergency services',
      emoji: '🚨',
      nextAction: () => {
        router.replace('/(tabs)/chat');
      }
    }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#191c1e', marginBottom: 12 }}>
          Wellbeing Check-In
        </Text>
        <Text style={{ fontSize: 16, color: '#5a403f', marginBottom: 40 }}>
          Your body signals have changed. Are you okay?
        </Text>

        {/* Alert Badge */}
        <View style={{
          backgroundColor: '#fff3e0',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderRadius: 16,
          marginBottom: 30,
          borderLeftWidth: 4,
          borderLeftColor: '#ff9800'
        }}>
          <Text style={{ fontSize: 14, color: '#e65100', fontWeight: '500' }}>
            ⚠️ We noticed an unusual pattern in your wellbeing signals
          </Text>
        </View>

        {/* Check-In Options */}
        {checkInOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={option.nextAction}
            style={{
              backgroundColor: '#fff',
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#e0e3e6'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 28, marginRight: 16 }}>{option.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#191c1e', marginBottom: 4 }}>
                  {option.label}
                </Text>
                <Text style={{ fontSize: 14, color: '#5a403f' }}>
                  {option.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Disclaimer */}
        <View style={{
          backgroundColor: '#f0f8ff',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          marginTop: 30,
          borderWidth: 1,
          borderColor: '#b3d9ff'
        }}>
          <Text style={{ fontSize: 11, color: '#003e73', lineHeight: 16 }}>
            ℹ️ This check-in is part of your wellbeing support. Your responses help personalize your experience but are not stored.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
