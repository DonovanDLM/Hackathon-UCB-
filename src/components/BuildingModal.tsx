/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BuildingLocation, RoomInfo } from '../data/campusData';
import {
  X,
  Navigation,
  Clock,
  Accessibility,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface BuildingModalProps {
  building: BuildingLocation | null;
  onClose: () => void;
  onNavigateToBuilding: (buildingId: string, roomCode?: string) => void;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({
  building,
  onClose,
  onNavigateToBuilding,
}) => {
  const [selectedFloorLevel, setSelectedFloorLevel] = useState<number>(0);

  if (!building) return null;

  // Group rooms by floor level
  const uniqueFloors = Array.from(
    new Set(building.rooms.map((r) => r.floorLevel))
  ).sort((a, b) => a - b);

  const filteredRooms = building.rooms.filter(
    (r) => r.floorLevel === selectedFloorLevel
  );

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header & Hero Image */}
        <div className="relative h-48 bg-slate-900 shrink-0">
          {building.image ? (
            <img
              src={building.image}
              alt={building.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white"
              style={{ backgroundColor: building.color }}
            >
              <span className="text-3xl font-extrabold opacity-30 tracking-widest uppercase">
                {building.shortName}
              </span>
            </div>
          )}

          {/* Scrim gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 flex items-center justify-center transition-colors"
            aria-label="Cerrar modal de edificio"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category & Title */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <span className="px-2 py-0.5 bg-white text-blue-900 rounded font-bold font-mono text-[11px] shadow-xs">
                Bloque {building.code}
              </span>
              <span>·</span>
              <span>{building.category === 'academico' ? 'Facultades & Aulas' : building.category === 'admin' ? 'Administración & Servicios' : 'Cultura & Deportes'}</span>
              <span>·</span>
              <span>{building.floors}</span>
            </div>
            <h2 className="text-xl font-bold leading-snug drop-shadow-sm">
              {building.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description & Details */}
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {building.description}
            </p>
          </div>

          {/* Metadata Cards (Hours & Accessibility) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {building.hours && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Horarios de Atención</span>
                  <span className="text-slate-600 leading-tight">{building.hours}</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
              <Accessibility className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Accesibilidad Universal</span>
                <span className="text-slate-600 leading-tight">{building.accessibility}</span>
              </div>
            </div>
          </div>

          {/* Floor-by-Floor Interactive Room Directory */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Distribución por Niveles ({building.totalFloors} Pisos)</span>
              </div>
            </div>

            {/* Floor Tabs */}
            {uniqueFloors.length > 0 && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg mb-3 overflow-x-auto">
                {uniqueFloors.map((fl) => {
                  const label = fl === 0 ? 'Planta Baja' : `Piso ${fl}`;
                  const count = building.rooms.filter((r) => r.floorLevel === fl).length;
                  return (
                    <button
                      key={fl}
                      onClick={() => setSelectedFloorLevel(fl)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                        selectedFloorLevel === fl
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Room List on Selected Floor */}
            <div className="space-y-2">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <div
                    key={room.code}
                    className="p-3 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {room.code}
                        </span>
                        <span className="font-bold text-slate-800">
                          {room.title}
                        </span>
                      </div>

                      {/* Room metadata (capacity & equipment) */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        {room.capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>{room.capacity} personas</span>
                          </span>
                        )}
                        {room.features && room.features.length > 0 && (
                          <>
                            <span>·</span>
                            <span>{room.features.join(' · ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToBuilding(building.id, room.code)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>Ir aquí</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  Aulas en este nivel en proceso de actualización.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Nodo: <span className="font-mono text-slate-700">{building.node}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => onNavigateToBuilding(building.id)}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>Cómo llegar aquí</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
