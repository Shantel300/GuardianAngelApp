import { View, Text, ScrollView } from 'react-native';

export default function MonitorScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#191c1e', marginBottom: 20 }}>
          Wearable Monitor
        </Text>

        {/* Status Card */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#5a403f', marginBottom: 10 }}>
            Monitoring Status
          </Text>
          <Text style={{ fontSize: 14, color: '#191c1e' }}>
            ⚠️ Simulated Data (Prototype Only)
          </Text>
        </View>

        {/* Metrics */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Current Readings
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: '#5a403f', marginBottom: 4 }}>Heart Rate</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#ff5a5f' }}>72 BPM</Text>
            </View>
            <Text style={{ fontSize: 32 }}>❤️</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: '#5a403f', marginBottom: 4 }}>HRV</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#0060ac' }}>45 ms</Text>
            </View>
            <Text style={{ fontSize: 32 }}>📈</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: '#5a403f', marginBottom: 4 }}>Activity Level</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#006d37' }}>Resting</Text>
            </View>
            <Text style={{ fontSize: 32 }}>🧘</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: '#5a403f', marginBottom: 4 }}>Sleep Score</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#006d37' }}>78/100</Text>
            </View>
            <Text style={{ fontSize: 32 }}>😴</Text>
          </View>
        </View>

        {/* Scenarios */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Test Scenarios
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 16,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1e' }}>Normal</Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 16,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1e' }}>Exercising</Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 16,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1e' }}>Elevated Stress</Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1e' }}>Recovery Risk</Text>
        </View>
      </View>
    </ScrollView>
  );
}
