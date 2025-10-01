
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';
import { usePlantStorage } from '@/hooks/usePlantStorage';
import { Plant, CareType } from '@/types/Plant';

const { width } = Dimensions.get('window');

const careTypeLabels: Record<CareType, string> = {
  watering: '浇水',
  fertilizing: '施肥',
  pruning: '修剪',
  repotting: '换盆',
  pest_control: '除虫',
  disease_treatment: '治病',
  location_change: '移动',
  measurement: '测量',
  photo: '拍照',
  other: '其他',
};

const careTypeIcons: Record<CareType, string> = {
  watering: 'drop',
  fertilizing: 'leaf',
  pruning: 'scissors',
  repotting: 'arrow.up.bin',
  pest_control: 'ant',
  disease_treatment: 'cross',
  location_change: 'location',
  measurement: 'ruler',
  photo: 'camera',
  other: 'ellipsis',
};

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { plants, careRecords, addCareRecord, updatePlant, deletePlant } = usePlantStorage();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'photos' | 'stats'>('overview');

  useEffect(() => {
    const foundPlant = plants.find(p => p.id === id);
    setPlant(foundPlant || null);
  }, [plants, id]);

  if (!plant) {
    return (
      <View style={commonStyles.container}>
        <Stack.Screen options={{ title: '植物详情' }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>植物不存在</Text>
        </View>
      </View>
    );
  }

  const plantCareRecords = careRecords
    .filter(record => record.plantId === plant.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleQuickCare = async (type: CareType) => {
    try {
      await addCareRecord({
        plantId: plant.id,
        type,
        date: new Date().toISOString(),
        notes: `快速记录${careTypeLabels[type]}`,
      });
      Alert.alert('成功', `已记录${careTypeLabels[type]}`);
    } catch (error) {
      console.log('Error adding care record:', error);
      Alert.alert('错误', '记录失败，请重试');
    }
  };

  const handleDeletePlant = () => {
    Alert.alert(
      '确认删除',
      `确定要删除植物"${plant.name}"吗？此操作无法撤销。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlant(plant.id);
              Alert.alert('成功', '植物已删除', [
                { text: '确定', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.log('Error deleting plant:', error);
              Alert.alert('错误', '删除失败，请重试');
            }
          },
        },
      ]
    );
  };

  const QuickCareButton = ({ type, icon, color }: {
    type: CareType;
    icon: string;
    color: string;
  }) => (
    <Pressable
      style={styles.quickCareButton}
      onPress={() => handleQuickCare(type)}
    >
      <View style={[styles.quickCareIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.quickCareText}>{careTypeLabels[type]}</Text>
    </Pressable>
  );

  const TabButton = ({ tab, label, isActive }: {
    tab: typeof activeTab;
    label: string;
    isActive: boolean;
  }) => (
    <Pressable
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Plant Image */}
      <View style={styles.plantImageContainer}>
        {plant.photos.length > 0 ? (
          <Image
            source={{ uri: plant.photos[plant.photos.length - 1].uri }}
            style={styles.plantImage}
          />
        ) : (
          <View style={styles.plantImagePlaceholder}>
            <IconSymbol name="leaf" size={64} color={colors.primary + '60'} />
            <Text style={styles.noImageText}>暂无照片</Text>
          </View>
        )}
      </View>

      {/* Basic Info */}
      <View style={styles.infoSection}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantSpecies}>{plant.species}</Text>
        {plant.nickname && (
          <Text style={styles.plantNickname}>"{plant.nickname}"</Text>
        )}
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { 
            backgroundColor: plant.status === 'healthy' ? colors.success : 
                           plant.status === 'needs_attention' ? colors.warning : colors.error 
          }]}>
            <Text style={styles.statusText}>
              {plant.status === 'healthy' ? '健康' :
               plant.status === 'needs_attention' ? '需要关注' : '生病'}
            </Text>
          </View>
          <Text style={styles.healthScore}>健康度: {plant.currentStats.healthScore}/10</Text>
        </View>
      </View>

      {/* Quick Care Actions */}
      <View style={styles.quickCareSection}>
        <Text style={styles.sectionTitle}>快速照料</Text>
        <View style={styles.quickCareGrid}>
          <QuickCareButton type="watering" icon="drop" color={colors.water} />
          <QuickCareButton type="fertilizing" icon="leaf" color={colors.fertilizer} />
          <QuickCareButton type="pruning" icon="scissors" color={colors.error} />
          <QuickCareButton type="photo" icon="camera" color={colors.accent} />
        </View>
      </View>

      {/* Care Requirements */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>照料需求</Text>
        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <IconSymbol name="drop" size={16} color={colors.water} />
            <Text style={styles.requirementText}>
              每 {plant.careRequirements.wateringFrequency} 天浇水
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <IconSymbol name="leaf" size={16} color={colors.fertilizer} />
            <Text style={styles.requirementText}>
              每 {plant.careRequirements.fertilizingFrequency} 天施肥
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <IconSymbol name="sun.max" size={16} color={colors.sunlight} />
            <Text style={styles.requirementText}>
              {plant.careRequirements.lightRequirement === 'low' ? '低光照' :
               plant.careRequirements.lightRequirement === 'medium' ? '中等光照' :
               plant.careRequirements.lightRequirement === 'high' ? '高光照' :
               plant.careRequirements.lightRequirement === 'direct' ? '直射阳光' : '散射光'}
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <IconSymbol name="thermometer" size={16} color={colors.textSecondary} />
            <Text style={styles.requirementText}>
              {plant.careRequirements.temperatureRange.min}°C - {plant.careRequirements.temperatureRange.max}°C
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCareHistory = () => (
    <View style={styles.tabContent}>
      <View style={styles.careHistoryHeader}>
        <Text style={styles.sectionTitle}>照料历史</Text>
        <Pressable
          style={styles.addCareButton}
          onPress={() => router.push(`/add-care?plantId=${plant.id}`)}
        >
          <IconSymbol name="plus" size={16} color={colors.primary} />
          <Text style={styles.addCareText}>添加记录</Text>
        </Pressable>
      </View>

      {plantCareRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="calendar" size={48} color={colors.textSecondary + '60'} />
          <Text style={styles.emptyStateText}>暂无照料记录</Text>
        </View>
      ) : (
        <View style={styles.careRecordsList}>
          {plantCareRecords.map((record) => (
            <View key={record.id} style={styles.careRecordItem}>
              <View style={styles.careRecordIcon}>
                <IconSymbol
                  name={careTypeIcons[record.type] as any}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={styles.careRecordContent}>
                <Text style={styles.careRecordType}>
                  {careTypeLabels[record.type]}
                </Text>
                <Text style={styles.careRecordDate}>
                  {new Date(record.date).toLocaleDateString('zh-CN')}
                </Text>
                {record.notes && (
                  <Text style={styles.careRecordNotes}>{record.notes}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderPhotos = () => (
    <View style={styles.tabContent}>
      <View style={styles.photosHeader}>
        <Text style={styles.sectionTitle}>成长相册</Text>
        <Pressable
          style={styles.addPhotoButton}
          onPress={() => router.push(`/take-photo?plantId=${plant.id}`)}
        >
          <IconSymbol name="camera" size={16} color={colors.primary} />
          <Text style={styles.addPhotoText}>拍照</Text>
        </Pressable>
      </View>

      {plant.photos.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="camera" size={48} color={colors.textSecondary + '60'} />
          <Text style={styles.emptyStateText}>暂无照片记录</Text>
          <Text style={styles.emptyStateSubtext}>记录植物的成长历程</Text>
        </View>
      ) : (
        <View style={styles.photosGrid}>
          {plant.photos.map((photo) => (
            <Pressable
              key={photo.id}
              style={styles.photoItem}
              onPress={() => router.push(`/photo-viewer?photoId=${photo.id}&plantId=${plant.id}`)}
            >
              <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
              <Text style={styles.photoDate}>
                {new Date(photo.date).toLocaleDateString('zh-CN')}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: plant.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => router.push(`/edit-plant?id=${plant.id}`)}
                style={{ marginRight: 16 }}
              >
                <IconSymbol name="pencil" size={20} color={colors.text} />
              </Pressable>
              <Pressable onPress={handleDeletePlant}>
                <IconSymbol name="trash" size={20} color={colors.error} />
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <TabButton tab="overview" label="概览" isActive={activeTab === 'overview'} />
            <TabButton tab="care" label="照料记录" isActive={activeTab === 'care'} />
            <TabButton tab="photos" label="照片" isActive={activeTab === 'photos'} />
            <TabButton tab="stats" label="统计" isActive={activeTab === 'stats'} />
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'care' && renderCareHistory()}
          {activeTab === 'photos' && renderPhotos()}
          {activeTab === 'stats' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>统计数据</Text>
              <Text style={styles.comingSoonText}>功能开发中...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabsContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '20',
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    padding: 16,
  },
  plantImageContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  plantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  plantImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  plantName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  plantSpecies: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  plantNickname: {
    fontSize: 14,
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  healthScore: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  quickCareSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quickCareGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCareButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  quickCareIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickCareText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    color: colors.text,
  },
  careHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
  },
  addCareText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  careRecordsList: {
    gap: 12,
  },
  careRecordItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  careRecordIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  careRecordContent: {
    flex: 1,
  },
  careRecordType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  careRecordDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  careRecordNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: (width - 48) / 3,
    alignItems: 'center',
  },
  photoThumbnail: {
    width: '100%',
    height: (width - 48) / 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  comingSoonText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
