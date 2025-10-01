
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';
import { usePlantStorage } from '@/hooks/usePlantStorage';
import { Plant, PlantCategory, PlantStatus } from '@/types/Plant';

const { width } = Dimensions.get('window');

const categoryLabels: Record<PlantCategory, string> = {
  foliage: '观叶植物',
  succulent: '多肉植物',
  flowering: '开花植物',
  herb: '香草植物',
  vegetable: '蔬菜',
  fruit: '果树',
  tree: '树木',
  vine: '藤蔓植物',
  fern: '蕨类植物',
  cactus: '仙人掌',
  other: '其他',
};

const statusLabels: Record<PlantStatus, string> = {
  healthy: '健康',
  needs_attention: '需要关注',
  sick: '生病',
  dormant: '休眠',
  dead: '死亡',
};

const statusColors: Record<PlantStatus, string> = {
  healthy: colors.success,
  needs_attention: colors.warning,
  sick: colors.error,
  dormant: colors.textSecondary,
  dead: '#666',
};

export default function PlantsScreen() {
  const { plants, loading } = usePlantStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);

  useEffect(() => {
    let filtered = plants;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plant => plant.category === selectedCategory);
    }

    setFilteredPlants(filtered);
  }, [plants, searchQuery, selectedCategory]);

  const PlantCard = ({ plant }: { plant: Plant }) => {
    const daysSinceWatered = plant.currentStats.lastWatered
      ? Math.floor((Date.now() - new Date(plant.currentStats.lastWatered).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Pressable
        style={styles.plantCard}
        onPress={() => router.push(`/plant-details?id=${plant.id}`)}
      >
        <View style={styles.plantImageContainer}>
          {plant.photos.length > 0 ? (
            <Image
              source={{ uri: plant.photos[plant.photos.length - 1].uri }}
              style={styles.plantImage}
            />
          ) : (
            <View style={styles.plantImagePlaceholder}>
              <IconSymbol name="leaf" size={32} color={colors.primary + '60'} />
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: statusColors[plant.status] }]}>
            <Text style={styles.statusText}>{statusLabels[plant.status]}</Text>
          </View>
        </View>

        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.plantSpecies}>{plant.species}</Text>
          <Text style={styles.plantCategory}>{categoryLabels[plant.category]}</Text>

          <View style={styles.plantStats}>
            <View style={styles.statItem}>
              <IconSymbol name="drop" size={16} color={colors.water} />
              <Text style={styles.statText}>
                {daysSinceWatered !== null ? `${daysSinceWatered}天前` : '未记录'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="heart" size={16} color={colors.success} />
              <Text style={styles.statText}>{plant.currentStats.healthScore}/10</Text>
            </View>
          </View>

          {plant.location && (
            <View style={styles.locationContainer}>
              <IconSymbol name="location" size={14} color={colors.textSecondary} />
              <Text style={styles.locationText}>{plant.location}</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const CategoryFilter = ({ category, label, isSelected, onPress }: {
    category: PlantCategory | 'all';
    label: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      style={[
        styles.categoryFilter,
        isSelected && styles.categoryFilterSelected
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.categoryFilterText,
        isSelected && styles.categoryFilterTextSelected
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: '我的植物',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/add-plant')}
              style={{ marginRight: 8 }}
            >
              <IconSymbol name="plus" size={24} color={colors.primary} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索植物名称或品种..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
          contentContainerStyle={styles.categoryFiltersContent}
        >
          <CategoryFilter
            category="all"
            label="全部"
            isSelected={selectedCategory === 'all'}
            onPress={() => setSelectedCategory('all')}
          />
          {Object.entries(categoryLabels).map(([category, label]) => (
            <CategoryFilter
              key={category}
              category={category as PlantCategory}
              label={label}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category as PlantCategory)}
            />
          ))}
        </ScrollView>

        {/* Plants List */}
        <ScrollView
          style={styles.plantsContainer}
          contentContainerStyle={styles.plantsContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : filteredPlants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="leaf" size={64} color={colors.primary + '40'} />
              <Text style={styles.emptyTitle}>
                {searchQuery || selectedCategory !== 'all' ? '没有找到植物' : '还没有植物'}
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery || selectedCategory !== 'all'
                  ? '尝试调整搜索条件或筛选器'
                  : '添加您的第一株植物开始记录'
                }
              </Text>
              {!searchQuery && selectedCategory === 'all' && (
                <Pressable
                  style={styles.addPlantButton}
                  onPress={() => router.push('/add-plant')}
                >
                  <IconSymbol name="plus" size={20} color="white" />
                  <Text style={styles.addPlantButtonText}>添加植物</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.plantsGrid}>
              {filteredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <Pressable
        style={commonStyles.fab}
        onPress={() => router.push('/add-plant')}
      >
        <IconSymbol name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoryFilters: {
    maxHeight: 50,
  },
  categoryFiltersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  categoryFilterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryFilterTextSelected: {
    color: 'white',
  },
  plantsContainer: {
    flex: 1,
  },
  plantsContent: {
    paddingBottom: 100,
  },
  plantsGrid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  plantCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  plantImageContainer: {
    position: 'relative',
    height: 200,
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
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  plantInfo: {
    padding: 16,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  plantSpecies: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  plantCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 12,
  },
  plantStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addPlantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addPlantButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
