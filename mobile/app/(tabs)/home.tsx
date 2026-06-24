import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#191c1e' }}>
              Hi, Sarah! 👋
            </Text>
            <Text style={{ fontSize: 14, color: '#5a403f' }}>
              How are you today?
            </Text>
          </View>
          <View style={{
            backgroundColor: '#ff5a5f',
            width: 50,
            height: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 24 }}>🛡️</Text>
          </View>
        </View>

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
            Guardian Mode: Active
          </Text>
          <View style={{
            backgroundColor: '#e8f5e9',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            alignSelf: 'flex-start'
          }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#006d37' }}>
              🟢 Connected 24/7
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Quick Actions
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>💬</Text>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e' }}>
              Talk Privately
            </Text>
            <Text style={{ fontSize: 12, color: '#5a403f' }}>
              Chat with Guardian Angel
            </Text>
          </View>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>📊</Text>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e' }}>
              Start Monitoring
            </Text>
            <Text style={{ fontSize: 12, color: '#5a403f' }}>
              Track your wellbeing
            </Text>
          </View>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>🆘</Text>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e' }}>
              Emergency SOS
            </Text>
            <Text style={{ fontSize: 12, color: '#5a403f' }}>
              Get immediate support
            </Text>
          </View>
        </View>

        {/* Device Status */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#e0e3e6',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>Device Battery</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#006d37' }}>92%</Text>
        </View>
      </View>
    </ScrollView>
  );
}
