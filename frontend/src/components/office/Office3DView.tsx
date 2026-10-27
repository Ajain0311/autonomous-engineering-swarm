import React, { useState, useEffect, useMemo } from 'react';
import { OfficeScene } from './OfficeScene';
import { OfficeControls } from './OfficeControls';
import { EmployeeInspectorCard } from './EmployeeInspectorCard';
import { LiveActivityFeed } from './LiveActivityFeed';
import { TacticalMiniMap } from './TacticalMiniMap';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EditEmployeeModal } from './EditEmployeeModal';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ChotuKumarDialogueModal } from './ChotuKumarDialogueModal';
import {
  OfficeEmployeeData,
  SpeechBubbleItem,
  CameraPreset,
  OfficeLifecycleStepEvent
} from '../../types/office';
import { Task, Agent } from '../../types';
import { wsClient } from '../../services/websocket';
import { api } from '../../services/api';

const DEFAULT_OFFICE_EMPLOYEES: OfficeEmployeeData[] = [
  {
    id: 'agent-aditya',
    name: 'Aditya Jain',
    role: 'Chief Orchestrator / Top Authority',
    department: 'Executive',
    parent_id: null,
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 18,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'cabin-aditya',
    home_coords: [-14, 0, -9.32],
    current_coords: [-14, 0, -9.32],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'parted',
      hairColor: '#1e293b',
      clothingStyle: 'blazer',
      clothingColor: '#1e1b4b',
      pantsColor: '#0f172a',
      skinTone: '#f5d0b5',
      hasGlasses: true,
      accessory: 'watch'
    }
  },
  {
    id: 'agent-sanjay',
    name: 'Sanjay Sahlot',
    role: 'Operations Coordinator / Deputy Lead',
    department: 'Operations',
    parent_id: 'agent-aditya',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 14,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-sanjay',
    home_coords: [-7, 0, -9.38],
    current_coords: [-7, 0, -9.38],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'short',
      hairColor: '#334155',
      clothingStyle: 'blazer',
      clothingColor: '#0369a1',
      pantsColor: '#1e293b',
      skinTone: '#e2b392',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-giriraj',
    name: 'Giriraj Mali',
    role: 'Senior Developer / Engineering Lead',
    department: 'Core Engineering',
    parent_id: 'agent-aditya',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 24,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'cabin-giriraj',
    home_coords: [13, 0, -9.32],
    current_coords: [13, 0, -9.32],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'short',
      hairColor: '#0f172a',
      clothingStyle: 'blazer',
      clothingColor: '#312e81',
      pantsColor: '#1e1b4b',
      skinTone: '#d4a373',
      hasGlasses: false,
      accessory: 'watch'
    }
  },
  {
    id: 'agent-bhupendra',
    name: 'Bhupendra Jingar',
    role: 'Business Analyst',
    department: 'Product & Design',
    parent_id: 'agent-aditya',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 12,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-bhupendra',
    home_coords: [-13.5, 0, 1.2],
    current_coords: [-13.5, 0, 1.2],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'fade',
      hairColor: '#1c1917',
      clothingStyle: 'shirt',
      clothingColor: '#db2777',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-abhishek',
    name: 'Abhishek Hingar',
    role: 'QA Lead',
    department: 'Quality Assurance',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 19,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-abhishek',
    home_coords: [12.2, 0, 1.18],
    current_coords: [12.2, 0, 1.18],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'parted',
      hairColor: '#0f172a',
      clothingStyle: 'polo',
      clothingColor: '#059669',
      pantsColor: '#1e293b',
      skinTone: '#e2b392',
      hasGlasses: true,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-ashish',
    name: 'Ashish Das',
    role: 'Tester, reporting to QA',
    department: 'Quality Assurance',
    parent_id: 'agent-abhishek',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 16,
    tasks_failed: 1,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-ashish',
    home_coords: [13.8, 0, 1.18],
    current_coords: [13.8, 0, 1.18],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'short',
      hairColor: '#1e293b',
      clothingStyle: 'shirt',
      clothingColor: '#0d9488',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'headset'
    }
  },
  {
    id: 'agent-rohan',
    name: 'Rohan Sharma',
    role: 'Developer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 21,
    tasks_failed: 1,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-rohan',
    home_coords: [-4, 0, -1.38],
    current_coords: [-4, 0, -1.38],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'curly',
      hairColor: '#18181b',
      clothingStyle: 'hoodie',
      clothingColor: '#2563eb',
      pantsColor: '#1e293b',
      skinTone: '#e2b392',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-shaurya',
    name: 'Shaurya Jain',
    role: 'Developer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 17,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-shaurya',
    home_coords: [-4, 0, 2.62],
    current_coords: [-4, 0, 2.62],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'short',
      hairColor: '#09090b',
      clothingStyle: 'hoodie',
      clothingColor: '#0891b2',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: true,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-binod',
    name: 'Binod Kumar',
    role: 'Developer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 15,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-binod',
    home_coords: [-4, 0, 6.62],
    current_coords: [-4, 0, 6.62],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'parted',
      hairColor: '#27272a',
      clothingStyle: 'shirt',
      clothingColor: '#0284c7',
      pantsColor: '#1e293b',
      skinTone: '#d4a373',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-mohit',
    name: 'Mohit Sharma',
    role: 'Developer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 18,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-mohit',
    home_coords: [4, 0, -1.38],
    current_coords: [4, 0, -1.38],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'fade',
      hairColor: '#18181b',
      clothingStyle: 'polo',
      clothingColor: '#3b82f6',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-harshit-p',
    name: 'Harshit Purohit',
    role: 'DevOps Engineer',
    department: 'DevOps & Cloud',
    parent_id: 'agent-sanjay',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 20,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-harshit-p',
    home_coords: [11.5, 0, 10.12],
    current_coords: [11.5, 0, 10.12],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'short',
      hairColor: '#09090b',
      clothingStyle: 'polo',
      clothingColor: '#d97706',
      pantsColor: '#1e293b',
      skinTone: '#e2b392',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-divisha',
    name: 'Divisha Joshi',
    role: 'Documentation Engineer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 13,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-divisha',
    home_coords: [0, 0, 6.62],
    current_coords: [0, 0, 6.62],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'bob',
      hairColor: '#292524',
      clothingStyle: 'shirt',
      clothingColor: '#9333ea',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: true,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-hemang',
    name: 'Hemang Tiwari',
    role: 'Code Review Engineer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 22,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-hemang',
    home_coords: [0, 0, -1.38],
    current_coords: [0, 0, -1.38],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'short',
      hairColor: '#172554',
      clothingStyle: 'shirt',
      clothingColor: '#c026d3',
      pantsColor: '#1e293b',
      skinTone: '#e2b392',
      hasGlasses: false,
      accessory: 'watch'
    }
  },
  {
    id: 'agent-esha',
    name: 'Esha Saini',
    role: 'UI/UX Designer',
    department: 'Product & Design',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 17,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-esha',
    home_coords: [-14, 0, 6.62],
    current_coords: [-14, 0, 6.62],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'ponytail',
      hairColor: '#1c1917',
      clothingStyle: 'shirt',
      clothingColor: '#e11d48',
      pantsColor: '#1e293b',
      skinTone: '#f5d0b5',
      hasGlasses: true,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-kratik',
    name: 'Kratik Jain',
    role: 'Backend Engineer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 20,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-kratik',
    home_coords: [4, 0, 2.62],
    current_coords: [4, 0, 2.62],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'fade',
      hairColor: '#18181b',
      clothingStyle: 'hoodie',
      clothingColor: '#1d4ed8',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-maan',
    name: 'Maan Singh',
    role: 'Frontend Engineer',
    department: 'Core Engineering',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 19,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-maan',
    home_coords: [4, 0, 6.62],
    current_coords: [4, 0, 6.62],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'short',
      hairColor: '#09090b',
      clothingStyle: 'polo',
      clothingColor: '#0284c7',
      pantsColor: '#1e293b',
      skinTone: '#d4a373',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-harshit-m',
    name: 'Harshit Masta',
    role: 'Security Engineer',
    department: 'Executive',
    parent_id: 'agent-aditya',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 15,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-harshit-m',
    home_coords: [-7, 0, -5.38],
    current_coords: [-7, 0, -5.38],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'SIT',
    appearance: {
      hairStyle: 'short',
      hairColor: '#0f172a',
      clothingStyle: 'blazer',
      clothingColor: '#b91c1c',
      pantsColor: '#09090b',
      skinTone: '#e2b392',
      hasGlasses: false,
      accessory: 'watch'
    }
  },
  {
    id: 'agent-kathan',
    name: 'Kathan Jain',
    role: 'Automation / CI Engineer',
    department: 'DevOps & Cloud',
    parent_id: 'agent-harshit-p',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 18,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-kathan',
    home_coords: [14.5, 0, 10.12],
    current_coords: [14.5, 0, 10.12],
    target_coords: null,
    rotation_y: Math.PI,
    action: 'CODE',
    appearance: {
      hairStyle: 'short',
      hairColor: '#1c1917',
      clothingStyle: 'polo',
      clothingColor: '#ca8a04',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-pooja',
    name: 'Pooja Verma',
    role: 'Front Desk & Reception Coordinator',
    department: 'Operations',
    parent_id: 'agent-sanjay',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 25,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-reception',
    home_coords: [5.5, 0, 11.85],
    current_coords: [5.5, 0, 11.85],
    target_coords: null,
    rotation_y: 0,
    action: 'SIT',
    appearance: {
      hairStyle: 'bob',
      hairColor: '#09090b',
      clothingStyle: 'blazer',
      clothingColor: '#0284c7',
      pantsColor: '#0f172a',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  }
];

// Key Location Waypoints for realistic navigation
const WAYPOINTS: Record<string, [number, number, number]> = {
  'cabin-aditya': [-14, 0, -10],
  'cabin-giriraj': [13, 0, -10],
  'meeting-aditya-lead': [-12, 0, -9],
  'meeting-giriraj-dev': [11.5, 0, -9],
  'meeting-ba-table': [-12, 0, 1],
  'lab-qa': [12.5, 0, 0.5],
  'area-devops': [12.5, 0, 10],
  'desk-rohan': [-4, 0, -2],
  'desk-abhishek': [11, 0, 0],
  'desk-ashish': [14, 0, 0],
  'desk-divisha': [0, 0, 6],
  'desk-harshit-p': [11, 0, 10],
};

interface Office3DViewProps {
  tasks: Task[];
  onSelectTaskId: (taskId: string) => void;
}


// Lounge Sofa slots (Capacity 3)
const SOFA_SLOTS: [number, number, number][] = [
  [-13.45, 0, 10.55],
  [-12.5, 0, 10.55],
  [-11.55, 0, 10.55]
];
const RESTROOM_COORDS: [number, number, number] = [-18.5, 0, 14.5];

interface ActiveBreakItem {
  employeeId: string;
  type: 'sofa' | 'restroom';
  slotIndex?: number;
  expiresAt: number;
}
export const Office3DView: React.FC<Office3DViewProps> = ({ tasks, onSelectTaskId }) => {
  const [employees, setEmployees] = useState<OfficeEmployeeData[]>(DEFAULT_OFFICE_EMPLOYEES);
  const [speechMap, setSpeechMap] = useState<Record<string, SpeechBubbleItem>>({});
  const [activityLogs, setActivityLogs] = useState<SpeechBubbleItem[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('agent-aditya');
  const [followedEmployeeId, setFollowedEmployeeId] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Teams');
  const [performanceMode, setPerformanceMode] = useState<boolean>(false);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [currentScenarioStep, setCurrentScenarioStep] = useState<number | null>(null);
  const [activeRoutePoints, setActiveRoutePoints] = useState<[number, number, number][]>([]);
  const [isWalkMode, setIsWalkMode] = useState<boolean>(true);
  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);
  const [isAdityaGateOpen, setIsAdityaGateOpen] = useState<boolean>(false);
  const [isGirirajGateOpen, setIsGirirajGateOpen] = useState<boolean>(false);
  const [isConferenceGateOpen, setIsConferenceGateOpen] = useState<boolean>(false);
  const [isRestroomGateOpen, setIsRestroomGateOpen] = useState<boolean>(false);

  const handleToggleAdityaGate = () => setIsAdityaGateOpen((prev) => !prev);
  const handleToggleGirirajGate = () => setIsGirirajGateOpen((prev) => !prev);
  const handleToggleConferenceGate = () => setIsConferenceGateOpen((prev) => !prev);
  const handleToggleRestroomGate = () => setIsRestroomGateOpen((prev) => !prev);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);
  const [activeDialogueEmployee, setActiveDialogueEmployee] = useState<OfficeEmployeeData | null>(null);
  const [activeBreaks, setActiveBreaks] = useState<ActiveBreakItem[]>([]);

  // Autonomous Break Scheduler: Free/idle employees visit lounge sofa (max 3) or washroom and return to desks
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // 1. Process expired breaks - return employee to their home desk
      setActiveBreaks((currentBreaks) => {
        const stillActive: ActiveBreakItem[] = [];

        currentBreaks.forEach((b) => {
          if (now >= b.expiresAt) {
            // Send back to home coords
            setEmployees((prev) =>
              prev.map((emp) => {
                if (emp.id === b.employeeId) {
                  return {
                    ...emp,
                    target_coords: emp.home_coords,
                    action: 'WALK'
                  };
                }
                return emp;
              })
            );

            // After arrival, sit down facing North (Math.PI)
            setTimeout(() => {
              setEmployees((prev) =>
                prev.map((emp) => {
                  if (emp.id === b.employeeId) {
                    return {
                      ...emp,
                      current_coords: emp.home_coords,
                      target_coords: null,
                      action: 'SIT',
                      rotation_y: emp.id === 'agent-pooja' ? 0 : Math.PI
                    };
                  }
                  return emp;
                })
              );
            }, 3500);

            const targetEmp = employees.find((e) => e.id === b.employeeId);
            if (targetEmp) {
              triggerSpeech(
                targetEmp.id,
                targetEmp.name,
                'Break done! Wapas desk pe coding aur updates resume kar raha hu.',
                4000
              );
            }
          } else {
            stillActive.push(b);
          }
        });

        // 2. Check if a new break can be initiated
        if (!isScenarioRunning && stillActive.length < 3 && Math.random() < 0.65) {
          const occupiedSofaSlots = new Set(
            stillActive.filter((b) => b.type === 'sofa').map((b) => b.slotIndex)
          );
          const freeSofaSlots = [0, 1, 2].filter((s) => !occupiedSofaSlots.has(s));

          // Eligible: idle, no active task, not receptionist, not already on break, not moving
          const eligible = employees.filter(
            (e) =>
              e.id !== 'agent-pooja' &&
              e.status === 'IDLE' &&
              !e.current_task_id &&
              !stillActive.some((b) => b.employeeId === e.id) &&
              !e.target_coords
          );

          if (eligible.length > 0) {
            const chosen = eligible[Math.floor(Math.random() * eligible.length)];
            const shouldGoToSofa = freeSofaSlots.length > 0 && Math.random() < 0.7;

            if (shouldGoToSofa) {
              const slotIdx = freeSofaSlots[0];
              const destCoords = SOFA_SLOTS[slotIdx];
              const sofaPhrases = [
                'Chai break time! Sofa pe thoda relax kar leta hu.',
                'Sprint task wrap ho gaya, thoda lounge me chill karte hain.',
                'Coffee pee ke next PR review plan karenge.',
                '5 minute break on lounge sofa, refresh hoke aate hain.'
              ];
              const speechText = sofaPhrases[Math.floor(Math.random() * sofaPhrases.length)];

              stillActive.push({
                employeeId: chosen.id,
                type: 'sofa',
                slotIndex: slotIdx,
                expiresAt: now + 24000
              });

              setEmployees((prev) =>
                prev.map((emp) => {
                  if (emp.id === chosen.id) {
                    return {
                      ...emp,
                      target_coords: destCoords,
                      action: 'WALK'
                    };
                  }
                  return emp;
                })
              );

              setTimeout(() => {
                setEmployees((prev) =>
                  prev.map((emp) => {
                    if (emp.id === chosen.id) {
                      return {
                        ...emp,
                        current_coords: destCoords,
                        target_coords: null,
                        action: 'SIT',
                        rotation_y: 0
                      };
                    }
                    return emp;
                  })
                );
              }, 3500);

              triggerSpeech(chosen.id, chosen.name, speechText, 4500);
            } else {
              // Washroom break
              const washroomPhrases = [
                'Quick washroom break, 2 minute me wapas desk pe!',
                'Paani pee ke aur fresh hoke aata hu.',
                'Bas 2 minute me refresh hoke coding start karta hu.'
              ];
              const speechText = washroomPhrases[Math.floor(Math.random() * washroomPhrases.length)];

              stillActive.push({
                employeeId: chosen.id,
                type: 'restroom',
                expiresAt: now + 14000
              });

              setEmployees((prev) =>
                prev.map((emp) => {
                  if (emp.id === chosen.id) {
                    return {
                      ...emp,
                      target_coords: RESTROOM_COORDS,
                      action: 'WALK'
                    };
                  }
                  return emp;
                })
              );

              setTimeout(() => {
                setEmployees((prev) =>
                  prev.map((emp) => {
                    if (emp.id === chosen.id) {
                      return {
                        ...emp,
                        current_coords: RESTROOM_COORDS,
                        target_coords: null,
                        action: 'TALK',
                        rotation_y: -Math.PI / 2
                      };
                    }
                    return emp;
                  })
                );
              }, 3500);

              triggerSpeech(chosen.id, chosen.name, speechText, 4500);
            }
          }
        }

        return stillActive;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, isScenarioRunning, employees]);


  // Modal states for adding and editing employees
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<OfficeEmployeeData | null>(null);

  // Sync with live backend agents table
  const syncWithBackendAgents = async () => {
    try {
      const backendAgents = await api.getAgents();
      if (backendAgents && backendAgents.length > 0) {
        setEmployees((prev) => {
          // Merge updates or additions
          const prevMap = new Map(prev.map((e) => [e.id, e]));
          const updated: OfficeEmployeeData[] = [];

          backendAgents.forEach((ba, idx) => {
            if (prevMap.has(ba.id)) {
              const existing = prevMap.get(ba.id)!;
              updated.push({
                ...existing,
                name: ba.name,
                role: ba.role,
                status: ba.status,
                parent_id: ba.parent_id,
                current_task_id: ba.current_task_id,
                tasks_completed: ba.tasks_completed,
                tasks_failed: ba.tasks_failed
              });
              prevMap.delete(ba.id);
            } else {
              // Dynamically place new employee
              const slotZ = 8 + (idx % 4) * 2.5;
              const slotX = idx % 2 === 0 ? -4 : 4;
              const coords: [number, number, number] = [slotX, 0, slotZ];
              updated.push({
                id: ba.id,
                name: ba.name,
                role: ba.role,
                department: 'Core Engineering',
                parent_id: ba.parent_id || 'agent-giriraj',
                status: ba.status || 'IDLE',
                current_task_id: ba.current_task_id,
                tasks_completed: ba.tasks_completed || 0,
                tasks_failed: ba.tasks_failed || 0,
                model: ba.model || 'Gemini 1.5 Flash',
                desk_id: `desk-${ba.id}`,
                home_coords: coords,
                current_coords: coords,
                target_coords: null,
                rotation_y: 0,
                action: 'SIT',
                appearance: {
                  hairStyle: 'short',
                  hairColor: '#1e293b',
                  clothingStyle: 'polo',
                  clothingColor: '#0284c7',
                  pantsColor: '#1e293b',
                  skinTone: '#f5d0b5'
                }
              });
            }
          });

          return updated;
        });
      }
    } catch (e) {
      console.warn('Backend sync failed, using current office state', e);
    }
  };

  useEffect(() => {
    syncWithBackendAgents();
  }, []);

  // Selected Employee & Manager objects
  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || null;
  }, [employees, selectedEmployeeId]);

  const selectedManager = useMemo(() => {
    if (!selectedEmployee?.parent_id) return null;
    return employees.find((e) => e.id === selectedEmployee.parent_id) || null;
  }, [employees, selectedEmployee]);

  const selectedTask = useMemo(() => {
    if (!selectedEmployee?.current_task_id) return null;
    return tasks.find((t) => t.id === selectedEmployee.current_task_id) || null;
  }, [tasks, selectedEmployee]);

  const followedEmployee = useMemo(() => {
    if (!followedEmployeeId) return null;
    return employees.find((e) => e.id === followedEmployeeId) || null;
  }, [employees, followedEmployeeId]);

  // Filtered employees
  const visibleEmployees = useMemo(() => {
    if (selectedDepartment === 'All Teams') return employees;
    return employees.filter((e) => e.department === selectedDepartment);
  }, [employees, selectedDepartment]);

  // Helper to spawn a speech bubble
  const triggerSpeech = (speakerId: string, speakerName: string, text: string, durationMs = 5000) => {
    const item: SpeechBubbleItem = {
      id: `${speakerId}-${Date.now()}`,
      speaker_id: speakerId,
      speaker_name: speakerName,
      text,
      timestamp: Date.now(),
      duration_ms: durationMs
    };
    setSpeechMap((prev) => ({ ...prev, [speakerId]: item }));
    setActivityLogs((prev) => [...prev, item]);

    setTimeout(() => {
      setSpeechMap((prev) => {
        const next = { ...prev };
        if (next[speakerId]?.id === item.id) {
          delete next[speakerId];
        }
        return next;
      });
    }, durationMs);
  };

  // Listen to WebSocket events from Orchestrator
  useEffect(() => {
    const unsubscribe = wsClient.subscribe((event) => {
      if (event.type === 'OFFICE_LIFECYCLE_STEP') {
        const data = event.data as OfficeLifecycleStepEvent;
        setCurrentScenarioStep(data.step_number);
        setIsScenarioRunning(data.step_number < 12);

        // Spawn speech bubble
        if (data.speech && data.speech.text) {
          triggerSpeech(data.speech.speaker_id, data.speech.speaker_name, data.speech.text, 5500);
        }

        // Animate primary character target coords & action
        setEmployees((prev) =>
          prev.map((emp) => {
            if (emp.id === data.primary_agent_id) {
              const targetCoords = WAYPOINTS[data.target_location] || emp.home_coords;
              return {
                ...emp,
                target_coords: targetCoords,
                current_coords: targetCoords,
                action: (data.action as any) || 'TALK',
                current_task_id: data.task_id
              };
            }
            if (data.target_agent_id && emp.id === data.target_agent_id) {
              return {
                ...emp,
                action: 'TALK'
              };
            }
            return emp;
          })
        );

        // Update reporting route splines
        if (data.step_number === 1) {
          setActiveRoutePoints([
            WAYPOINTS['cabin-aditya'],
            WAYPOINTS['meeting-aditya-lead'],
            WAYPOINTS['cabin-giriraj']
          ]);
        } else if (data.step_number === 3) {
          setActiveRoutePoints([
            WAYPOINTS['cabin-giriraj'],
            WAYPOINTS['desk-rohan']
          ]);
        } else if (data.step_number === 5 || data.step_number === 6) {
          setActiveRoutePoints([
            WAYPOINTS['desk-rohan'],
            WAYPOINTS['cabin-giriraj']
          ]);
        } else if (data.step_number === 7) {
          setActiveRoutePoints([
            WAYPOINTS['cabin-giriraj'],
            WAYPOINTS['desk-abhishek']
          ]);
        } else if (data.step_number === 8) {
          setActiveRoutePoints([
            WAYPOINTS['desk-abhishek'],
            WAYPOINTS['lab-qa']
          ]);
        } else if (data.step_number === 9) {
          setActiveRoutePoints([
            WAYPOINTS['lab-qa'],
            WAYPOINTS['desk-abhishek'],
            WAYPOINTS['cabin-giriraj'],
            WAYPOINTS['desk-rohan']
          ]);
        } else if (data.step_number === 10) {
          setActiveRoutePoints([
            WAYPOINTS['cabin-giriraj'],
            WAYPOINTS['area-devops']
          ]);
        } else if (data.step_number === 12) {
          setActiveRoutePoints([
            WAYPOINTS['cabin-giriraj'],
            WAYPOINTS['cabin-aditya']
          ]);
        }
      }

      if (event.type === 'EMPLOYEE_INTERACTION') {
        const d = event.data;
        if (d.speech && d.from_agent_id) {
          const emp = employees.find(e => e.id === d.from_agent_id);
          triggerSpeech(d.from_agent_id, emp?.name || d.from_agent_id, d.speech);
        }
      }

      if (event.type === 'AGENTS_UPDATED') {
        syncWithBackendAgents();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [employees]);

  // Handle Add Employee
  const handleAddEmployee = async (newEmp: {
    name: string;
    role: string;
    department: string;
    parent_id: string | null;
    clothingColor: string;
    hairStyle: 'short' | 'parted' | 'bob' | 'ponytail' | 'curly' | 'fade';
  }) => {
    try {
      const created = await api.createAgent({
        name: newEmp.name,
        role: newEmp.role,
        department: newEmp.department,
        parent_id: newEmp.parent_id
      });

      const slotZ = 8 + (employees.length % 4) * 2.5;
      const slotX = employees.length % 2 === 0 ? -4 : 4;
      const coords: [number, number, number] = [slotX, 0, slotZ];

      const newOfficeEmp: OfficeEmployeeData = {
        id: created.id,
        name: created.name,
        role: created.role,
        department: newEmp.department,
        parent_id: created.parent_id,
        status: 'IDLE',
        current_task_id: null,
        tasks_completed: 0,
        tasks_failed: 0,
        model: 'Gemini 1.5 Flash',
        desk_id: `desk-${created.id}`,
        home_coords: coords,
        current_coords: coords,
        target_coords: null,
        rotation_y: 0,
        action: 'SIT',
        appearance: {
          hairStyle: newEmp.hairStyle,
          hairColor: '#1e293b',
          clothingStyle: 'polo',
          clothingColor: newEmp.clothingColor,
          pantsColor: '#1e293b',
          skinTone: '#f5d0b5'
        }
      };

      setEmployees((prev) => [...prev, newOfficeEmp]);
      setSelectedEmployeeId(newOfficeEmp.id);
      triggerSpeech(newOfficeEmp.id, newOfficeEmp.name, `Hello team! I just joined as ${newOfficeEmp.role}.`, 6000);
    } catch (e) {
      console.error('Failed to add employee', e);
      alert('Failed to add employee to backend.');
    }
  };

  // Handle Update Employee
  const handleUpdateEmployee = async (
    empId: string,
    updates: { name: string; role: string; department: string; parent_id: string | null }
  ) => {
    try {
      await api.updateAgent(empId, updates);
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === empId) {
            return {
              ...emp,
              name: updates.name,
              role: updates.role,
              department: updates.department,
              parent_id: updates.parent_id
            };
          }
          return emp;
        })
      );
      triggerSpeech(empId, updates.name, 'My role and credentials have been updated.');
    } catch (e) {
      console.error('Failed to update employee', e);
      alert('Failed to update employee.');
    }
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async (empId: string) => {
    try {
      await api.deleteAgent(empId);
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
      if (selectedEmployeeId === empId) setSelectedEmployeeId('agent-aditya');
      if (followedEmployeeId === empId) {
        setFollowedEmployeeId(null);
        setCameraPreset('overview');
      }
    } catch (e) {
      console.error('Failed to delete employee', e);
      alert('Failed to delete employee.');
    }
  };

  // Handle Lifecycle Scenario Trigger
  const handleRunLifecycleScenario = async () => {
    setIsScenarioRunning(true);
    setCurrentScenarioStep(1);
    setCameraPreset('overview');

    try {
      await fetch('/api/office/lifecycle-scenario?step_delay=2.2', { method: 'POST' });
    } catch (e) {
      console.error('Failed to trigger office lifecycle scenario', e);
      setIsScenarioRunning(false);
    }
  };

  // Follow employee toggle
  const handleFollowEmployee = (emp: OfficeEmployeeData) => {
    if (followedEmployeeId === emp.id) {
      setFollowedEmployeeId(null);
      setCameraPreset('overview');
    } else {
      setFollowedEmployeeId(emp.id);
      setCameraPreset('follow');
    }
  };

  const handleSelectZone = (zone: string) => {
    if (zone.includes('Executive')) setCameraPreset('aditya_cabin');
    else if (zone.includes('Engineering')) setCameraPreset('giriraj_cabin');
    else if (zone.includes('QA')) setCameraPreset('qa_lab');
    else if (zone.includes('DevOps')) setCameraPreset('devops');
    else if (zone.includes('BA')) setCameraPreset('ba_lounge');
  };

  // Unit Navigation Cycle Handlers
  const currentUnitIdx = visibleEmployees.findIndex((e) => e.id === selectedEmployeeId);
  const selectedEmployeeIndex = currentUnitIdx >= 0 ? currentUnitIdx : 0;

  const handleNextEmployee = () => {
    if (visibleEmployees.length === 0) return;
    const nextIdx = (selectedEmployeeIndex + 1) % visibleEmployees.length;
    const nextEmp = visibleEmployees[nextIdx];
    setSelectedEmployeeId(nextEmp.id);
    setFollowedEmployeeId(nextEmp.id);
    setCameraPreset('follow');
    setIsWalkMode(false);
  };

  const handlePrevEmployee = () => {
    if (visibleEmployees.length === 0) return;
    const prevIdx = (selectedEmployeeIndex - 1 + visibleEmployees.length) % visibleEmployees.length;
    const prevEmp = visibleEmployees[prevIdx];
    setSelectedEmployeeId(prevEmp.id);
    setFollowedEmployeeId(prevEmp.id);
    setCameraPreset('follow');
    setIsWalkMode(false);
  };

  // Game Tactical Keyboard Shortcuts (1-8 presets, F for follow, Arrow Keys / [ ] to cycle units)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        setIsWalkMode(false);
        setActiveDialogueEmployee(null);
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGateOpen((prev) => !prev);
      } else if (!isWalkMode && (e.key === 'ArrowRight' || e.key === ']')) {
        handleNextEmployee();
      } else if (!isWalkMode && (e.key === 'ArrowLeft' || e.key === '[')) {
        handlePrevEmployee();
      } else if (e.key === '1') {
        setIsWalkMode(false);
        setCameraPreset('overview');
      } else if (e.key === '2') {
        setIsWalkMode(false);
        setCameraPreset('top_down');
      } else if (e.key === '3') {
        setIsWalkMode(false);
        setCameraPreset('aditya_cabin');
      } else if (e.key === '4') {
        setIsWalkMode(false);
        setCameraPreset('giriraj_cabin');
      } else if (e.key === '5') {
        setIsWalkMode(false);
        setCameraPreset('dev_pod');
      } else if (e.key === '6') {
        setIsWalkMode(false);
        setCameraPreset('qa_lab');
      } else if (e.key === '7') {
        setIsWalkMode(false);
        setCameraPreset('devops');
      } else if (e.key === '8') {
        setIsWalkMode(false);
        setCameraPreset('ba_lounge');
      } else if (e.key === 'f' || e.key === 'F') {
        if (selectedEmployee) handleFollowEmployee(selectedEmployee);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmployee, followedEmployeeId, isWalkMode, selectedEmployeeIndex, visibleEmployees]);

  return (
    <div ref={containerRef} className={`relative w-full ${isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : "h-[780px] rounded-3xl"} overflow-hidden border-2 border-sky-500/40 shadow-[0_0_50px_rgba(2,132,199,0.25)] bg-slate-950 transition-all`}>
      {/* 3D Scene Canvas */}
      <OfficeScene
        employees={visibleEmployees}
        speechMap={speechMap}
        selectedEmployeeId={selectedEmployeeId}
        onSelectEmployee={(emp) => {
          setSelectedEmployeeId(emp.id);
          if (followedEmployeeId) setFollowedEmployeeId(emp.id);
        }}
        onSelectZone={handleSelectZone}
        cameraPreset={cameraPreset}
        speedMultiplier={isPaused ? 0 : speedMultiplier}
        performanceMode={performanceMode}
        followedEmployee={followedEmployee}
        activeRoutePoints={activeRoutePoints}
        isWalkMode={isWalkMode}
        onToggleWalkMode={() => setIsWalkMode(!isWalkMode)}
        isGateOpen={isGateOpen}
        onToggleGate={() => setIsGateOpen((prev) => !prev)}
        onTalkToEmployee={(emp) => setActiveDialogueEmployee(emp)}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {/* Interactive Tactical Radar Mini-Map (Bottom-Left) */}
      <TacticalMiniMap
        employees={visibleEmployees}
        selectedEmployeeId={selectedEmployeeId}
        onSelectEmployee={(emp) => {
          setSelectedEmployeeId(emp.id);
          setFollowedEmployeeId(emp.id);
          setCameraPreset('follow');
          setIsWalkMode(false);
        }}
      />

      {/* Top Floating Control Bar */}
      <OfficeControls
        currentCameraPreset={cameraPreset}
        onSelectCameraPreset={(p) => {
          setFollowedEmployeeId(null);
          setCameraPreset(p);
          setIsWalkMode(false);
        }}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={(spd) => setSpeedMultiplier(spd)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRunLifecycleScenario={handleRunLifecycleScenario}
        isScenarioRunning={isScenarioRunning}
        currentStep={currentScenarioStep}
        selectedDepartment={selectedDepartment}
        onSelectDepartment={(dept) => setSelectedDepartment(dept)}
        performanceMode={performanceMode}
        onTogglePerformanceMode={() => setPerformanceMode(!performanceMode)}
        activeFollowName={followedEmployee?.name}
        onOpenAddEmployee={() => setIsAddModalOpen(true)}
        isWalkMode={isWalkMode}
        onToggleWalkMode={() => setIsWalkMode(!isWalkMode)}
        onNextEmployee={handleNextEmployee}
        onPrevEmployee={handlePrevEmployee}
        selectedEmployeeName={selectedEmployee?.name}
        selectedEmployeeIndex={selectedEmployeeIndex}
        totalEmployees={visibleEmployees.length}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Bottom-Left: Selected Employee Work Context Inspector */}
      {selectedEmployee && (
        <EmployeeInspectorCard
          employee={selectedEmployee}
          manager={selectedManager}
          task={selectedTask}
          onClose={() => setSelectedEmployeeId(null)}
          onFollowEmployee={handleFollowEmployee}
          onInspectTask={(tId) => onSelectTaskId(tId)}
          isFollowing={followedEmployeeId === selectedEmployee.id}
          onOpenEdit={(emp) => setEditingEmployee(emp)}
          onDeleteEmployee={handleDeleteEmployee}
        />
      )}

      {/* Bottom-Right: Live Speech and Dialogue Feed */}
      <LiveActivityFeed
        logs={activityLogs}
        onSelectSpeaker={(spkId) => {
          setSelectedEmployeeId(spkId);
          setFollowedEmployeeId(spkId);
          setCameraPreset('follow');
        }}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        existingEmployees={employees}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        onUpdateEmployee={handleUpdateEmployee}
        existingEmployees={employees}
      />

      {/* Interactive Speaker Dialogue between Owner Chotu Kumar and Employees */}
      {activeDialogueEmployee && (
        <ChotuKumarDialogueModal
          employee={activeDialogueEmployee}
          task={
            tasks.find((t) => t.id === activeDialogueEmployee.current_task_id) ||
            tasks.find((t) => t.assigned_agent_id === activeDialogueEmployee.id) ||
            null
          }
          latestSpeech={speechMap[activeDialogueEmployee.id] || null}
          allTasks={tasks}
          onClose={() => setActiveDialogueEmployee(null)}
        />
      )}
    </div>
  );
};

export default Office3DView;
