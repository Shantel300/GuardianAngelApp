import { View, Text, ScrollView } from 'react-native';

export default function SupportScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#191c1e', marginBottom: 20 }}>
          Support Resources
        </Text>

        {/* Coping Tools */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Coping Tools
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            🧘 Guided Breathing
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Calm your mind with guided breathing exercises
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            👃 Five Senses Grounding
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Ground yourself in the present moment
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            🚫 Peer-Pressure Refusal
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Practice saying no confidently
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            ⏱️ Craving Delay Timer
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Wait out the urge with a countdown timer
          </Text>
        </View>

        {/* Get Help */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Get Help
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            👥 Contact Trusted Person
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Call or message someone you trust
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            👨‍⚕️ Request Counselor Support
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Share with a counselor for professional guidance
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 8 }}>
            🆘 Emergency SOS
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Get immediate emergency support
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
