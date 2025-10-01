
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const handleClearData = () => {
    Alert.alert(
      '清除数据',
      '确定要清除所有植物数据吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('成功', '数据已清除', [
                { text: '确定', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.log('Error clearing data:', error);
              Alert.alert('错误', '清除数据失败');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, icon, onPress, color = colors.text }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress: () => void;
    color?: string;
  }) => (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <IconSymbol name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
    </Pressable>
  );

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: '设置',
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>应用设置</Text>
          <View style={styles.settingsList}>
            <SettingItem
              title="通知设置"
              subtitle="管理照料提醒通知"
              icon="bell"
              onPress={() => Alert.alert('提示', '功能开发中')}
            />
            <SettingItem
              title="数据备份"
              subtitle="备份和恢复植物数据"
              icon="icloud"
              onPress={() => Alert.alert('提示', '功能开发中')}
            />
            <SettingItem
              title="主题设置"
              subtitle="切换应用主题"
              icon="paintbrush"
              onPress={() => Alert.alert('提示', '功能开发中')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <View style={styles.settingsList}>
            <SettingItem
              title="使用帮助"
              subtitle="查看使用指南"
              icon="questionmark.circle"
              onPress={() => Alert.alert('提示', '功能开发中')}
            />
            <SettingItem
              title="反馈建议"
              subtitle="向我们提供反馈"
              icon="envelope"
              onPress={() => Alert.alert('提示', '功能开发中')}
            />
            <SettingItem
              title="版本信息"
              subtitle="v1.0.0"
              icon="info.circle"
              onPress={() => Alert.alert('植物照料应用', '版本 1.0.0\n\n一个帮助您记录和管理植物照料的应用')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          <View style={styles.settingsList}>
            <SettingItem
              title="清除所有数据"
              subtitle="删除所有植物和照料记录"
              icon="trash"
              onPress={handleClearData}
              color={colors.error}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            植物照料应用 v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            用心照料每一株植物 🌱
          </Text>
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
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  settingsList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '10',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
