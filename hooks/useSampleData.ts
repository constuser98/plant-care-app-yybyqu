
import { useEffect } from 'react';
import { usePlantStorage } from './usePlantStorage';
import { Plant } from '../types/Plant';

export const useSampleData = () => {
  const { plants, addPlant, addCareRecord } = usePlantStorage();

  const createSampleData = async () => {
    if (plants.length > 0) return; // Don't create sample data if plants already exist

    console.log('Creating sample plant data...');

    const samplePlants: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: '绿萝',
        species: '黄金葛',
        variety: '普通品种',
        nickname: '小绿',
        plantedDate: '2024-01-15',
        acquiredDate: '2024-01-15',
        source: '花店购买',
        category: 'foliage',
        difficulty: 'easy',
        status: 'healthy',
        location: '客厅窗台',
        notes: '生长旺盛，叶片翠绿',
        careRequirements: {
          wateringFrequency: 7,
          fertilizingFrequency: 30,
          lightRequirement: 'indirect',
          temperatureRange: { min: 18, max: 25 },
          humidityRange: { min: 40, max: 60 },
          soilType: '通用培养土',
          potSize: '中等',
        },
        currentStats: {
          height: 25,
          leafCount: 15,
          healthScore: 9,
          lastWatered: '2024-12-20',
          lastFertilized: '2024-12-01',
          isFlowering: false,
          hasFruit: false,
        },
        photos: [],
        careHistory: [],
        reminders: [],
      },
      {
        name: '多肉植物',
        species: '玉露',
        plantedDate: '2024-02-01',
        acquiredDate: '2024-02-01',
        source: '朋友赠送',
        category: 'succulent',
        difficulty: 'easy',
        status: 'healthy',
        location: '阳台',
        careRequirements: {
          wateringFrequency: 14,
          fertilizingFrequency: 60,
          lightRequirement: 'high',
          temperatureRange: { min: 15, max: 30 },
          humidityRange: { min: 30, max: 50 },
          soilType: '多肉专用土',
          potSize: '小型',
        },
        currentStats: {
          height: 8,
          leafCount: 20,
          healthScore: 8,
          lastWatered: '2024-12-15',
          lastFertilized: '2024-11-15',
          isFlowering: false,
          hasFruit: false,
        },
        photos: [],
        careHistory: [],
        reminders: [],
      },
      {
        name: '薄荷',
        species: '留兰香薄荷',
        plantedDate: '2024-03-10',
        acquiredDate: '2024-03-10',
        source: '种子种植',
        category: 'herb',
        difficulty: 'easy',
        status: 'healthy',
        location: '厨房窗台',
        notes: '可以用来泡茶',
        careRequirements: {
          wateringFrequency: 3,
          fertilizingFrequency: 21,
          lightRequirement: 'medium',
          temperatureRange: { min: 16, max: 24 },
          humidityRange: { min: 50, max: 70 },
          soilType: '疏松培养土',
          potSize: '中等',
        },
        currentStats: {
          height: 15,
          leafCount: 30,
          healthScore: 9,
          lastWatered: '2024-12-21',
          lastFertilized: '2024-12-10',
          isFlowering: false,
          hasFruit: false,
        },
        photos: [],
        careHistory: [],
        reminders: [],
      },
    ];

    try {
      for (const plantData of samplePlants) {
        const plant = await addPlant(plantData);
        
        // Add some sample care records
        const careRecords = [
          {
            plantId: plant.id,
            type: 'watering' as const,
            date: '2024-12-21',
            notes: '正常浇水',
          },
          {
            plantId: plant.id,
            type: 'fertilizing' as const,
            date: '2024-12-01',
            notes: '施用液体肥料',
          },
        ];

        for (const record of careRecords) {
          await addCareRecord(record);
        }
      }
      
      console.log('Sample data created successfully');
    } catch (error) {
      console.log('Error creating sample data:', error);
    }
  };

  useEffect(() => {
    // Create sample data after a short delay to ensure storage is ready
    const timer = setTimeout(createSampleData, 1000);
    return () => clearTimeout(timer);
  }, [plants.length]);

  return { createSampleData };
};
