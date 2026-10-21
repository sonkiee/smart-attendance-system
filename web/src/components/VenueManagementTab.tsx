import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Navigation,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { api, type VenueRecord } from "../services/api";

interface VenueManagementTabProps {
  venues: VenueRecord[];
  onRefresh: () => void;
}

export const VenueManagementTab: React.FC<VenueManagementTabProps> = ({
  venues,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState<number | string>(10.4904);
  const [longitude, setLongitude] = useState<number | string>(7.4512);
  const [radiusMeters, setRadiusMeters] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || latitude === "" || longitude === "") return;

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.createVenue({
        name: name.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        radiusMeters: Number(radiusMeters),
      });
      setActionMessage({
        type: "success",
        text: `Campus venue "${name}" registered with ${radiusMeters}m geofence radius.`,
      });
      setShowAddModal(false);
      setName("");
      setLatitude(10.4904);
      setLongitude(7.4512);
      setRadiusMeters(50);
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to create venue." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Venue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Venues & Geofences</h1>
          <p className="text-sm text-gray-500">
            Define institutional physical coordinates and circular boundary radii used by mobile clients.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-[#004ac6] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus Venue</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-[#006c4a] border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006c4a]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#006c4a]">
                  {venue.radiusMeters}m Radius
                </span>
              </div>

              <h3 className="font-bold text-gray-900 mt-3 text-base leading-snug">
                {venue.name}
              </h3>

              <div className="mt-3.5 space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Latitude:</span>
                  <span className="font-bold text-gray-800">{venue.latitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longitude:</span>
                  <span className="font-bold text-gray-800">{venue.longitude}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#006c4a]" />
                Enforced by Haversine
              </span>
              <a
                href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#004ac6] font-semibold hover:underline flex items-center"
              >
                <span>View Map</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Venue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006c4a] flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Add Campus Venue</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVenue} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lecture Theatre 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Allowed Geofence Radius (Meters) *
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  required
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Students within this radius from the coordinates will be approved during biometric clock-in.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#004ac6] text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  {isSubmitting ? "Registering..." : "Save Venue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
