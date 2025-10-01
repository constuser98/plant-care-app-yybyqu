
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { Plant, CareRecord, CareReminder, CareTask, DashboardStats } from '../types/Plant';

const STORAGE_KEYS = {
  PLANTS: '@plant_care_plants',
  CARE_RECORDS: '@plant_care_records',
  REMINDERS: '@plant_care_reminders',
};

export const usePlantStorage = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [plantsData, recordsData, remindersData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PLANTS),
        AsyncStorage.getItem(STORAGE_KEYS.CARE_RECORDS),
        AsyncStorage.getItem(STORAGE_KEYS.REMINDERS),
      ]);

      if (plantsData) {
        setPlants(JSON.parse(plantsData));
      }
      if (recordsData) {
        setCareRecords(JSON.parse(recordsData));
      }
      if (remindersData) {
        setReminders(JSON.parse(remindersData));
      }
    } catch (error) {
      console.log('Error loading plant data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save plants to storage
  const savePlants = useCallback(async (newPlants: Plant[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(newPlants));
      setPlants(newPlants);
    } catch (error) {
      console.log('Error saving plants:', error);
    }
  }, []);

  // Save care records to storage
  const saveCareRecords = useCallback(async (newRecords: CareRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CARE_RECORDS, JSON.stringify(newRecords));
      setCareRecords(newRecords);
    } catch (error) {
      console.log('Error saving care records:', error);
    }
  }, []);

  // Save reminders to storage
  const saveReminders = useCallback(async (newReminders: CareReminder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.log('Error saving reminders:', error);
    }
  }, []);

  // Plant operations
  const addPlant = useCallback(async (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlant: Plant = {
      ...plant,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedPlants = [...plants, newPlant];
    await savePlants(updatedPlants);
    return newPlant;
  }, [plants, savePlants]);

  const updatePlant = useCallback(async (plantId: string, updates: Partial<Plant>) => {
    const updatedPlants = plants.map(plant =>
      plant.id === plantId
        ? { ...plant, ...updates, updatedAt: new Date().toISOString() }
        : plant
    );
    await savePlants(updatedPlants);
  }, [plants, savePlants]);

  const deletePlant = useCallback(async (plantId: string) => {
    const updatedPlants = plants.filter(plant => plant.id !== plantId);
    const updatedRecords = careRecords.filter(record => record.plantId !== plantId);
    const updatedReminders = reminders.filter(reminder => reminder.plantId !== plantId);
    
    await Promise.all([
      savePlants(updatedPlants),
      saveCareRecords(updatedRecords),
      saveReminders(updatedReminders),
    ]);
  }, [plants, careRecords, reminders, savePlants, saveCareRecords, saveReminders]);

  // Care record operations
  const addCareRecord = useCallback(async (record: Omit<CareRecord, 'id'>) => {
    const newRecord: CareRecord = {
      ...record,
      id: Date.now().toString(),
    };
    const updatedRecords = [...careRecords, newRecord];
    await saveCareRecords(updatedRecords);
    
    // Update plant's last care dates
    const plant = plants.find(p => p.id === record.plantId);
    if (plant) {
      const updates: Partial<Plant> = {};
      if (record.type === 'watering') {
        updates.currentStats = { ...plant.currentStats, lastWatered: record.date };
      } else if (record.type === 'fertilizing') {
        updates.currentStats = { ...plant.currentStats, lastFertilized: record.date };
      } else if (record.type === 'pruning') {
        updates.currentStats = { ...plant.currentStats, lastPruned: record.date };
      } else if (record.type === 'repotting') {
        updates.currentStats = { ...plant.currentStats, lastRepotted: record.date };
      }
      
      if (Object.keys(updates).length > 0) {
        await updatePlant(record.plantId, updates);
      }
    }
    
    return newRecord;
  }, [careRecords, plants, saveCareRecords, updatePlant]);

  // Reminder operations
  const addReminder = useCallback(async (reminder: Omit<CareReminder, 'id'>) => {
    const newReminder: CareReminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    const updatedReminders = [...reminders, newReminder];
    await saveReminders(updatedReminders);
    return newReminder;
  }, [reminders, saveReminders]);

  const updateReminder = useCallback(async (reminderId: string, updates: Partial<CareReminder>) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, ...updates } : reminder
    );
    await saveReminders(updatedReminders);
  }, [reminders, saveReminders]);

  // Get dashboard stats
  const getDashboardStats = useCallback((): DashboardStats => {
    const today = new Date().toISOString().split('T')[0];
    const healthyPlants = plants.filter(p => p.status === 'healthy').length;
    const plantsNeedingCare = plants.filter(p => p.status === 'needs_attention' || p.status === 'sick').length;
    
    // Get today's tasks (simplified - would need more complex logic for real reminders)
    const todayTasks = reminders.filter(r => r.isActive && r.nextDue <= today).length;
    const overdueTasks = reminders.filter(r => r.isActive && r.nextDue < today).length;
    
    const recentActivity = careRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalPlants: plants.length,
      healthyPlants,
      plantsNeedingCare,
      todayTasks,
      overdueTasks,
      recentActivity,
    };
  }, [plants, reminders, careRecords]);

  // Get care tasks
  const getCareTasksForDate = useCallback((date: string): CareTask[] => {
    return reminders
      .filter(r => r.isActive && r.nextDue <= date)
      .map(reminder => {
        const plant = plants.find(p => p.id === reminder.plantId);
        const isOverdue = reminder.nextDue < date;
        
        return {
          id: reminder.id,
          plantId: reminder.plantId,
          plantName: plant?.name || 'Unknown Plant',
          type: reminder.type,
          title: reminder.title,
          dueDate: reminder.nextDue,
          isOverdue,
          priority: isOverdue ? 'high' : 'medium',
          completed: false,
        } as CareTask;
      });
  }, [reminders, plants]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    plants,
    careRecords,
    reminders,
    loading,
    addPlant,
    updatePlant,
    deletePlant,
    addCareRecord,
    addReminder,
    updateReminder,
    getDashboardStats,
    getCareTasksForDate,
    loadData,
  };
};
