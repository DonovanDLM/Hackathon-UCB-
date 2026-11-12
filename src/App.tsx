/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LOCATIONS,
  findShortestPath,
  generateTurnInstructions,
  BuildingLocation,
  NavigationStep
} from './data/campusData';
import { CampusHeader } from './components/CampusHeader';
import { CampusMapCanvas } from './components/CampusMapCanvas';
import { GoogleMapsSearchBar } from './components/GoogleMapsSearchBar';
import { DirectionsPanel } from './components/DirectionsPanel';
import { BuildingModal } from './components/BuildingModal';
import { RoomDirectoryModal } from './components/RoomDirectoryModal';
import { TourModal } from './components/TourModal';

export default function App() {
  // Navigation & View states
  const [activeView, setActiveView] = useState<'map' | 'directory' | 'tour'>('map');
  const [mapLayer, setMapLayer] = useState<'google' | 'didactic' | 'night'>('google');

  // Building inspection
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);

  // Route Planning & Directions
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [originId, setOriginId] = useState<string>('ingreso');
  const [destinationId, setDestinationId] = useState<string>('bloque_i');
  const [destRoomLabel, setDestRoomLabel] = useState<string | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [accessibilityOnly, setAccessibilityOnly] = useState(false);

  // Walking simulation
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const [walkingNodeIndex, setWalkingNodeIndex] = useState<number>(0);

  // Modals
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Calculate Shortest Path via Dijkstra
  const originBuilding = LOCATIONS[originId] || LOCATIONS['ingreso'];
  const destBuilding = LOCATIONS[destinationId] || LOCATIONS['biblioteca'];

  const { path: activePath, totalPx: pathLengthPx } = useMemo(() => {
    if (!originBuilding || !destBuilding) {
      return { path: [], totalPx: 0 };
    }
    return findShortestPath(originBuilding.node, destBuilding.node);
  }, [originBuilding, destBuilding]);

  // Turn-by-turn navigation instructions
  const steps: NavigationStep[] = useMemo(() => {
    return generateTurnInstructions(activePath, originBuilding, destBuilding, destRoomLabel);
  }, [activePath, originBuilding, destBuilding, destRoomLabel]);

  // Handle Walking Simulation Interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isSimulatingWalk && activePath.length > 1) {
      timer = setInterval(() => {
        setWalkingNodeIndex((curr) => {
          if (curr >= activePath.length - 1) {
            setIsSimulatingWalk(false);
            return curr;
          }
          return curr + 1;
        });
      }, 1600);
    }
    return () => {
      if (timer !== undefined) clearInterval(timer);
    };
  }, [isSimulatingWalk, activePath]);

  // Trigger building click
  const handleSelectBuilding = useCallback((buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setIsBuildingModalOpen(true);
  }, []);

  // Trigger route navigation to specific building or classroom
  const handleNavigateTo = useCallback((buildingId: string, roomCode?: string) => {
    setDestinationId(buildingId);
    if (roomCode) {
      setDestRoomLabel(roomCode);
    } else {
      setDestRoomLabel(null);
    }
    setSelectedBuildingId(buildingId);
    setIsDirectionsOpen(true);
    setIsBuildingModalOpen(false);
    setIsDirectoryOpen(false);
    setIsTourOpen(false);
    setActiveView('map');
    setWalkingNodeIndex(0);
  }, []);

  // Toggle walk simulation
  const handleToggleSimulateWalk = () => {
    if (walkingNodeIndex >= activePath.length - 1) {
      setWalkingNodeIndex(0);
    }
    setIsSimulatingWalk((prev) => !prev);
  };

  // Reset route
  const handleResetRoute = () => {
    setIsSimulatingWalk(false);
    setWalkingNodeIndex(0);
  };

  // Handle guided tour start
  const handleStartTourRoute = useCallback((buildingId: string, roomCode?: string) => {
    setOriginId('ingreso');
    setDestinationId(buildingId);
    if (roomCode) {
      setDestRoomLabel(roomCode);
    } else {
      setDestRoomLabel(null);
    }
    setSelectedBuildingId(buildingId);
    setIsDirectionsOpen(true);
    setIsTourOpen(false);
    setActiveView('map');
    setWalkingNodeIndex(0);
  }, []);

  // Open directory modal
  const handleOpenDirectory = () => {
    setIsDirectoryOpen(true);
  };

  // Open tour modal
  const handleOpenTour = () => {
    setIsTourOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 select-none">
      {/* Universal Top Bar */}
      <CampusHeader
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view === 'directory') setIsDirectoryOpen(true);
          if (view === 'tour') setIsTourOpen(true);
        }}
        onOpenDirections={() => setIsDirectionsOpen((prev) => !prev)}
        onOpenTour={handleOpenTour}
        isDirectionsOpen={isDirectionsOpen}
      />

      {/* Main Map Interactive Viewport */}
      <main className="relative flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Google Maps Style Search & Quick Category Filters (Top Left) */}
        {!isDirectionsOpen && (
          <GoogleMapsSearchBar
            onSelectBuilding={handleSelectBuilding}
            onNavigateTo={handleNavigateTo}
            onOpenDirectory={handleOpenDirectory}
            onOpenTour={handleOpenTour}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            accessibilityOnly={accessibilityOnly}
            setAccessibilityOnly={setAccessibilityOnly}
          />
        )}

        {/* Directions & Step-by-Step Wayfinding Panel */}
        <DirectionsPanel
          isOpen={isDirectionsOpen}
          onClose={() => setIsDirectionsOpen(false)}
          originId={originId}
          setOriginId={(id) => {
            setOriginId(id);
            setWalkingNodeIndex(0);
          }}
          destinationId={destinationId}
          setDestinationId={(id) => {
            setDestinationId(id);
            setWalkingNodeIndex(0);
          }}
          destRoomLabel={destRoomLabel}
          setDestRoomLabel={setDestRoomLabel}
          pathLengthPx={pathLengthPx}
          steps={steps}
          walkingNodeIndex={walkingNodeIndex}
          isSimulatingWalk={isSimulatingWalk}
          onToggleSimulateWalk={handleToggleSimulateWalk}
          onResetRoute={handleResetRoute}
        />

        {/* Central Google Maps Styled Campus Canvas */}
        <CampusMapCanvas
          selectedBuildingId={selectedBuildingId}
          onSelectBuilding={handleSelectBuilding}
          activePath={activePath}
          walkingNodeIndex={walkingNodeIndex}
          isSimulatingWalk={isSimulatingWalk}
          onToggleSimulateWalk={handleToggleSimulateWalk}
          onResetRoute={handleResetRoute}
          highlightedRoomCode={destRoomLabel}
          filterCategory={filterCategory}
          accessibilityOnly={accessibilityOnly}
          mapLayer={mapLayer}
          setMapLayer={setMapLayer}
        />
      </main>

      {/* Building Inspection Modal */}
      {isBuildingModalOpen && selectedBuildingId && (
        <BuildingModal
          building={LOCATIONS[selectedBuildingId] || null}
          onClose={() => setIsBuildingModalOpen(false)}
          onNavigateToBuilding={handleNavigateTo}
        />
      )}

      {/* General Room & Classroom Directory Modal */}
      <RoomDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => {
          setIsDirectoryOpen(false);
          if (activeView === 'directory') setActiveView('map');
        }}
        onSelectRoom={(buildingId, roomCode) => {
          handleNavigateTo(buildingId, roomCode);
          setIsDirectoryOpen(false);
        }}
      />

      {/* Guided Tour for Cachorros & Visitors Modal */}
      <TourModal
        isOpen={isTourOpen}
        onClose={() => {
          setIsTourOpen(false);
          if (activeView === 'tour') setActiveView('map');
        }}
        onStartTourRoute={handleStartTourRoute}
      />
    </div>
  );
}
