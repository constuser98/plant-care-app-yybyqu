
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';

export default function TasksScreen() {
  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: '今日任务',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <IconSymbol name="checkmark.circle" size={64} color={colors.success + '60'} />
          <Text style={styles.emptyStateTitle}>今日任务</Text>
          <Text style={styles.emptyStateText}>
            管理您的植物照料任务，确保每株植物都得到及时照料
          </Text>
          <Text style={styles.comingSoonText}>功能开发中，敬请期待！</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  comingSoonText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
});
