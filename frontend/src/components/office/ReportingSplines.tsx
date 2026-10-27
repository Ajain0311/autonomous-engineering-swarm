import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ReportingSplinesProps {
  routePoints: [number, number, number][];
  color?: string;
}

export const ReportingSplines: React.FC<ReportingSplinesProps> = ({
  routePoints,
  color = '#38bdf8'
}) => {
  const curvePoints = useMemo(() => {
    if (routePoints.length < 2) return [];
    const pts = routePoints.map(p => new THREE.Vector3(p[0], 0.25, p[2]));
    const curve = new THREE.CatmullRomCurve3(pts);
    return curve.getPoints(50);
  }, [routePoints]);

  const lineGeometry = useMemo(() => {
    if (curvePoints.length === 0) return null;
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [curvePoints]);

  const lineObject = useMemo(() => {
    if (!lineGeometry) return null;
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      linewidth: 3
    });
    return new THREE.Line(lineGeometry, mat);
  }, [lineGeometry, color]);

  useFrame(() => {
    if (lineObject && lineObject.material) {
      (lineObject.material as THREE.LineBasicMaterial).opacity =
        0.5 + Math.sin(Date.now() * 0.005) * 0.35;
    }
  });

  if (!lineObject || curvePoints.length === 0) return null;

  return (
    <group>
      <primitive object={lineObject} />

      {/* Nodes at waypoints */}
      {routePoints.map((pt, i) => (
        <mesh key={`node-${i}`} position={[pt[0], 0.15, pt[2]]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};
