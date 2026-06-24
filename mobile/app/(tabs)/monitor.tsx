import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { WEARABLE_SCENARIOS } from '../../data/wearableScenarios';
import { THEME, RISK_LEVELS } from '../../constants/theme';

type CurrentReading = {
  heartRate: number;
  hrv: number;
  activity: string;
  sleepScore: number;
  timestamp: number;
};

export default function MonitorScreen() {
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(WEARABLE_SCENARIOS[0]);
  const [currentReading, setCurrentReading] = useState(currentScenario.readings[0]);
  const [readingIndex, setReadingIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-cycle through readings
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setReadingIndex(prev => {
          const nextIndex = (prev + 1) % currentScenario.readings.length;
          setCurrentReading(currentScenario.readings[nextIndex]);
          return nextIndex;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isAnimating, currentScenario]);

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = WEARABLE_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setCurrentScenario(scenario);
    setReadingIndex(0);
    setCurrentReading(scenario.readings[0]);
    setIsAnimating(true);

    if (scenario.shouldAlert) {
      // Trigger check-in after a moment
      setTimeout(() => {
        handleAlert(scenario.name);
      }, 3000);
    }
  };

  const handleAlert = (scenarioName: string) => {
    Alert.alert(
      'Wellbeing Check-In',
      'Your body signals have changed. Are you okay?',
      [
        {
          text: 'I\'m fine',
          onPress: () => {
            Alert.alert('Good', 'Stay safe and keep taking care of yourself.');
            setIsAnimating(false);
          }
        },
        {
          text: 'I\'m exercising',
          onPress: () => {
            Alert.alert('Understood', 'Remember to stay hydrated!');
            setIsAnimating(false);
          }
        },
        {
          text: 'I feel stressed',
          onPress: () => {
            Alert.alert(
              'Support Available',
              'Would you like to try a grounding exercise?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Try Grounding',
                  onPress: () => {
                    router.push('/(tabs)/support');
                  }
                }
              ]
            );
          }
        },
        {
          text: 'I need help',
          onPress: () => {
            Alert.alert(
              'Help Available',
              'Would you like to contact a trusted person or access SOS?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Chat with Guardian',
                  onPress: () => {
                    router.push('/(tabs)/chat');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const activityEmojis: Record<string, string> = {
    resting: '🧘',
    walking: '🚶',
    exercise: '🏃'
  };

  const getActivityLabel = (activity: string) => {
    return activity.charAt(0).toUpperCase() + activity.slice(1);
  };

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
          <Text style={{ fontSize: 14, color: '#191c1e', fontWeight: '500' }}>
            ⚠️ Simulated Data (Prototype Only)
          </Text>
          <Text style={{ fontSize: 12, color: '#5a403f', marginTop: 8 }}>
            Current Scenario: <Text style={{ fontWeight: '700', color: '#ff5a5f' }}>{currentScenario.name}</Text>
          </Text>
        </View>

        {/* Current Readings */}
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
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#ff5a5f' }}>
                {currentReading.heartRate}
              </Text>
              <Text style={{ fontSize: 11, color: '#5a403f', marginTop: 2 }}>BPM</Text>
            </View>
            <Text style={{ fontSize: 36 }}>❤️</Text>
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
              <Text style={{ fontSize: 12, color: '#5a403f', marginBottom: 4 }}>HRV (Heart Rate Variability)</Text>
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#0060ac' }}>
                {currentReading.hrv}
              </Text>
              <Text style={{ fontSize: 11, color: '#5a403f', marginTop: 2 }}>ms</Text>
            </View>
            <Text style={{ fontSize: 36 }}>📈</Text>
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
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#006d37' }}>
                {getActivityLabel(currentReading.activity)}
              </Text>
            </View>
            <Text style={{ fontSize: 36 }}>
              {activityEmojis[currentReading.activity] || '🧘'}
            </Text>
          </View>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 16,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: '#5a403f', marginBottom: 4 }}>Sleep Quality Score</Text>
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#006d37' }}>
                {currentReading.sleepScore}
              </Text>
              <Text style={{ fontSize: 11, color: '#5a403f', marginTop: 2 }}>/100</Text>
            </View>
            <Text style={{ fontSize: 36 }}>😴</Text>
          </View>
        </View>

        {/* Scenario Buttons */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 12, textTransform: 'uppercase' }}>
          Test Scenarios
        </Text>

        {WEARABLE_SCENARIOS.map((scenario) => {
          const isActive = scenario.id === currentScenario.id;
          return (
            <TouchableOpacity
              key={scenario.id}
              onPress={() => handleScenarioSelect(scenario.id)}
              style={{
                backgroundColor: isActive ? '#ff5a5f' : '#fff',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: isActive ? '#ff5a5f' : '#e0e3e6'
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: isActive ? '#fff' : '#191c1e',
                    marginBottom: 4
                  }}>
                    {scenario.name}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: isActive ? '#ffb3b0' : '#5a403f'
                  }}>
                    {scenario.description}
                  </Text>
                </View>
                {isActive && (
                  <View style={{
                    backgroundColor: '#fff',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#ff5a5f' }}>
                      ACTIVE
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Animation Control */}
        {currentScenario.shouldAlert && (
          <View style={{
            backgroundColor: '#fff3e0',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginTop: 20,
            marginBottom: 40,
            borderLeftWidth: 4,
            borderLeftColor: '#ff9800'
          }}>
            <Text style={{ fontSize: 12, color: '#e65100', fontWeight: '500', marginBottom: 8 }}>
              ⚠️ This scenario will trigger a check-in alert in 3 seconds.
            </Text>
            <Text style={{ fontSize: 11, color: '#e65100' }}>
              Response options: "I'm fine", "I'm exercising", "I feel stressed", "I need help"
            </Text>
          </View>
        )}

        {currentScenario.id === WEARABLE_SCENARIOS[0].id && (
          <View style={{
            backgroundColor: '#e8f5e9',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginTop: 20,
            marginBottom: 40,
            borderLeftWidth: 4,
            borderLeftColor: '#006d37'
          }}>
            <Text style={{ fontSize: 12, color: '#003517', fontWeight: '500' }}>
              ✓ All readings normal. No alerts triggered.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
