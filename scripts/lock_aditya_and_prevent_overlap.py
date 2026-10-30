with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Aditya Jain never leaves his executive cabin:
# In Break Scheduler: Exclude agent-aditya explicitly
old_eligible = """          // Eligible: idle, no active task, not receptionist, not already on break, not moving
          const eligible = employees.filter(
            (e) =>
              e.id !== 'agent-pooja' &&
              e.status === 'IDLE' &&
              !e.current_task_id &&
              !stillActive.some((b) => b.employeeId === e.id) &&
              !e.target_coords
          );"""

new_eligible = """          // Eligible: idle, no active task, not receptionist, NOT Aditya (Chief never leaves executive cabin), not on break, not moving
          const eligible = employees.filter(
            (e) =>
              e.id !== 'agent-pooja' &&
              e.id !== 'agent-aditya' &&
              !e.name.includes('Aditya') &&
              e.status === 'IDLE' &&
              !e.current_task_id &&
              !stillActive.some((b) => b.employeeId === e.id) &&
              !e.target_coords
          );"""

text = text.replace(old_eligible, new_eligible)

# In scenario lifecycle steps: Aditya NEVER changes coords from home_coords!
old_primary_anim = """        // Animate primary character target coords & action
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
        );"""

new_primary_anim = """        // Animate primary character target coords & action (Aditya Jain NEVER leaves his cabin)
        setEmployees((prev) =>
          prev.map((emp) => {
            if (emp.id === data.primary_agent_id) {
              const isAditya = emp.id === 'agent-aditya' || emp.name.includes('Aditya');
              const targetCoords = isAditya ? emp.home_coords : (WAYPOINTS[data.target_location] || emp.home_coords);
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
        );"""

text = text.replace(old_primary_anim, new_primary_anim)

# 2. Prevent overlapping:
# In Restroom break: Allocate unique offset slots for characters so they never stand on top of each other!
restroom_slots_def = """const RESTROOM_SLOTS: [number, number, number][] = [
  [-17.6, 0, 14.5],
  [-18.5, 0, 14.5],
  [-19.4, 0, 14.5]
];"""

text = text.replace("const RESTROOM_COORDS: [number, number, number] = [-18.5, 0, 14.5];", restroom_slots_def)

# In restroom break assignment:
old_restroom_trigger = """              stillActive.push({
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
              }, 3500);"""

new_restroom_trigger = """              const occupiedRestroomSlots = new Set(
                stillActive.filter((b) => b.type === 'restroom').map((b) => b.slotIndex ?? 1)
              );
              const freeRestSlots = [0, 1, 2].filter((s) => !occupiedRestroomSlots.has(s));
              const restSlotIdx = freeRestSlots.length > 0 ? freeRestSlots[0] : 1;
              const destRestCoords = RESTROOM_SLOTS[restSlotIdx];

              stillActive.push({
                employeeId: chosen.id,
                type: 'restroom',
                slotIndex: restSlotIdx,
                expiresAt: now + 14000
              });

              setEmployees((prev) =>
                prev.map((emp) => {
                  if (emp.id === chosen.id) {
                    return {
                      ...emp,
                      target_coords: destRestCoords,
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
                        current_coords: destRestCoords,
                        target_coords: null,
                        action: 'TALK',
                        rotation_y: -Math.PI / 2
                      };
                    }
                    return emp;
                  })
                );
              }, 3500);"""

text = text.replace(old_restroom_trigger, new_restroom_trigger)

# 3. Spread QA Ashish and Abhishek so their chairs & bodies have comfortable 2.2m clearance (no shoulder overlapping):
# Abhishek Hingar: [11.8, 0, 1.18]
# Ashish Das: [14.0, 0, 1.18]
text = text.replace("home_coords: [12.2, 0, 1.18],\n    current_coords: [12.2, 0, 1.18],", "home_coords: [11.8, 0, 1.18],\n    current_coords: [11.8, 0, 1.18],")
text = text.replace("home_coords: [13.8, 0, 1.18],\n    current_coords: [13.8, 0, 1.18],", "home_coords: [14.0, 0, 1.18],\n    current_coords: [14.0, 0, 1.18],")

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Office3DView.tsx: Aditya never leaves cabin, non-overlapping break slots & separated QA seats!')
