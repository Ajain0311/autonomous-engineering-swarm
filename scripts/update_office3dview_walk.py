p = r'D:\FREELANCER\autonomous-engineering-swarm\frontend\src\components\office\Office3DView.tsx'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add isWalkMode state
old_state = "const [activeRoutePoints, setActiveRoutePoints] = useState<[number, number, number][]>([]);"
new_state = """const [activeRoutePoints, setActiveRoutePoints] = useState<[number, number, number][]>([]);
  const [isWalkMode, setIsWalkMode] = useState<boolean>(false);"""

text = text.replace(old_state, new_state)

# 2. Add navigation handlers and keyboard shortcuts
old_shortcuts = """  // Game Tactical Keyboard Shortcuts (1-8 presets, F for follow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') setCameraPreset('overview');
      else if (e.key === '2') setCameraPreset('top_down');
      else if (e.key === '3') setCameraPreset('aditya_cabin');
      else if (e.key === '4') setCameraPreset('giriraj_cabin');
      else if (e.key === '5') setCameraPreset('dev_pod');
      else if (e.key === '6') setCameraPreset('qa_lab');
      else if (e.key === '7') setCameraPreset('devops');
      else if (e.key === '8') setCameraPreset('ba_lounge');
      else if (e.key === 'f' || e.key === 'F') {
        if (selectedEmployee) handleFollowEmployee(selectedEmployee);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmployee, followedEmployeeId]);"""

new_shortcuts = """  // Unit Navigation Cycle Handlers
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
  }, [selectedEmployee, followedEmployeeId, isWalkMode, selectedEmployeeIndex, visibleEmployees]);"""

text_normalized = text.replace('\r\n', '\n')
old_shortcuts_norm = old_shortcuts.replace('\r\n', '\n')
new_shortcuts_norm = new_shortcuts.replace('\r\n', '\n')

if old_shortcuts_norm in text_normalized:
    text_normalized = text_normalized.replace(old_shortcuts_norm, new_shortcuts_norm)
else:
    print('Warning: old_shortcuts not matched')

# 3. Update OfficeScene and OfficeControls props in render
old_render = """      {/* 3D Scene Canvas */}
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
      />

      {/* Interactive Tactical Radar Mini-Map (Bottom-Left) */}
      <TacticalMiniMap
        employees={visibleEmployees}
        selectedEmployeeId={selectedEmployeeId}
        onSelectEmployee={(emp) => {
          setSelectedEmployeeId(emp.id);
          setFollowedEmployeeId(emp.id);
          setCameraPreset('follow');
        }}
      />

      {/* Top Floating Control Bar */}
      <OfficeControls
        currentCameraPreset={cameraPreset}
        onSelectCameraPreset={(p) => {
          setFollowedEmployeeId(null);
          setCameraPreset(p);
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
      />"""

new_render = """      {/* 3D Scene Canvas */}
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
      />"""

old_render_norm = old_render.replace('\r\n', '\n')
new_render_norm = new_render.replace('\r\n', '\n')

if old_render_norm in text_normalized:
    text_normalized = text_normalized.replace(old_render_norm, new_render_norm)
else:
    print('Warning: old_render not matched')

with open(p, 'w', encoding='utf-8') as f:
    f.write(text_normalized)

print('Updated Office3DView.tsx with Walk Mode and Navigation Keys successfully!')
