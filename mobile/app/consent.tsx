import { View, Text, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function ConsentScreen() {
  const [chatbotConsent, setChatbotConsent] = useState(true);
  const [monitoringConsent, setMonitoringConsent] = useState(false);
  const [alertsConsent, setAlertsConsent] = useState(false);
  const [referralConsent, setReferralConsent] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#191c1e', marginBottom: 10 }}>
          Privacy & Consent
        </Text>
        <Text style={{ fontSize: 14, color: '#5a403f', marginBottom: 30 }}>
          Guardian Angel respects your privacy. You control what is shared.
        </Text>

        {/* Chatbot Processing */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', flex: 1 }}>
              Private Chatbot
            </Text>
            <Switch value={chatbotConsent} onValueChange={setChatbotConsent} />
          </View>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Analyze my messages for wellbeing signals. Conversations are not saved.
          </Text>
        </View>

        {/* Wearable Monitoring */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', flex: 1 }}>
              Simulated Monitoring
            </Text>
            <Switch value={monitoringConsent} onValueChange={setMonitoringConsent} />
          </View>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Track simulated heart rate, activity, and sleep patterns.
          </Text>
        </View>

        {/* Trust Contact Alerts */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', flex: 1 }}>
              Trusted Contact Alerts
            </Text>
            <Switch value={alertsConsent} onValueChange={setAlertsConsent} />
          </View>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Send limited alerts to your trusted contacts if unusual patterns are detected.
          </Text>
        </View>

        {/* Referral Sharing */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', flex: 1 }}>
              Referral Sharing
            </Text>
            <Switch value={referralConsent} onValueChange={setReferralConsent} />
          </View>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Share pseudonymous data with counselor services (you approve each share).
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff3f3',
          padding: 16,
          borderRadius: 16,
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#ffb3b0'
        }}>
          <Text style={{ fontSize: 12, color: '#61000e', fontWeight: '500' }}>
            ⚠️ Essential consent required: You must enable Private Chatbot to continue.
          </Text>
        </View>

        {chatbotConsent && (
          <Link href="/(tabs)" asChild>
            <View style={{
              backgroundColor: '#ff5a5f',
              paddingVertical: 16,
              borderRadius: 50,
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                Get Started
              </Text>
            </View>
          </Link>
        )}

        {!chatbotConsent && (
          <View style={{
            backgroundColor: '#d8dadd',
            paddingVertical: 16,
            borderRadius: 50,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#5a403f' }}>
              Get Started
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
