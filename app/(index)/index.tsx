
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';
import { usePlantStorage } from '@/hooks/usePlantStorage';
import { useSampleData } from '@/hooks/useSampleData';
import { DashboardStats } from '@/types/Plant';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { getDashboardStats, loading, plants } = usePlantStorage();
  const { createSampleData } = useSampleData();
  const [stats, setStats] = useState<DashboardStats>({
    totalPlants: 0,
    healthyPlants: 0,
    plantsNeedingCare: 0,
    todayTasks: 0,
    overdueTasks: 0,
    recentActivity: [],
  });

  useEffect(() => {
    if (!loading) {
      setStats(getDashboardStats());
    }
  }, [loading, getDashboardStats, plants]);

  const StatCard = ({ title, value, icon, color, onPress }: {
    title: string;
    value: number;
    icon: string;
    color: string;
    onPress?: () => void;
  }) => (
    <Pressable
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <IconSymbol name={icon as any} size={24} color={color} />
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </Pressable>
  );

  const QuickAction = ({ title, icon, color, onPress }: {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon as any} size={28} color={color} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </Pressable>
  );

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: '植物照料',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/settings')}
              style={{ marginRight: 8 }}
            >
              <IconSymbol name="gear" size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            {stats.totalPlants === 0 
              ? '开始您的植物照料之旅' 
              : `您有 ${stats.totalPlants} 株植物需要照料`
            }
          </Text>
          {stats.todayTasks > 0 && (
            <Text style={styles.tasksText}>
              今天有 {stats.todayTasks} 项照料任务
            </Text>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="总植物数"
            value={stats.totalPlants}
            icon="leaf"
            color={colors.primary}
            onPress={() => router.push('/plants')}
          />
          <StatCard
            title="健康植物"
            value={stats.healthyPlants}
            icon="checkmark.circle"
            color={colors.success}
          />
          <StatCard
            title="需要关注"
            value={stats.plantsNeedingCare}
            icon="exclamationmark.triangle"
            color={colors.warning}
          />
          <StatCard
            title="今日任务"
            value={stats.todayTasks}
            icon="calendar"
            color={colors.accent}
            onPress={() => router.push('/tasks')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快速操作</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="添加植物"
              icon="plus.circle"
              color={colors.primary}
              onPress={() => router.push('/add-plant')}
            />
            <QuickAction
              title="我的植物"
              icon="leaf"
              color={colors.success}
              onPress={() => router.push('/plants')}
            />
            <QuickAction
              title="拍照记录"
              icon="camera"
              color={colors.accent}
              onPress={() => router.push('/take-photo')}
            />
            <QuickAction
              title="照料提醒"
              icon="bell"
              color={colors.warning}
              onPress={() => router.push('/reminders')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近活动</Text>
              <Pressable onPress={() => router.push('/activity')}>
                <Text style={styles.seeAllText}>查看全部</Text>
              </Pressable>
            </View>
            <View style={styles.activityList}>
              {stats.recentActivity.slice(0, 3).map((activity, index) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <IconSymbol
                      name={activity.type === 'watering' ? 'drop' : 
                            activity.type === 'fertilizing' ? 'leaf' : 'scissors'}
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>
                      {activity.type === 'watering' ? '浇水' :
                       activity.type === 'fertilizing' ? '施肥' :
                       activity.type === 'pruning' ? '修剪' : '照料'}
                    </Text>
                    <Text style={styles.activityDate}>
                      {new Date(activity.date).toLocaleDateString('zh-CN')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {stats.totalPlants === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="leaf" size={64} color={colors.primary + '40'} />
            <Text style={styles.emptyStateTitle}>开始您的植物照料之旅</Text>
            <Text style={styles.emptyStateText}>
              添加您的第一株植物，开始记录它的成长历程
            </Text>
            <Pressable
              style={[commonStyles.card, styles.addFirstPlantButton]}
              onPress={() => router.push('/add-plant')}
            >
              <IconSymbol name="plus" size={24} color={colors.primary} />
              <Text style={styles.addFirstPlantText}>添加第一株植物</Text>
            </Pressable>
            
            {/* Sample Data Button */}
            <Pressable
              style={[styles.sampleDataButton]}
              onPress={createSampleData}
            >
              <IconSymbol name="sparkles" size={20} color={colors.accent} />
              <Text style={styles.sampleDataText}>加载示例数据</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {stats.totalPlants > 0 && (
        <Pressable
          style={commonStyles.fab}
          onPress={() => router.push('/add-plant')}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  tasksText: {
    fontSize: 14,
    color: colors.accent,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    width: (width - 44) / 2,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 2,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addFirstPlantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  addFirstPlantText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sampleDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.accent + '20',
    borderRadius: 20,
    gap: 6,
  },
  sampleDataText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent,
  },
});
