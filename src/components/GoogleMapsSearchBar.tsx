/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { LOCATIONS, RoomInfo, BuildingLocation } from '../data/campusData';
import {
  Search,
  X,
  Navigation,
  MapPin,
  Sparkles,
  Accessibility,
  Coffee,
  BookOpen,
  Cpu,
  GraduationCap
} from 'lucide-react';

interface GoogleMapsSearchBarProps {
  onSelectBuilding: (buildingId: string) => void;
  onNavigateTo: (buildingId: string, roomCode?: string) => void;
  onOpenDirectory: () => void;
  onOpenTour: () => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  accessibilityOnly: boolean;
  setAccessibilityOnly: (val: boolean) => void;
}

export const GoogleMapsSearchBar: React.FC<GoogleMapsSearchBarProps> = ({
  onSelectBuilding,
  onNavigateTo,
  onOpenDirectory,
  onOpenTour,
  filterCategory,
  setFilterCategory,
  accessibilityOnly,
  setAccessibilityOnly,
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute search suggestions
  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: {
      type: 'building' | 'room';
      title: string;
      subtitle: string;
      buildingId: string;
      roomCode?: string;
    }[] = [];

    // Search buildings
    Object.values(LOCATIONS).forEach((b) => {
      if (
        b.code.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.shortName.toLowerCase().includes(q) ||
        b.details.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'building',
          title: `[${b.code}] ${b.name}`,
          subtitle: `${b.floors} · ${b.accessibility.slice(0, 50)}...`,
          buildingId: b.id,
        });
      }
    });

    // Search rooms
    Object.values(LOCATIONS).forEach((b) => {
      b.rooms.forEach((r) => {
        if (
          r.code.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.features?.some((f) => f.toLowerCase().includes(q))
        ) {
          results.push({
            type: 'room',
            title: `${r.code} · ${r.title}`,
            subtitle: `${b.shortName} (${r.floor})`,
            buildingId: b.id,
            roomCode: r.code,
          });
        }
      });
    });

    return results.slice(0, 6);
  }, [query]);

  return (
    <div ref={containerRef} className="absolute top-4 left-4 z-20 w-96 max-w-[calc(100vw-6rem)]">
      {/* Google Maps Search Bar Box */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 flex items-center px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500">
        <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center shrink-0 mr-2.5">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Buscar aula, bloque, cafetería o trámite..."
          className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 bg-transparent outline-none"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setIsDropdownOpen(false);
            }}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        )}
      </div>

      {/* Instant Search Suggestions Dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {suggestions.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.type === 'room' && item.roomCode) {
                  onNavigateTo(item.buildingId, item.roomCode);
                } else {
                  onSelectBuilding(item.buildingId);
                }
                setIsDropdownOpen(false);
                setQuery(item.title);
              }}
              className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center justify-between transition-colors text-xs group"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 flex items-center justify-center shrink-0">
                  {item.type === 'room' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-blue-600 shrink-0 flex items-center gap-1 text-[11px] font-semibold">
                <Navigation className="w-3 h-3 text-amber-400" />
                <span>Ruta</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Category Filter Chips Underneath */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <button
          onClick={() => setFilterCategory(filterCategory === 'academico' ? null : 'academico')}
          className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap shadow-xs transition-all flex items-center gap-1 shrink-0 ${
            filterCategory === 'academico'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-3 h-3 text-blue-600" />
          <span>Aulas</span>
        </button>

        <button
          onClick={() => setFilterCategory(filterCategory === 'admin' ? null : 'admin')}
          className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap shadow-xs transition-all flex items-center gap-1 shrink-0 ${
            filterCategory === 'admin'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <Coffee className="w-3 h-3 text-amber-600" />
          <span>Kardex & Café</span>
        </button>

        <button
          onClick={() => setFilterCategory(filterCategory === 'cultural' ? null : 'cultural')}
          className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap shadow-xs transition-all flex items-center gap-1 shrink-0 ${
            filterCategory === 'cultural'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3 h-3 text-purple-600" />
          <span>Cultura & Deportes</span>
        </button>

        <button
          onClick={() => setAccessibilityOnly(!accessibilityOnly)}
          className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap shadow-xs transition-all flex items-center gap-1 shrink-0 ${
            accessibilityOnly
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <Accessibility className="w-3 h-3 text-cyan-600" />
          <span>Accesibilidad</span>
        </button>
      </div>
    </div>
  );
};
