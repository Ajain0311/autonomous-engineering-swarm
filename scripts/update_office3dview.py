p = r'D:\FREELANCER\autonomous-engineering-swarm\frontend\src\components\office\Office3DView.tsx'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

target = """  const handleSelectZone = (zone: string) => {
    if (zone.includes('Executive')) setCameraPreset('aditya_cabin');
    else if (zone.includes('Engineering')) setCameraPreset('giriraj_cabin');
    else if (zone.includes('QA')) setCameraPreset('qa_lab');
    else if (zone.includes('DevOps')) setCameraPreset('devops');
    else if (zone.includes('BA')) setCameraPreset('ba_lounge');
  };

  return (
    <div className="relative w-full h-[780px] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
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
      />"""

replacement = """  const handleSelectZone = (zone: string) => {
    if (zone.includes('Executive')) setCameraPreset('aditya_cabin');
    else if (zone.includes('Engineering')) setCameraPreset('giriraj_cabin');
    else if (zone.includes('QA')) setCameraPreset('qa_lab');
    else if (zone.includes('DevOps')) setCameraPreset('devops');
    else if (zone.includes('BA')) setCameraPreset('ba_lounge');
  };

  // Game Tactical Keyboard Shortcuts (1-8 presets, F for follow)
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
  }, [selectedEmployee, followedEmployeeId]);

  return (
    <div className="relative w-full h-[780px] rounded-3xl overflow-hidden border-2 border-sky-500/40 shadow-[0_0_50px_rgba(2,132,199,0.25)] bg-slate-950">
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
      />"""

# Normalize \r\n to \n
text_normalized = text.replace('\r\n', '\n')
target_normalized = target.replace('\r\n', '\n')
replacement_normalized = replacement.replace('\r\n', '\n')

if target_normalized in text_normalized:
    updated = text_normalized.replace(target_normalized, replacement_normalized)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(updated)
    print('Successfully updated Office3DView.tsx with TacticalMiniMap and keyboard shortcuts')
else:
    print('Target string not found in normalized text')
