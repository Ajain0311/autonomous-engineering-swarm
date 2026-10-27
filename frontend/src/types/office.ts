export type CharacterAction = 
  | 'IDLE'
  | 'SIT'
  | 'CODE'
  | 'WALK'
  | 'TALK'
  | 'PRESENT'
  | 'TEST'
  | 'DEFECT'
  | 'DEPLOY'
  | 'DOCS'
  | 'WAITING';

export type CameraPreset = 
  | 'overview'
  | 'top_down'
  | 'aditya_cabin'
  | 'giriraj_cabin'
  | 'dev_pod'
  | 'qa_lab'
  | 'devops'
  | 'ba_lounge'
  | 'follow';

export interface OfficeEmployeeData {
  id: string;
  name: string;
  role: string;
  department: string;
  parent_id: string | null;
  status: 'IDLE' | 'RUNNING' | 'BLOCKED' | 'FAILED' | 'COMPLETED';
  current_task_id: string | null;
  tasks_completed: number;
  tasks_failed: number;
  model: string;
  desk_id: string;
  home_coords: [number, number, number];
  current_coords: [number, number, number];
  target_coords: [number, number, number] | null;
  rotation_y: number;
  action: CharacterAction;
  appearance: {
    hairStyle: 'short' | 'parted' | 'bob' | 'ponytail' | 'curly' | 'fade';
    hairColor: string;
    clothingStyle: 'blazer' | 'hoodie' | 'shirt' | 'polo' | 'vest';
    clothingColor: string;
    pantsColor: string;
    skinTone: string;
    hasGlasses?: boolean;
    accessory?: 'lanyard' | 'headset' | 'watch';
  };
}

export interface SpeechBubbleItem {
  id: string;
  speaker_id: string;
  speaker_name: string;
  text: string;
  timestamp: number;
  duration_ms: number;
}

export interface OfficeLifecycleStepEvent {
  step_number: number;
  title: string;
  description: string;
  primary_agent_id: string;
  primary_agent_name: string;
  target_agent_id?: string;
  target_agent_name?: string;
  action: string;
  target_location: string;
  task_id: string;
  speech?: {
    speaker_id: string;
    speaker_name: string;
    text: string;
  };
}
