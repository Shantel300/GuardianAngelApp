import { View, Text, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#191c1e', marginBottom: 20 }}>
          Profile
        </Text>

        {/* User Info */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              backgroundColor: '#ff5a5f',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16
            }}>
              <Text style={{ fontSize: 28 }}>👤</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#191c1e' }}>
                Sarah Johnson
              </Text>
              <Text style={{ fontSize: 12, color: '#5a403f' }}>
                Member since June 2024
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Settings
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e' }}>
            ⚙️ Preferences
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
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e' }}>
            🔐 Privacy & Security
          </Text>
        </View>

        {/* Data Management */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Data Management
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
            🗑️ Clear Chat History
          </Text>
          <Text style={{ fontSize: 12, color: '#5a403f' }}>
            Permanently erase all local chat sessions
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
            📋 View Privacy Policy
          </Text>
          <Text style={{ fontSize: 12, color: '#5a403f' }}>
            Understand how your data is handled
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
            ℹ️ About Guardian Angel
          </Text>
          <Text style={{ fontSize: 12, color: '#5a403f' }}>
            Version 0.1.0 • Prototype
          </Text>
        </View>

        {/* Logout */}
        <View style={{
          backgroundColor: '#fff3f3',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#ffb3b0',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#b52330' }}>
            Log Out
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
