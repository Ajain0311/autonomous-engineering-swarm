with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

divisha_old = """    id: 'agent-divisha',
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
    current_coords: [0, 0, 6.62],"""

divisha_new = """    id: 'agent-divisha',
    name: 'Divisha Joshi',
    role: 'Documentation Engineer & BA Specialist',
    department: 'Product & Design',
    parent_id: 'agent-aditya',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 13,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-bhupendra',
    home_coords: [-13.5, 0, 1.2],
    current_coords: [-13.5, 0, 1.2],"""

bhupendra_old = """    id: 'agent-bhupendra',
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
    current_coords: [-13.5, 0, 1.2],"""

bhupendra_new = """    id: 'agent-bhupendra',
    name: 'Bhupendra Jingar',
    role: 'Business Analyst (Lazy Lead)',
    department: 'Product & Design',
    parent_id: 'agent-aditya',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 12,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-divisha',
    home_coords: [0, 0, 6.62],
    current_coords: [0, 0, 6.62],"""

text = text.replace(divisha_old, divisha_new)
text = text.replace(bhupendra_old, bhupendra_new)

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully seated Divisha Joshi in BA Cabin!')
