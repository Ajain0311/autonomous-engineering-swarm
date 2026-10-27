nav_path = 'frontend/src/components/Navbar.tsx'
with open(nav_path, 'r', encoding='utf-8') as f:
    nav = f.read()

nav = nav.replace(
    "const navTabs = [\n    { id: 'hierarchy', label: 'Agent Hierarchy (18 Roles)' },",
    "const navTabs = [\n    { id: 'office3d', label: 'Living 3D AI Office 🏢' },\n    { id: 'hierarchy', label: 'Agent Hierarchy (18 Roles)' },"
)
nav = nav.replace(
    "const navTabs = [\r\n    { id: 'hierarchy', label: 'Agent Hierarchy (18 Roles)' },",
    "const navTabs = [\r\n    { id: 'office3d', label: 'Living 3D AI Office 🏢' },\r\n    { id: 'hierarchy', label: 'Agent Hierarchy (18 Roles)' },"
)
nav = nav.replace('17 Agents Live', '18 AI Employees Live')

with open(nav_path, 'w', encoding='utf-8') as f:
    f.write(nav)
print('Updated Navbar.tsx')

app_path = 'frontend/src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app = f.read()

# Add Office3DView import
app = app.replace(
    "import { TaskDetailModal } from './components/TaskDetailModal';",
    "import { TaskDetailModal } from './components/TaskDetailModal';\nimport { Office3DView } from './components/office/Office3DView';"
)
# Set default tab to office3d
app = app.replace(
    "const [activeTab, setActiveTab] = useState<string>('hierarchy');",
    "const [activeTab, setActiveTab] = useState<string>('office3d');\n  const [tasks, setTasks] = useState<Task[]>([]);"
)
# In loadAllData fetch tasks
app = app.replace(
    "setAgents(agentsData);",
    "setAgents(agentsData);\n      api.getTasks().then(setTasks);"
)
# Render Office3DView
office_render = '''        {/* Tab Views */}
        {activeTab === 'office3d' && (
          <Office3DView tasks={tasks} onSelectTaskId={(taskId) => setSelectedTaskId(taskId)} />
        )}

        {activeTab === 'hierarchy' && ('''

app = app.replace(
    "        {/* Tab Views */}\n        {activeTab === 'hierarchy' && (",
    office_render
)
app = app.replace(
    "        {/* Tab Views */}\r\n        {activeTab === 'hierarchy' && (",
    office_render.replace('\n', '\r\n')
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app)
print('Updated App.tsx')
