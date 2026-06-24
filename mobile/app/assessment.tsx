import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RiskBadge from '../components/RiskBadge';
import { ClassificationResult } from '../services/mockClassifier';
import { THEME } from '../constants/theme';

export default function AssessmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let result: ClassificationResult | null = null;
  let userMessage = '';

  try {
    if (params.result) {
      result = JSON.parse(params.result as string);
      userMessage = (params.userMessage as string) || '';
    }
  } catch (error) {
    console.error('Error parsing result:', error);
  }

  if (!result) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f9fc' }}>
        <Text>Error loading assessment</Text>
      </View>
    );
  }

  const handleBackToChat = () => {
    router.back();
  };

  const handleGetSupport = () => {
    router.push('/(tabs)/support');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#5a403f', marginBottom: 16 }}>
            Assessment Result
          </Text>
          <RiskBadge level={result.riskLevel} size="large" />
        </View>

        {/* User Message */}
        {userMessage && (
          <View style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#e0e3e6'
          }}>
            <Text style={{ fontSize: 12, color: '#5a403f', fontWeight: '600', marginBottom: 8 }}>
              You said:
            </Text>
            <Text style={{ fontSize: 14, color: '#191c1e', lineHeight: 20 }}>
              "{userMessage}"
            </Text>
          </View>
        )}

        {/* Detected Signals */}
        {result.signals.length > 0 && (
          <View style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#e0e3e6'
          }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#191c1e', marginBottom: 12 }}>
              Detected Signals
            </Text>
            {result.signals.map((signal, idx) => (
              <View key={idx} style={{ marginBottom: idx < result.signals.length - 1 ? 12 : 0 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#191c1e' }}>
                    • {signal.label.replace(/_/g, ' ')}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#0060ac' }}>
                    {(signal.probability * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={{
                  height: 6,
                  backgroundColor: '#e0e3e6',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}>
                  <View style={{
                    height: '100%',
                    backgroundColor: '#0060ac',
                    width: `${signal.probability * 100}%`
                  }} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Reasons */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#191c1e', marginBottom: 12 }}>
            Why This Result?
          </Text>
          {result.reasons.map((reason, idx) => (
            <View key={idx} style={{ marginBottom: idx < result.reasons.length - 1 ? 8 : 0 }}>
              <Text style={{ fontSize: 14, color: '#5a403f', lineHeight: 20 }}>
                • {reason}
              </Text>
            </View>
          ))}
        </View>

        {/* Uncertainty Warning */}
        {result.uncertain && (
          <View style={{
            backgroundColor: '#fff3e0',
            padding: 12,
            borderRadius: 12,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#ff9800'
          }}>
            <Text style={{ fontSize: 12, color: '#e65100', fontWeight: '500' }}>
              ⚠️ System is uncertain. Please select how you are feeling below.
            </Text>
          </View>
        )}

        {/* Recommended Actions */}
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 30,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#191c1e', marginBottom: 12 }}>
            Suggested Next Steps
          </Text>
          {result.recommendedActions.map((action, idx) => (
            <View key={idx} style={{ marginBottom: idx < result.recommendedActions.length - 1 ? 12 : 0 }}>
              <View style={{
                backgroundColor: '#f2f4f7',
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: THEME.colors.secondary
              }}>
                <Text style={{ fontSize: 14, color: '#191c1e', fontWeight: '500' }}>
                  {action}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={{
          backgroundColor: '#f0f8ff',
          padding: 12,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#b3d9ff'
        }}>
          <Text style={{ fontSize: 11, color: '#003e73', lineHeight: 16 }}>
            ℹ️ This assessment is based on demonstration data and is not a diagnosis. If you're in crisis, please reach out to a trusted adult or emergency services.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleGetSupport}
          style={{
            backgroundColor: '#ff5a5f',
            paddingVertical: 16,
            borderRadius: 50,
            alignItems: 'center',
            marginBottom: 12
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
            Get Support Resources
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBackToChat}
          style={{
            backgroundColor: '#fff',
            paddingVertical: 16,
            borderRadius: 50,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#e0e3e6',
            marginBottom: 40
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#0060ac' }}>
            Back to Chat
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
