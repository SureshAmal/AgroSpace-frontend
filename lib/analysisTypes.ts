export interface Remedy {
  action: string;
  timeframe?: string;
  effectiveness?: number;
  step?: number;
}

export interface CareScheduleItem {
  week?: string;
  day?: string;
  action?: string;
  actions?: string[];
  notes?: string;
}

export interface PrescribedCare {
  overview?: string;
  immediate_actions?: string[];
  treatment_schedule?: CareScheduleItem[];
  environmental_improvements?: string[];
  prevention?: string[];
}

export interface AnalysisResult {
  plant_name?: string;
  disease: string;
  confidence: number;
  severity: string;
  description: string;
  remedies?: Remedy[];
  seasonal_tips?: string;
  prescribed_care?: PrescribedCare;
  is_mock?: boolean;
}