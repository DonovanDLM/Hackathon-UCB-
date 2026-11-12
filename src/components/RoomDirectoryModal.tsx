/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LOCATIONS, RoomInfo, BuildingLocation } from '../data/campusData';
import {
  Search,
  X,
  Navigation,
  Compass,
  Filter,
  Users,
  ChevronRight,
  BookOpen,
  Cpu,
  Coffee,
  Building
} from 'lucide-react';

interface RoomDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (buildingId: string, roomCode: string) => void;
}

interface FlattenedRoom {
  room: RoomInfo;
  building: BuildingLocation;
}

export const RoomDirectoryModal: React.FC<RoomDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');

  // Collect all rooms across all buildings
  const allRooms: FlattenedRoom[] = useMemo(() => {
    const list: FlattenedRoom[] = [];
    Object.values(LOCATIONS).forEach((building) => {
      building.rooms.forEach((room) => {
        list.push({ room, building });
      });
    });
    return list;
  }, []);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return allRooms.filter(({ room, building }) => {
      // Type filter
      if (selectedType !== 'all' && room.type !== selectedType) return false;
      // Building filter
      if (selectedBuildingId !== 'all' && building.id !== selectedBuildingId) return false;
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = room.code.toLowerCase().includes(q);
        const matchesTitle = room.title.toLowerCase().includes(q);
        const matchesBuilding = building.name.toLowerCase().includes(q);
        const matchesFeatures = room.features?.some((f) => f.toLowerCase().includes(q));
        return matchesCode || matchesTitle || matchesBuilding || matchesFeatures;
      }
      return true;
    });
  }, [allRooms, searchQuery, selectedType, selectedBuildingId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Directorio General de Aulas & Laboratorios</h2>
              <p className="text-xs text-slate-500">Encuentra cualquier espacio en el Campus Obrajes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
            aria-label="Cerrar directorio de aulas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe el código de aula (ej. A-101, B-201) o tema (Robótica, Kardex)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'Todos los Espacios' },
              { id: 'aula', label: 'Aulas Teóricas' },
              { id: 'laboratorio', label: 'Laboratorios' },
              { id: 'servicio', label: 'Servicios & Cafetería' },
              { id: 'oficina', label: 'Kardex & Trámites' },
              { id: 'auditorio', label: 'Auditorios' },
              { id: 'taller', label: 'Talleres' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  selectedType === t.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Building Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] uppercase font-bold shrink-0">Filtrar por edificio:</span>
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 outline-none"
            >
              <option value="all">Todos los Edificios</option>
              {Object.values(LOCATIONS).map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.code}] {b.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            {filteredRooms.length} {filteredRooms.length === 1 ? 'espacio encontrado' : 'espacios encontrados'}
          </span>
          {searchQuery && (
            <span className="text-blue-600 font-medium">Búsqueda: "{searchQuery}"</span>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(({ room, building }) => (
              <div
                key={`${building.id}-${room.code}`}
                onClick={() => onSelectRoom(building.id, room.code)}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {room.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {room.title}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">[{building.code}] {building.shortName}</span>
                    <span>·</span>
                    <span>{room.floor}</span>
                    {room.capacity && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{room.capacity} pers.</span>
                        </span>
                      </>
                    )}
                    {room.features && room.features.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-slate-400">{room.features.slice(0, 2).join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1.5 rounded-lg transition-colors shrink-0">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cómo llegar</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500">
              <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium">No se encontraron aulas con los criterios seleccionados.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedBuildingId('all');
                }}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
