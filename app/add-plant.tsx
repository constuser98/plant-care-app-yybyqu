
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';
import { usePlantStorage } from '@/hooks/usePlantStorage';
import { PlantCategory, PlantDifficulty, LightRequirement, Plant } from '@/types/Plant';

const categoryOptions: { value: PlantCategory; label: string }[] = [
  { value: 'foliage', label: '观叶植物' },
  { value: 'succulent', label: '多肉植物' },
  { value: 'flowering', label: '开花植物' },
  { value: 'herb', label: '香草植物' },
  { value: 'vegetable', label: '蔬菜' },
  { value: 'fruit', label: '果树' },
  { value: 'tree', label: '树木' },
  { value: 'vine', label: '藤蔓植物' },
  { value: 'fern', label: '蕨类植物' },
  { value: 'cactus', label: '仙人掌' },
  { value: 'other', label: '其他' },
];

const difficultyOptions: { value: PlantDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: '容易', color: colors.success },
  { value: 'medium', label: '中等', color: colors.warning },
  { value: 'hard', label: '困难', color: colors.error },
];

const lightOptions: { value: LightRequirement; label: string }[] = [
  { value: 'low', label: '低光照' },
  { value: 'medium', label: '中等光照' },
  { value: 'high', label: '高光照' },
  { value: 'direct', label: '直射阳光' },
  { value: 'indirect', label: '散射光' },
];

export default function AddPlantScreen() {
  const { addPlant } = usePlantStorage();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    variety: '',
    nickname: '',
    source: '',
    location: '',
    notes: '',
    category: 'foliage' as PlantCategory,
    difficulty: 'medium' as PlantDifficulty,
    lightRequirement: 'medium' as LightRequirement,
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    temperatureMin: 18,
    temperatureMax: 25,
    humidityMin: 40,
    humidityMax: 60,
    soilType: '',
    potSize: '',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('错误', '请输入植物名称');
      return;
    }

    if (!formData.species.trim()) {
      Alert.alert('错误', '请输入植物品种');
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const plantData: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        species: formData.species.trim(),
        variety: formData.variety.trim() || undefined,
        nickname: formData.nickname.trim() || undefined,
        plantedDate: now.split('T')[0],
        acquiredDate: now.split('T')[0],
        source: formData.source.trim() || '未知',
        category: formData.category,
        difficulty: formData.difficulty,
        status: 'healthy',
        location: formData.location.trim() || '未设置',
        notes: formData.notes.trim() || undefined,
        careRequirements: {
          wateringFrequency: formData.wateringFrequency,
          fertilizingFrequency: formData.fertilizingFrequency,
          lightRequirement: formData.lightRequirement,
          temperatureRange: {
            min: formData.temperatureMin,
            max: formData.temperatureMax,
          },
          humidityRange: {
            min: formData.humidityMin,
            max: formData.humidityMax,
          },
          soilType: formData.soilType.trim() || '通用培养土',
          potSize: formData.potSize.trim() || '中等',
        },
        currentStats: {
          height: 0,
          leafCount: 0,
          healthScore: 8,
          lastWatered: '',
          lastFertilized: '',
          isFlowering: false,
          hasFruit: false,
        },
        photos: [],
        careHistory: [],
        reminders: [],
      };

      await addPlant(plantData);
      Alert.alert('成功', '植物已添加成功！', [
        { text: '确定', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Error adding plant:', error);
      Alert.alert('错误', '添加植物失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const SelectionButton = ({ 
    options, 
    selectedValue, 
    onSelect, 
    renderOption 
  }: {
    options: any[];
    selectedValue: any;
    onSelect: (value: any) => void;
    renderOption?: (option: any) => React.ReactNode;
  }) => (
    <View style={styles.selectionContainer}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.selectionOption,
            selectedValue === option.value && styles.selectionOptionSelected
          ]}
          onPress={() => onSelect(option.value)}
        >
          {renderOption ? renderOption(option) : (
            <Text style={[
              styles.selectionOptionText,
              selectedValue === option.value && styles.selectionOptionTextSelected
            ]}>
              {option.label}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: '添加植物',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              disabled={loading}
              style={{ marginRight: 8 }}
            >
              <Text style={[
                styles.saveButtonText,
                loading && { opacity: 0.5 }
              ]}>
                {loading ? '保存中...' : '保存'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>植物名称 *</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：绿萝"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>品种 *</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：黄金葛"
              placeholderTextColor={colors.textSecondary}
              value={formData.species}
              onChangeText={(text) => updateFormData('species', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>变种</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：花叶品种"
              placeholderTextColor={colors.textSecondary}
              value={formData.variety}
              onChangeText={(text) => updateFormData('variety', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>昵称</Text>
            <TextInput
              style={styles.input}
              placeholder="给植物起个可爱的名字"
              placeholderTextColor={colors.textSecondary}
              value={formData.nickname}
              onChangeText={(text) => updateFormData('nickname', text)}
            />
          </View>
        </View>

        {/* Category and Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>分类信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>植物类型</Text>
            <SelectionButton
              options={categoryOptions}
              selectedValue={formData.category}
              onSelect={(value) => updateFormData('category', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>养护难度</Text>
            <SelectionButton
              options={difficultyOptions}
              selectedValue={formData.difficulty}
              onSelect={(value) => updateFormData('difficulty', value)}
              renderOption={(option) => (
                <View style={styles.difficultyOption}>
                  <View style={[styles.difficultyDot, { backgroundColor: option.color }]} />
                  <Text style={[
                    styles.selectionOptionText,
                    formData.difficulty === option.value && styles.selectionOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        {/* Care Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>照料需求</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>光照需求</Text>
            <SelectionButton
              options={lightOptions}
              selectedValue={formData.lightRequirement}
              onSelect={(value) => updateFormData('lightRequirement', value)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>浇水频率（天）</Text>
              <TextInput
                style={styles.input}
                placeholder="7"
                placeholderTextColor={colors.textSecondary}
                value={formData.wateringFrequency.toString()}
                onChangeText={(text) => updateFormData('wateringFrequency', parseInt(text) || 7)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>施肥频率（天）</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor={colors.textSecondary}
                value={formData.fertilizingFrequency.toString()}
                onChangeText={(text) => updateFormData('fertilizingFrequency', parseInt(text) || 30)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>温度范围（°C）</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="最低温度"
                placeholderTextColor={colors.textSecondary}
                value={formData.temperatureMin.toString()}
                onChangeText={(text) => updateFormData('temperatureMin', parseInt(text) || 18)}
                keyboardType="numeric"
              />
              <Text style={styles.rangeText}>-</Text>
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
                placeholder="最高温度"
                placeholderTextColor={colors.textSecondary}
                value={formData.temperatureMax.toString()}
                onChangeText={(text) => updateFormData('temperatureMax', parseInt(text) || 25)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Location and Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>来源</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：花店购买、朋友赠送"
              placeholderTextColor={colors.textSecondary}
              value={formData.source}
              onChangeText={(text) => updateFormData('source', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>位置</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：客厅窗台、阳台"
              placeholderTextColor={colors.textSecondary}
              value={formData.location}
              onChangeText={(text) => updateFormData('location', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>备注</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="记录一些特殊的照料注意事项..."
              placeholderTextColor={colors.textSecondary}
              value={formData.notes}
              onChangeText={(text) => updateFormData('notes', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.saveButton, loading && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <IconSymbol name="checkmark" size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {loading ? '保存中...' : '保存植物'}
            </Text>
          </Pressable>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary + '30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginHorizontal: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectionOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.textSecondary + '30',
  },
  selectionOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectionOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectionOptionTextSelected: {
    color: 'white',
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
