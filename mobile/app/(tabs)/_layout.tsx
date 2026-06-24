import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT, SHADOW } from '../../constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <MaterialIcons name={name} size={size} color={color} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryContainer,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceLowest,
          borderTopColor: 'rgba(226,190,188,0.3)',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          ...SHADOW.nav,
        },
        tabBarLabelStyle: {
          fontFamily: FONT.semibold,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="monitor" options={{ title: 'Monitor', tabBarIcon: tabIcon('monitor-heart') }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: tabIcon('forum') }} />
      <Tabs.Screen name="support" options={{ title: 'Support', tabBarIcon: tabIcon('volunteer-activism') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}
