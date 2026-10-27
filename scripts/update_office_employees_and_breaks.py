import re

with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update DEFAULT_OFFICE_EMPLOYEES rotations:
# Change all rotation_y: 0 and rotation_y: Math.PI / 2 to rotation_y: Math.PI EXCEPT agent-pooja
# First, let's replace Bhupendra coords and rotation
text = text.replace(
    '''  {
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
    home_coords: [-13.5, 0, 0.6],
    current_coords: [-13.5, 0, 0.6],
    target_coords: null,
    rotation_y: Math.PI / 2,''',
    '''  {
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
    rotation_y: Math.PI,'''
)

# Replace Mohit's coords from [4, 0, -2] to [4, 0, -1.38]
text = text.replace(
    '''    desk_id: 'desk-mohit',
    home_coords: [4, 0, -2],
    current_coords: [4, 0, -2],''',
    '''    desk_id: 'desk-mohit',
    home_coords: [4, 0, -1.38],
    current_coords: [4, 0, -1.38],'''
)

# Now, find all employees in DEFAULT_OFFICE_EMPLOYEES and ensure rotation_y is Math.PI for everyone except agent-pooja
def update_emp_rotation(match):
    block = match.group(0)
    if 'agent-pooja' in block:
        return block
    # replace rotation_y: 0 with rotation_y: Math.PI
    block = re.sub(r'rotation_y:\s*0\b', 'rotation_y: Math.PI', block)
    return block

# Match each employee object block in DEFAULT_OFFICE_EMPLOYEES
text = re.sub(r'\{\s*id:\s*\'agent-[^\']+\'[\s\S]*?accessory:[^\}]+\}\s*\}', update_emp_rotation, text)

# 2. Add WAYPOINTS for sofa and restrooms
sofa_waypoints = '''  'desk-kathan': [14.5, 0, 10],
  'desk-reception': [5.5, 0, 11.85],
  'sofa-slot-1': [-13.45, 0, 10.55],
  'sofa-slot-2': [-12.5, 0, 10.55],
  'sofa-slot-3': [-11.55, 0, 10.55],
  'restrooms': [-18.5, 0, 14.5]'''
text = text.replace("  'desk-kathan': [14.5, 0, 10],\n  'desk-reception': [5.5, 0, 11.85]", sofa_waypoints)

# 3. Add active breaks state and autonomous break scheduler inside Office3DView
break_constants = '''
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
'''

text = text.replace('export const Office3DView: React.FC<Office3DViewProps> = ({ tasks, onSelectTaskId }) => {', break_constants + 'export const Office3DView: React.FC<Office3DViewProps> = ({ tasks, onSelectTaskId }) => {')

break_state_and_effect = '''  const [activeBreaks, setActiveBreaks] = useState<ActiveBreakItem[]>([]);

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
'''

target_after_dialogue_state = '  const [activeDialogueEmployee, setActiveDialogueEmployee] = useState<OfficeEmployeeData | null>(null);'
text = text.replace(target_after_dialogue_state, target_after_dialogue_state + '\n' + break_state_and_effect)

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('Updated Office3DView.tsx with rotations, waypoints and autonomous breaks')
