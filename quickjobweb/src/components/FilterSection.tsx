// components/FilterSection.tsx
"use client";
import { useState } from "react";
import SriLankaMap from "./SriLankaMap";

interface FilterSectionProps {
  onFilter: (filters: {
    search: string;
    skill: string;
    location: string;
  }) => void;
}

export default function FilterSection({ onFilter }: FilterSectionProps) {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");

  const handleTownSelect = (town: string) => {
    setLocation(town);
    onFilter({ search, skill, location: town });
  };

  return (
    <div className="bg-gray-100 p-4 flex flex-col space-y-4 shadow-md">
      {/* Search + Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search ads..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onFilter({ search: e.target.value, skill, location });
          }}
          className="flex-1 border rounded-md p-2"
        />

        {/* Skill Dropdown */}
        <select
          value={skill}
          onChange={(e) => {
            setSkill(e.target.value);
            onFilter({ search, skill: e.target.value, location });
          }}
          className="border rounded-md p-2"
        >
          <option value="">All Skills</option>
          <option value="plumber">Plumber</option>
          <option value="mechanic">Mechanic</option>
          <option value="carpenter">Carpenter</option>
        </select>
      </div>

      {/* Map */}
      <SriLankaMap onTownSelect={handleTownSelect} />
    </div>
  );
}
