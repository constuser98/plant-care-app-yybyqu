
export interface Plant {
  id: string;
  name: string;
  species: string;
  variety?: string;
  nickname?: string;
  plantedDate: string;
  acquiredDate: string;
  source: string;
  category: PlantCategory;
  difficulty: PlantDifficulty;
  status: PlantStatus;
  location: string;
  notes?: string;
  careRequirements: CareRequirements;
  currentStats: PlantStats;
  photos: PlantPhoto[];
  careHistory: CareRecord[];
  reminders: CareReminder[];
  createdAt: string;
  updatedAt: string;
}

export interface CareRequirements {
  wateringFrequency: number; // days
  fertilizingFrequency: number; // days
  lightRequirement: LightRequirement;
  temperatureRange: {
    min: number;
    max: number;
  };
  humidityRange: {
    min: number;
    max: number;
  };
  soilType: string;
  potSize: string;
}

export interface PlantStats {
  height: number; // cm
  leafCount: number;
  healthScore: number; // 1-10
  lastWatered: string;
  lastFertilized: string;
  lastPruned?: string;
  lastRepotted?: string;
  isFlowering: boolean;
  hasFruit: boolean;
}

export interface PlantPhoto {
  id: string;
  uri: string;
  date: string;
  description?: string;
  tags: string[];
  measurements?: {
    height?: number;
    width?: number;
    leafCount?: number;
  };
}

export interface CareRecord {
  id: string;
  plantId: string;
  type: CareType;
  date: string;
  notes?: string;
  amount?: number;
  unit?: string;
  product?: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

export interface CareReminder {
  id: string;
  plantId: string;
  type: CareType;
  title: string;
  description?: string;
  frequency: number; // days
  nextDue: string;
  isActive: boolean;
  customSchedule?: boolean;
}

export type PlantCategory = 
  | 'foliage' 
  | 'succulent' 
  | 'flowering' 
  | 'herb' 
  | 'vegetable' 
  | 'fruit' 
  | 'tree' 
  | 'vine' 
  | 'fern' 
  | 'cactus' 
  | 'other';

export type PlantDifficulty = 'easy' | 'medium' | 'hard';

export type PlantStatus = 'healthy' | 'needs_attention' | 'sick' | 'dormant' | 'dead';

export type LightRequirement = 'low' | 'medium' | 'high' | 'direct' | 'indirect';

export type CareType = 
  | 'watering' 
  | 'fertilizing' 
  | 'pruning' 
  | 'repotting' 
  | 'pest_control' 
  | 'disease_treatment' 
  | 'location_change' 
  | 'measurement' 
  | 'photo' 
  | 'other';

export interface DashboardStats {
  totalPlants: number;
  healthyPlants: number;
  plantsNeedingCare: number;
  todayTasks: number;
  overdueTasks: number;
  recentActivity: CareRecord[];
}

export interface CareTask {
  id: string;
  plantId: string;
  plantName: string;
  type: CareType;
  title: string;
  dueDate: string;
  isOverdue: boolean;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
}
