/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  BuildingLocation,
  LOCATIONS,
  GRAPH_NODES,
  GRAPH_EDGES,
  pxToMeters
} from '../data/campusData';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  GraduationCap,
  Scale,
  BookOpen,
  Cpu,
  Award,
  Palette,
  Coffee,
  Church,
  ShieldCheck,
  Play,
  RotateCcw,
  Footprints,
  Sparkles
} from 'lucide-react';

interface CampusMapCanvasProps {
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string) => void;
  activePath: string[];
  walkingNodeIndex: number;
  isSimulatingWalk: boolean;
  onToggleSimulateWalk: () => void;
  onResetRoute: () => void;
  highlightedRoomCode?: string | null;
  filterCategory: string | null;
  accessibilityOnly: boolean;
  mapLayer: 'google' | 'didactic' | 'night';
  setMapLayer: (layer: 'google' | 'didactic' | 'night') => void;
}

export const CampusMapCanvas: React.FC<CampusMapCanvasProps> = ({
  selectedBuildingId,
  onSelectBuilding,
  activePath,
  walkingNodeIndex,
  isSimulatingWalk,
  onToggleSimulateWalk,
  onResetRoute,
  highlightedRoomCode,
  filterCategory,
  accessibilityOnly,
  mapLayer,
  setMapLayer
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan and Zoom state (800 x 680 base coordinate space)
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 15 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Center campus
  const centerCampus = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = Math.min(rect.width / 820, rect.height / 700, 1.25);
    setZoom(scale);
    setPan({
      x: (rect.width - 778 * scale) / 2,
      y: (rect.height - 650 * scale) / 2,
    });
  }, []);

  // Pan to selected building
  const panToBuilding = useCallback((building: BuildingLocation) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetScale = Math.max(1.3, zoom);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setZoom(targetScale);
    setPan({
      x: centerX - building.x * targetScale,
      y: centerY - building.y * targetScale,
    });
  }, [zoom]);

  // Initial center on mount
  useEffect(() => {
    centerCampus();
  }, [centerCampus]);

  // When selected building changes externally
  useEffect(() => {
    if (selectedBuildingId && LOCATIONS[selectedBuildingId]) {
      panToBuilding(LOCATIONS[selectedBuildingId]);
    }
  }, [selectedBuildingId, panToBuilding]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom((prev) => Math.min(3.2, Math.max(0.65, prev * zoomFactor)));
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Convert active path node IDs to SVG polyline coordinates
  const activeRoutePoints = useMemo(() => {
    if (!activePath || activePath.length <= 1) return '';
    return activePath
      .map((nodeId) => {
        const node = GRAPH_NODES[nodeId];
        return node ? `${node.x},${node.y}` : '';
      })
      .filter(Boolean)
      .join(' ');
  }, [activePath]);

  // Current walking position
  const currentWalkerNode = useMemo(() => {
    if (activePath && activePath.length > 0) {
      const idx = Math.min(walkingNodeIndex, activePath.length - 1);
      return GRAPH_NODES[activePath[idx]] || null;
    }
    return null;
  }, [activePath, walkingNodeIndex]);

  // Icon selector helper
  const renderBuildingIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Scale': return <Scale className="w-3.5 h-3.5" />;
      case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5" />;
      case 'Award': return <Award className="w-3.5 h-3.5" />;
      case 'Palette': return <Palette className="w-3.5 h-3.5" />;
      case 'Coffee': return <Coffee className="w-3.5 h-3.5" />;
      case 'Church': return <Church className="w-3.5 h-3.5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      default: return <GraduationCap className="w-3.5 h-3.5" />;
    }
  };

  const isNight = mapLayer === 'night';

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full overflow-hidden select-none ${
        isNight ? 'bg-[#1e232a]' : 'bg-[#f4f5f7]'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* 100% Vector SVG Canvas (No bitmap images used) */}
      <div
        className="absolute top-0 left-0 w-[778px] h-[649px] origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          viewBox="0 0 778 649"
          className="w-[778px] h-[649px] pointer-events-auto"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Building 3D Drop Shadows */}
            <filter id="vector-building-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity={isNight ? '0.45' : '0.16'} />
            </filter>
            {/* Selected Building Glow */}
            <filter id="vector-active-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2563eb" floodOpacity="0.75" />
            </filter>
            {/* Route Glow */}
            <filter id="vector-route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#1a73e8" floodOpacity="0.6" />
            </filter>
            {/* Ágora Pavers Pattern */}
            <pattern id="agora-hex-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill={isNight ? '#252a32' : '#f7f4ee'} />
              <path d="M 8 0 L 16 4 L 16 12 L 8 16 L 0 12 L 0 4 Z" fill="none" stroke={isNight ? '#2e3540' : '#ece5d8'} strokeWidth="0.8" />
            </pattern>
            {/* Atrio Pavers Pattern */}
            <pattern id="atrio-pavers" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill={isNight ? '#222730' : '#f4efe6'} />
              <path d="M 0 0 L 12 0 M 0 0 L 0 12" fill="none" stroke={isNight ? '#2a313d' : '#e5ded1'} strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* 1. Surrounding Base Terrain */}
          <rect x="0" y="0" width="778" height="649" fill={isNight ? '#1e232a' : '#f4f5f7'} />

          {/* 2. Campus Grounds Polygon (North of Av. 14 de Septiembre) */}
          <polygon
            points="125,405 168,245 228,85 375,40 635,40 648,470 330,470 125,405"
            fill={isNight ? '#232b27' : '#d8edd3'}
            stroke={isNight ? '#2d3832' : '#c3dec0'}
            strokeWidth="1.5"
          />

          {/* South Grounds (Across Av. 14 de Septiembre) */}
          <rect
            x="180"
            y="522"
            width="460"
            height="125"
            rx="6"
            fill={isNight ? '#232832' : '#eef2f5'}
            stroke={isNight ? '#2a313d' : '#dbe2e8'}
            strokeWidth="1"
          />

          {/* 3. Avenida 14 de Septiembre (Horizontal Obrajes Avenue) */}
          <g id="av-14-septiembre">
            {/* Road border */}
            <rect x="0" y="475" width="778" height="38" fill={isNight ? '#15191e' : '#dadce0'} />
            {/* Road surface */}
            <rect x="0" y="477" width="778" height="34" fill={isNight ? '#282f3a' : '#ffffff'} />
            {/* Yellow center line */}
            <line x1="0" y1="494" x2="778" y2="494" stroke="#fbbc04" strokeWidth="2.5" strokeDasharray="14 10" />

            {/* Zebra Crosswalk in front of Main Entrance */}
            {[478, 484, 490, 496, 502, 508].map((y) => (
              <rect key={`cw-in-${y}`} x="278" y={y} width="32" height="3" fill={isNight ? '#384252' : '#f1f3f4'} />
            ))}

            {/* Zebra Crosswalk in front of Calle 2 (Blocks N, S, O) */}
            {[478, 484, 490, 496, 502, 508].map((y) => (
              <rect key={`cw-nso-${y}`} x="395" y={y} width="28" height="3" fill={isNight ? '#384252' : '#f1f3f4'} />
            ))}

            {/* Street Labels */}
            <text x="50" y="497" fill={isNight ? '#9aa0a6' : '#5f6368'} fontSize="9" fontWeight="700">
              ◀ Hacia Bloque M
            </text>
            <text x="525" y="497" fill={isNight ? '#9aa0a6' : '#5f6368'} fontSize="9.5" fontWeight="700" letterSpacing="0.05em">
              AVENIDA 14 DE SEPTIEMBRE (OBRAJES)
            </text>
            <text x="730" y="497" fill={isNight ? '#9aa0a6' : '#5f6368'} fontSize="8.5" fontWeight="600" textAnchor="end">
              Depto. Educación ▶
            </text>

            {/* Public Bus Stop Badge */}
            <g transform="translate(185, 494)">
              <circle cx="0" cy="0" r="8" fill="#1a73e8" />
              <text x="0" y="3" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                🚌
              </text>
            </g>
          </g>

          {/* 4. Calle 2 and Calle 3 (Vertical Streets South) */}
          <g id="secondary-streets">
            {/* Calle 2 */}
            <rect x="362" y="513" width="22" height="136" fill={isNight ? '#282f3a' : '#ffffff'} stroke={isNight ? '#1e242c' : '#dadce0'} strokeWidth="1" />
            <text x="373" y="585" fill={isNight ? '#80868b' : '#70757a'} fontSize="8" fontWeight="600" transform="rotate(-90, 373, 585)">
              CALLE 2
            </text>

            {/* Calle 3 (South) */}
            <rect x="560" y="513" width="22" height="136" fill={isNight ? '#282f3a' : '#ffffff'} stroke={isNight ? '#1e242c' : '#dadce0'} strokeWidth="1" />
            <text x="571" y="585" fill={isNight ? '#80868b' : '#70757a'} fontSize="8" fontWeight="600" transform="rotate(-90, 571, 585)">
              CALLE 3
            </text>

            {/* Calle 3 (North along east perimeter) */}
            <line x1="645" y1="220" x2="645" y2="475" stroke={isNight ? '#1a2027' : '#dadce0'} strokeWidth="18" />
            <line x1="645" y1="220" x2="645" y2="475" stroke={isNight ? '#282f3a' : '#ffffff'} strokeWidth="14" />
            <text x="653" y="350" fill={isNight ? '#80868b' : '#70757a'} fontSize="8" fontWeight="600" transform="rotate(90, 653, 350)">
              CALLE 3
            </text>
          </g>

          {/* 5. Plazas: El Atrio & El Ágora (Matching the Real Layout) */}
          <g id="campus-plazas">
            {/* El Atrio (Hexagonal paver plaza at the entrance) */}
            <polygon
              points="245,472 335,472 335,432 250,432"
              fill="url(#atrio-pavers)"
              stroke={isNight ? '#333b47' : '#dcd5c9'}
              strokeWidth="1.2"
            />
            {/* Semicircular entrance steps leading into Bloque K */}
            <path
              d="M 268,435 Q 295,445 322,435"
              fill="none"
              stroke={isNight ? '#475569' : '#b0a89a'}
              strokeWidth="2"
            />
            <path
              d="M 272,431 Q 295,439 318,431"
              fill="none"
              stroke={isNight ? '#475569' : '#b0a89a'}
              strokeWidth="2"
            />
            <text x="290" y="458" fill={isNight ? '#94a3b8' : '#6b7280'} fontSize="9" fontWeight="bold" textAnchor="middle">
              ATRIO
            </text>

            {/* El Ágora (The great open plaza with hexagon seat clusters) */}
            <polygon
              points="240,240 375,145 440,215 315,315"
              fill="url(#agora-hex-pattern)"
              stroke={isNight ? '#333b47' : '#ded8cd'}
              strokeWidth="1.2"
            />
            <text x="350" y="215" fill={isNight ? '#cbd5e1' : '#57534e'} fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="0.08em">
              ÁGORA
            </text>

            {/* Hexagonal table clusters in El Ágora */}
            {[
              { x: 320, y: 190 }, { x: 335, y: 180 }, { x: 350, y: 190 },
              { x: 365, y: 180 }, { x: 380, y: 190 }, { x: 395, y: 180 },
              { x: 300, y: 240 }, { x: 315, y: 230 }, { x: 330, y: 240 },
              { x: 345, y: 230 }, { x: 360, y: 240 }
            ].map((hex, i) => (
              <polygon
                key={`hex-${i}`}
                points={`${hex.x},${hex.y - 4} ${hex.x + 3.5},${hex.y - 2} ${hex.x + 3.5},${hex.y + 2} ${hex.x},${hex.y + 4} ${hex.x - 3.5},${hex.y + 2} ${hex.x - 3.5},${hex.y - 2}`}
                fill={isNight ? '#3b4352' : '#ffffff'}
                stroke={isNight ? '#4b5563' : '#cbd5e1'}
                strokeWidth="0.8"
              />
            ))}
          </g>

          {/* 6. Central Gardens, Water Fountains & Capilla San Pablo */}
          <g id="campus-gardens-fountains">
            {/* Tiered Central Parkway Garden */}
            <path
              d="M 345,430 Q 380,360 415,310 Q 480,240 525,230 Q 560,250 565,370 Q 510,430 435,465 Z"
              fill={isNight ? '#1e2c24' : '#cce8c7'}
              stroke={isNight ? '#263a2e' : '#b2dbaa'}
              strokeWidth="1.5"
            />

            {/* Southeast Garden (around Bloque L) */}
            <rect x="420" y="415" width="220" height="50" rx="8" fill={isNight ? '#1e2c24' : '#cce8c7'} />

            {/* Circular Blue Water Fountains from official map */}
            {[
              { cx: 384, cy: 340, r: 8, label: 'Fuente Central' },
              { cx: 480, cy: 215, r: 7, label: 'Fuente H' },
              { cx: 544, cy: 184, r: 7, label: 'Fuente F' },
              { cx: 590, cy: 340, r: 7.5, label: 'Fuente Biblioteca' },
              { cx: 595, cy: 400, r: 6, label: 'Fuente Paraninfo' }
            ].map((fnt, idx) => (
              <g key={`fnt-${idx}`}>
                <circle cx={fnt.cx} cy={fnt.cy} r={fnt.r + 2} fill={isNight ? '#1e3a5f' : '#e0f2fe'} />
                <circle cx={fnt.cx} cy={fnt.cy} r={fnt.r} fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                <circle cx={fnt.cx} cy={fnt.cy} r={fnt.r / 2} fill="#ffffff" opacity="0.75" />
              </g>
            ))}

            {/* Stylized Garden Tree Canopies */}
            {[
              { cx: 395, cy: 375, r: 9 }, { cx: 415, cy: 390, r: 11 }, { cx: 435, cy: 370, r: 10 },
              { cx: 475, cy: 310, r: 11 }, { cx: 495, cy: 290, r: 9 },  { cx: 515, cy: 275, r: 10 },
              { cx: 550, cy: 350, r: 9 },  { cx: 565, cy: 380, r: 12 }, { cx: 625, cy: 370, r: 11 },
              { cx: 460, cy: 440, r: 10 }, { cx: 495, cy: 445, r: 12 }, { cx: 535, cy: 440, r: 11 },
              { cx: 185, cy: 210, r: 10 }, { cx: 165, cy: 330, r: 11 }
            ].map((tree, i) => (
              <circle
                key={`tree-${i}`}
                cx={tree.cx}
                cy={tree.cy}
                r={tree.r}
                fill={isNight ? '#2e4334' : '#9cd495'}
                stroke={isNight ? '#3d5845' : '#7dbf75'}
                strokeWidth="1"
                opacity="0.85"
              />
            ))}
          </g>

          {/* 7. Real Walkway Network (Caminerías) */}
          <g id="pedestrian-walkways">
            {GRAPH_EDGES.map(([u, v], idx) => {
              const nodeU = GRAPH_NODES[u];
              const nodeV = GRAPH_NODES[v];
              if (!nodeU || !nodeV) return null;
              return (
                <g key={`edge-${idx}`}>
                  {/* Outer edge border */}
                  <line
                    x1={nodeU.x}
                    y1={nodeU.y}
                    x2={nodeV.x}
                    y2={nodeV.y}
                    stroke={isNight ? '#2d3748' : '#ded8cd'}
                    strokeWidth="8.5"
                    strokeLinecap="round"
                  />
                  {/* Inner stone walkway surface */}
                  <line
                    x1={nodeU.x}
                    y1={nodeU.y}
                    x2={nodeV.x}
                    y2={nodeV.y}
                    stroke={isNight ? '#374151' : '#faf8f5'}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>

          {/* 8. Active Route Line (Google Maps Vibrant Blue) */}
          {activeRoutePoints && (
            <g id="active-navigation-route">
              {/* Outer soft blue casing */}
              <polyline
                points={activeRoutePoints}
                fill="none"
                stroke="#1a73e8"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
                filter="url(#vector-route-glow)"
              />
              {/* Solid blue route line */}
              <polyline
                points={activeRoutePoints}
                fill="none"
                stroke="#1a73e8"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated dashed white chevron dots */}
              <polyline
                points={activeRoutePoints}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 8"
                className="animate-route-dash"
              />
            </g>
          )}

          {/* 9. REAL ARCHITECTURAL BUILDINGS DRAWN 100% IN VECTOR SVG */}
          <g id="vector-buildings">
            {/* Bloque K: Semicircular stepped entrance & wings */}
            <g
              onClick={() => onSelectBuilding('bloque_k')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_k' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              {/* 3D Extrusion */}
              <polygon points="255,424 280,399 320,399 345,424 335,439 265,439" fill="#0369a1" />
              {/* Roof */}
              <polygon
                points="255,420 280,395 320,395 345,420 335,435 265,435"
                fill={selectedBuildingId === 'bloque_k' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_k' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_k' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque J: Rectangular security block */}
            <g
              onClick={() => onSelectBuilding('bloque_j')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_j' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="215" y="379" width="40" height="34" rx="4" fill="#0369a1" />
              <rect
                x="215"
                y="375"
                width="40"
                height="34"
                rx="4"
                fill={selectedBuildingId === 'bloque_j' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_j' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_j' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque D: Large western angular block */}
            <g
              onClick={() => onSelectBuilding('bloque_d')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_d' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="152,374 162,264 207,224 247,279 212,324 202,384" fill="#0369a1" />
              <polygon
                points="152,370 162,260 207,220 247,275 212,320 202,380"
                fill={selectedBuildingId === 'bloque_d' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_d' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_d' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque G1: Southwest wing of G */}
            <g
              onClick={() => onSelectBuilding('bloque_g1')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_g1' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="232,354 272,329 302,359 262,384" fill="#0369a1" />
              <polygon
                points="232,350 272,325 302,355 262,380"
                fill={selectedBuildingId === 'bloque_g1' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_g1' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_g1' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque G2: Central diagonal block flanking the Ágora */}
            <g
              onClick={() => onSelectBuilding('bloque_g2')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_g2' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="295,319 415,239 448,274 328,354" fill="#0369a1" />
              <polygon
                points="295,315 415,235 448,270 328,350"
                fill={selectedBuildingId === 'bloque_g2' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_g2' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_g2' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque A: Dominant polygonal Engineering block */}
            <g
              onClick={() => onSelectBuilding('bloque_a')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_a' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="218,179 253,89 353,49 398,124 263,214" fill="#0369a1" />
              <polygon
                points="218,175 253,85 353,45 398,120 263,210"
                fill={selectedBuildingId === 'bloque_a' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_a' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_a' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque B: Angular block north of Ágora */}
            <g
              onClick={() => onSelectBuilding('bloque_b')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_b' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="385,64 415,54 435,79 405,99" fill="#0369a1" />
              <polygon
                points="385,60 415,50 435,75 405,95"
                fill={selectedBuildingId === 'bloque_b' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_b' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_b' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque C: Long horizontal block on north edge */}
            <g
              onClick={() => onSelectBuilding('bloque_c')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_c' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="435,49 595,49 600,109 540,109 540,94 440,94" fill="#0369a1" />
              <polygon
                points="435,45 595,45 600,105 540,105 540,90 440,90"
                fill={selectedBuildingId === 'bloque_c' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_c' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_c' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque F: ePC and Posgrado block */}
            <g
              onClick={() => onSelectBuilding('bloque_f')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_f' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="475,124 535,119 540,134 610,134 615,214 560,214 560,184 480,184" fill="#0369a1" />
              <polygon
                points="475,120 535,115 540,130 610,130 615,210 560,210 560,180 480,180"
                fill={selectedBuildingId === 'bloque_f' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_f' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_f' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque H: Café and Bienestar Estudiantil */}
            <g
              onClick={() => onSelectBuilding('bloque_h')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_h' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <polygon points="425,254 465,229 485,254 445,279" fill="#0369a1" />
              <polygon
                points="425,250 465,225 485,250 445,275"
                fill={selectedBuildingId === 'bloque_h' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_h' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_h' ? 2.5 : 1.2}
              />
            </g>

            {/* Capilla San Pablo */}
            <g
              onClick={() => onSelectBuilding('capilla')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'capilla' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="446" y="354" width="40" height="34" rx="5" fill="#6b21a8" />
              <rect
                x="446"
                y="350"
                width="40"
                height="34"
                rx="5"
                fill={selectedBuildingId === 'capilla' ? '#eff6ff' : '#7c3aed'}
                stroke={selectedBuildingId === 'capilla' ? '#9333ea' : '#6b21a8'}
                strokeWidth={selectedBuildingId === 'capilla' ? 2.5 : 1.2}
              />
              {/* Church cross on roof */}
              <line x1="466" y1="358" x2="466" y2="372" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="460" y1="362" x2="472" y2="362" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Bloque I: Biblioteca Central UCB San Pablo */}
            <g
              onClick={() => onSelectBuilding('bloque_i')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_i' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              {/* Brown rooftop terrace section from official plan */}
              <polygon points="535,234 600,229 630,264 610,334 545,329" fill="#0369a1" />
              <polygon
                points="535,230 600,225 630,260 610,330 545,325"
                fill={selectedBuildingId === 'bloque_i' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_i' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_i' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque L: Paraninfo Universitario */}
            <g
              onClick={() => onSelectBuilding('bloque_l')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_l' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="565" y="414" width="60" height="52" rx="6" fill="#0369a1" />
              <rect
                x="565"
                y="410"
                width="60"
                height="52"
                rx="6"
                fill={selectedBuildingId === 'bloque_l' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_l' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_l' ? 2.5 : 1.2}
              />
            </g>

            {/* EXTERNAL BLOCKS (Across Av. 14 de Septiembre) */}
            {/* Bloque T: Arquitectura */}
            <g
              onClick={() => onSelectBuilding('bloque_t')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_t' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="210" y="534" width="48" height="60" rx="4" fill="#0369a1" />
              <rect
                x="210"
                y="530"
                width="48"
                height="60"
                rx="4"
                fill={selectedBuildingId === 'bloque_t' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_t' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_t' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque P: FabLab & Maquetas */}
            <g
              onClick={() => onSelectBuilding('bloque_p')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_p' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="218" y="608" width="40" height="38" rx="4" fill="#0369a1" />
              <rect
                x="218"
                y="604"
                width="40"
                height="38"
                rx="4"
                fill={selectedBuildingId === 'bloque_p' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_p' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_p' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque N: Idiomas */}
            <g
              onClick={() => onSelectBuilding('bloque_n')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_n' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="388" y="534" width="34" height="46" rx="4" fill="#0369a1" />
              <rect
                x="388"
                y="530"
                width="34"
                height="46"
                rx="4"
                fill={selectedBuildingId === 'bloque_n' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_n' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_n' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque S: Clínica Odontológica */}
            <g
              onClick={() => onSelectBuilding('bloque_s')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_s' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="424" y="534" width="36" height="65" rx="4" fill="#0369a1" />
              <rect
                x="424"
                y="530"
                width="36"
                height="65"
                rx="4"
                fill={selectedBuildingId === 'bloque_s' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_s' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_s' ? 2.5 : 1.2}
              />
            </g>

            {/* Bloque O: Investigaciones */}
            <g
              onClick={() => onSelectBuilding('bloque_o')}
              className="cursor-pointer group"
              filter={selectedBuildingId === 'bloque_o' ? 'url(#vector-active-glow)' : 'url(#vector-building-shadow)'}
            >
              <rect x="462" y="534" width="46" height="110" rx="4" fill="#0369a1" />
              <rect
                x="462"
                y="530"
                width="46"
                height="110"
                rx="4"
                fill={selectedBuildingId === 'bloque_o' ? '#eff6ff' : '#0284c7'}
                stroke={selectedBuildingId === 'bloque_o' ? '#2563eb' : '#0369a1'}
                strokeWidth={selectedBuildingId === 'bloque_o' ? 2.5 : 1.2}
              />
            </g>
          </g>

          {/* 10. GOOGLE MAPS POI BADGES, LETTER CODES & LABELS */}
          <g id="google-maps-pois">
            {Object.values(LOCATIONS).map((loc) => {
              const isSelected = selectedBuildingId === loc.id;
              const isCategoryMatch = !filterCategory || loc.category === filterCategory;
              const hasHighlightedRoom =
                highlightedRoomCode &&
                loc.rooms.some((r) => r.code.toLowerCase() === highlightedRoomCode.toLowerCase());
              const isDimmed = filterCategory && !isCategoryMatch && !isSelected;

              return (
                <g
                  key={`poi-${loc.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBuilding(loc.id);
                  }}
                  className="cursor-pointer group"
                  opacity={isDimmed ? 0.25 : 1}
                >
                  {/* Google Maps Teardrop POI Pin with Letter Code */}
                  <g
                    transform={`translate(${loc.x}, ${loc.y})`}
                    className="transition-transform group-hover:scale-115"
                  >
                    {/* Circle badge */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '14' : '11'}
                      fill={loc.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Icon */}
                    <foreignObject x="-7" y="-7" width="14" height="14" className="pointer-events-none">
                      <div className="w-full h-full flex items-center justify-center text-white text-[10px]">
                        {renderBuildingIcon(loc.iconName)}
                      </div>
                    </foreignObject>

                    {/* Prominent White Letter Box matching the official blueprint */}
                    <rect
                      x="7"
                      y="-12"
                      width={loc.code.length > 2 ? 26 : 16}
                      height="13"
                      rx="3"
                      fill="#ffffff"
                      stroke={loc.color}
                      strokeWidth="1"
                    />
                    <text
                      x={loc.code.length > 2 ? 20 : 15}
                      y="-3"
                      fill="#0f172a"
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {loc.code}
                    </text>
                  </g>

                  {/* Clean Building Label */}
                  <g transform={`translate(${loc.x}, ${loc.y + 16})`}>
                    <rect
                      x={-(loc.shortName.length * 2.8 + 6)}
                      y="-1"
                      width={loc.shortName.length * 5.6 + 12}
                      height="13"
                      rx="3"
                      fill={isNight ? 'rgba(30, 41, 59, 0.92)' : 'rgba(255, 255, 255, 0.92)'}
                      stroke={isNight ? '#334155' : '#cbd5e1'}
                      strokeWidth="0.5"
                    />
                    <text
                      x="0"
                      y="9"
                      fill={isNight ? '#f1f5f9' : '#1e293b'}
                      fontSize="8"
                      fontWeight="700"
                      textAnchor="middle"
                      className="group-hover:fill-blue-600 font-sans"
                    >
                      {loc.shortName}
                    </text>
                  </g>

                  {/* Accessibility marker */}
                  {accessibilityOnly && (
                    <g transform={`translate(${loc.x - 18}, ${loc.y - 12})`}>
                      <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#0284c7" />
                      <text x="0" y="3" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                        ♿
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* 11. ROUTE ORIGIN & DESTINATION PINS */}
          {activePath.length > 0 && (
            <g id="route-markers">
              {/* Origin Marker (Green Circle with 'A') */}
              {GRAPH_NODES[activePath[0]] && (
                <g transform={`translate(${GRAPH_NODES[activePath[0]].x}, ${GRAPH_NODES[activePath[0]].y})`}>
                  <circle cx="0" cy="0" r="16" fill="#10b981" opacity="0.3" className="animate-pulse-ring" />
                  <circle cx="0" cy="0" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    A
                  </text>
                </g>
              )}

              {/* Destination Marker (Classic Google Maps Red Teardrop Pin) */}
              {GRAPH_NODES[activePath[activePath.length - 1]] && (
                <g
                  transform={`translate(${GRAPH_NODES[activePath[activePath.length - 1]].x}, ${
                    GRAPH_NODES[activePath[activePath.length - 1]].y - 18
                  })`}
                >
                  <circle cx="0" cy="18" r="14" fill="#ea4335" opacity="0.35" className="animate-pulse-ring" />
                  <path
                    d="M 0,0 C -9,-14 -12,-22 -12,-30 C -12,-40 -5,-47 0,-47 C 5,-47 12,-40 12,-30 C 12,-22 9,-14 0,0 Z"
                    fill="#ea4335"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="0" cy="-30" r="5" fill="#ffffff" />
                  <circle cx="0" cy="-30" r="2.5" fill="#b91c1c" />
                </g>
              )}
            </g>
          )}

          {/* 12. REAL-TIME PEDESTRIAN WALKER SIMULATOR */}
          {currentWalkerNode && isSimulatingWalk && (
            <g transform={`translate(${currentWalkerNode.x}, ${currentWalkerNode.y})`}>
              <circle cx="0" cy="0" r="18" fill="#2563eb" opacity="0.4" className="animate-pulse-ring" />
              <circle cx="0" cy="0" r="11" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
              <foreignObject x="-6" y="-6" width="12" height="12">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <Footprints className="w-3 h-3 text-amber-300" />
                </div>
              </foreignObject>
            </g>
          )}
        </svg>
      </div>

      {/* Floating Mode Switcher & Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {/* Vector Mode Switcher (Google Maps / Didáctico 3D / Nocturno) */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/90 p-1 flex items-center gap-1">
          <button
            onClick={() => setMapLayer('google')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              mapLayer === 'google'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Google Maps
          </button>
          <button
            onClick={() => setMapLayer('didactic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              mapLayer === 'didactic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Didáctico 3D
          </button>
          <button
            onClick={() => setMapLayer('night')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              mapLayer === 'night'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Nocturno
          </button>
        </div>

        {/* Zoom & Compass Controls */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/90 flex flex-col overflow-hidden divide-y divide-slate-100">
          <button
            onClick={() => setZoom((z) => Math.min(3.2, z * 1.25))}
            aria-label="Acercar mapa"
            className="p-2.5 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.65, z * 0.8))}
            aria-label="Alejar mapa"
            className="p-2.5 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={centerCampus}
            aria-label="Centrar campus UCB"
            title="Centrar Campus"
            className="p-2.5 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <Crosshair className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Floating Simulation Bar when a Route is Active */}
      {activePath.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full shadow-lg px-4 py-2 flex items-center gap-3 z-20">
          <button
            onClick={onToggleSimulateWalk}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-full transition-all ${
              isSimulatingWalk
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatingWalk ? 'fill-current' : ''}`} />
            <span>{isSimulatingWalk ? 'Pausar Simulación' : 'Simular Recorrido'}</span>
          </button>

          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Paso {walkingNodeIndex + 1}/{activePath.length}
          </span>

          <button
            onClick={onResetRoute}
            title="Reiniciar ruta"
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors rounded-full"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Left Scale & Attribution */}
      <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[10px] text-slate-500 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-200/80 pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1 bg-slate-700 border-x border-slate-900" />
          <span className="font-mono tabular-nums font-semibold">50 m</span>
        </div>
        <span aria-hidden="true">·</span>
        <span>Mapa Vectorial UCB Campus Obrajes · Av. 14 de Septiembre</span>
      </div>
    </div>
  );
};
