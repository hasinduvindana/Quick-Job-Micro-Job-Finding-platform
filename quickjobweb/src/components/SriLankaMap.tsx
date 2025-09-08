// components/SriLankaMap.tsx
"use client";
import { useState } from "react";

interface SriLankaMapProps {
  onTownSelect: (town: string) => void;
}

const townsByDistrict: Record<string, string[]> = {
  Colombo: ["Colombo", "Dehiwala", "Moratuwa", "Maharagama"],
  Kandy: ["Kandy", "Peradeniya", "Katugastota", "Gampola"],
  Galle: ["Galle", "Hikkaduwa", "Unawatuna", "Baddegama"],
};

export default function SriLankaMap({ onTownSelect }: SriLankaMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  return (
    <div className="border p-4 rounded-md bg-white shadow-md">
      <h3 className="font-bold mb-2">Select Location</h3>

      {/* Districts */}
      <div className="flex space-x-4">
        {Object.keys(townsByDistrict).map((district) => (
          <button
            key={district}
            onClick={() => setSelectedDistrict(district)}
            className={`px-3 py-1 rounded-md ${
              selectedDistrict === district ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {district}
          </button>
        ))}
      </div>

      {/* Towns */}
      {selectedDistrict && (
        <div className="mt-3">
          <h4 className="font-semibold">{selectedDistrict} Towns</h4>
          <ul className="list-disc ml-6">
            {townsByDistrict[selectedDistrict].sort().map((town) => (
              <li
                key={town}
                onClick={() => onTownSelect(town)}
                className="cursor-pointer hover:text-blue-600"
              >
                {town}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
