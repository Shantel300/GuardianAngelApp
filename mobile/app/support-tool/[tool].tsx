import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import PageHeader from '../../components/PageHeader';
import BentoCard from '../../components/BentoCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useGuardian } from '../../context/GuardianContext';
import { COLORS, RADIUS, SPACING, TYPE } from '../../constants/theme';

const GROUNDING = [
  'Name 5 things you can see',
  'Notice 4 things you can touch',
  'Listen for 3 things you can hear',
  'Find 2 things you can smell',
  'Notice 1 thing you can taste',
];

const PHRASES = [
  'No thanks, I am looking after myself today.',
  'I am not comfortable with that. Let us do something else.',
  'I have made my decision. Please respect it.',
  'I need to leave now. I will talk to you later.',
];

function ToolShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PageHeader title={title} subtitle={subtitle} />
      <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
    </SafeAreaView>
  );
}

function BreathingTool() {
  const { preferences } = useGuardian();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('Ready');
  const scale = useRef(new Animated.Value(0.72)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  const stop = () => {
    animation.current?.stop();
    setRunning(false);
    setPhase('Paused');
  };

  const start = () => {
    setRunning(true);
    if (preferences.reducedMotion) {
      setPhase('Breathe slowly');
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.72,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.current = loop;
    setPhase('Breathe in, then out slowly');
    loop.start();
  };

  useEffect(() => () => animation.current?.stop(), []);

  return (
    <ToolShell title="Guided Breathing" subtitle="A private paced-breathing exercise">
      <BentoCard style={styles.centerCard}>
        <Animated.View style={[styles.breatheCircle, { transform: [{ scale }] }]}>
          <MaterialIcons name="air" size={48} color={COLORS.secondary} />
        </Animated.View>
        <Text style={styles.bigPrompt}>{phase}</Text>
        <Text style={styles.body}>
          Let your shoulders soften. Breathe in gently for four counts and out
          for six. Stop if this feels uncomfortable.
        </Text>
      </BentoCard>
      <View style={styles.actionRow}>
        <PrimaryButton
          label={running ? 'Pause' : 'Start'}
          icon={running ? 'pause' : 'play-arrow'}
          onPress={running ? stop : start}
          style={styles.flexButton}
        />
        <PrimaryButton
          label="Reset"
          variant="secondary"
          onPress={() => {
            animation.current?.stop();
            scale.setValue(0.72);
            setRunning(false);
            setPhase('Ready');
          }}
          style={styles.flexButton}
        />
      </View>
    </ToolShell>
  );
}

function GroundingTool() {
  const { preferences } = useGuardian();
  const [step, setStep] = useState(0);
  const complete = step >= GROUNDING.length;

  return (
    <ToolShell title="Five Senses Grounding" subtitle="Reconnect with the present moment">
      <BentoCard style={styles.centerCard}>
        <Text style={styles.stepCounter}>
          {complete ? 'COMPLETE' : `STEP ${step + 1} OF ${GROUNDING.length}`}
        </Text>
        <MaterialIcons
          name={complete ? 'check-circle' : 'spa'}
          size={62}
          color={complete ? COLORS.tertiary : COLORS.secondary}
        />
        <Text style={styles.bigPrompt}>
          {complete ? 'You completed the grounding exercise.' : GROUNDING[step]}
        </Text>
        <Text style={styles.body}>
          Take your time. Nothing you type or notice here is recorded.
        </Text>
      </BentoCard>
      <PrimaryButton
        label={complete ? 'Start again' : step === 0 ? 'Begin' : 'Next step'}
        icon={complete ? 'refresh' : 'arrow-forward'}
        onPress={() => {
          if (preferences.hapticsEnabled) {
            void Haptics.selectionAsync();
          }
          setStep(complete ? 0 : step + 1);
        }}
      />
      {step > 0 && !complete && (
        <PrimaryButton
          label="Previous step"
          variant="ghost"
          onPress={() => setStep((value) => Math.max(0, value - 1))}
        />
      )}
    </ToolShell>
  );
}

function RefusalTool() {
  const [copied, setCopied] = useState<number | null>(null);

  return (
    <ToolShell title="Refusal Phrases" subtitle="Practise clear, confident boundaries">
      <Text style={styles.body}>
        Tap a phrase to copy it. Adjust the wording so it sounds natural to you.
      </Text>
      {PHRASES.map((phrase, index) => (
        <BentoCard
          key={phrase}
          style={styles.phrase}
          onPress={async () => {
            await Clipboard.setStringAsync(phrase);
            setCopied(index);
            setTimeout(() => setCopied(null), 1500);
          }}
        >
          <Text style={styles.phraseText}>“{phrase}”</Text>
          <MaterialIcons
            name={copied === index ? 'check' : 'content-copy'}
            size={21}
            color={copied === index ? COLORS.tertiary : COLORS.secondary}
          />
        </BentoCard>
      ))}
      <BentoCard style={styles.tip}>
        <Text style={styles.tipTitle}>Try the broken-record technique</Text>
        <Text style={styles.body}>
          Repeat the same short boundary without debating or explaining it.
        </Text>
      </BentoCard>
    </ToolShell>
  );
}

function TimerTool() {
  const router = useRouter();
  const [duration, setDuration] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const display = useMemo(
    () =>
      `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(
        remaining % 60
      ).padStart(2, '0')}`,
    [remaining]
  );

  const chooseDuration = (seconds: number) => {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(false);
  };

  return (
    <ToolShell title="Craving Delay Timer" subtitle="Give the urge time to change">
      <BentoCard style={styles.centerCard}>
        <Text style={styles.timer}>{display}</Text>
        <Text style={styles.bigPrompt}>
          {remaining === 0
            ? 'You made space before acting.'
            : running
              ? 'Stay with the next minute.'
              : 'Choose a delay and begin when ready.'}
        </Text>
        <Text style={styles.body}>
          A craving can rise and fall like a wave. This timer is support, not a
          medical treatment.
        </Text>
      </BentoCard>
      <View style={styles.durationRow}>
        {[60, 300, 600].map((seconds) => (
          <Pressable
            key={seconds}
            style={[
              styles.duration,
              duration === seconds && styles.durationSelected,
            ]}
            onPress={() => chooseDuration(seconds)}
          >
            <Text
              style={[
                styles.durationText,
                duration === seconds && styles.durationTextSelected,
              ]}
            >
              {seconds / 60} min
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.actionRow}>
        <PrimaryButton
          label={running ? 'Pause' : remaining === 0 ? 'Restart' : 'Start'}
          icon={running ? 'pause' : 'play-arrow'}
          onPress={() => {
            if (remaining === 0) setRemaining(duration);
            setRunning((value) => !value);
          }}
          style={styles.flexButton}
        />
        <PrimaryButton
          label="Reset"
          variant="secondary"
          onPress={() => {
            setRunning(false);
            setRemaining(duration);
          }}
          style={styles.flexButton}
        />
      </View>
      <PrimaryButton
        label="I need more support"
        icon="volunteer-activism"
        variant="ghost"
        onPress={() => router.push('/sos')}
      />
    </ToolShell>
  );
}

export default function SupportToolScreen() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  if (tool === 'breathing') return <BreathingTool />;
  if (tool === 'grounding') return <GroundingTool />;
  if (tool === 'refusal') return <RefusalTool />;
  if (tool === 'timer') return <TimerTool />;
  return (
    <ToolShell title="Support Tool" subtitle="This tool is unavailable">
      <Text style={styles.body}>Return to Support and choose another tool.</Text>
    </ToolShell>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: SPACING.page,
    paddingBottom: 28,
    gap: 14,
  },
  centerCard: { alignItems: 'center', paddingVertical: 28 },
  breatheCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryTint,
    marginBottom: 20,
  },
  bigPrompt: {
    ...TYPE.headlineMd,
    color: COLORS.onSurface,
    textAlign: 'center',
    marginTop: 14,
  },
  body: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, textAlign: 'center', marginTop: 8 },
  stepCounter: { ...TYPE.labelSm, color: COLORS.secondary, marginBottom: 18 },
  actionRow: { flexDirection: 'row', gap: 10 },
  flexButton: { flex: 1 },
  phrase: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phraseText: { ...TYPE.bodyLg, color: COLORS.onSurface, flex: 1 },
  tip: { backgroundColor: COLORS.tertiaryTint },
  tipTitle: { ...TYPE.titleSm, color: COLORS.tertiary },
  timer: {
    fontFamily: TYPE.headlineXl.fontFamily,
    fontSize: 58,
    lineHeight: 68,
    color: COLORS.primary,
  },
  durationRow: { flexDirection: 'row', gap: 8 },
  duration: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  durationSelected: {
    backgroundColor: COLORS.primaryContainer,
    borderColor: COLORS.primaryContainer,
  },
  durationText: { ...TYPE.labelMd, color: COLORS.onSurfaceVariant },
  durationTextSelected: { color: COLORS.onPrimary },
});
