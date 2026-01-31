import React from "react";
import {
  CheckCircle,
  X,
  MapPin,
  DollarSign,
  Heart,
  Bookmark,
} from "lucide-react";
import { Therapist } from "../types";

interface ProfileModalProps {
  therapist: Therapist | null;
  onClose: () => void;
  onSave?: (therapist: Therapist) => void;
  isSaved?: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  therapist,
  onClose,
  onSave,
  isSaved = false,
}) => {
  if (!therapist) return null;

  const isLgbtqAffirming =
    therapist.clinical.lgbtq_affirming ||
    therapist.clinical.specialties.includes("LGBTQ+") ||
    therapist.identity.narrative?.toLowerCase().includes("lgbtq");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="text-6xl mr-4">
                {therapist.identity.photo || "🧑‍⚕️"}
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {therapist.identity.name}
                </h2>
                <p className="text-gray-600">
                  {therapist.identity.credentials.join(", ")}
                </p>
                {therapist.location && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {therapist.location.city}, {therapist.location.state}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Match Score Banner */}
          {therapist.matchScore && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="w-6 h-6 text-green-600 fill-current mr-3" />
                  <div>
                    <span className="text-3xl font-bold text-green-600">
                      {therapist.matchScore}% Match
                    </span>
                    <p className="text-green-800">
                      Highly compatible based on your needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">
              {therapist.identity.narrative}
            </p>
          </div>

          {/* Two Column Layout - Specialties & Modalities */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-bold mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {therapist.clinical.specialties &&
                  therapist.clinical.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-2">Modalities</h4>
              <div className="flex flex-wrap gap-2">
                {therapist.clinical.modalities &&
                  therapist.clinical.modalities.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Cultural & Identity */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h4 className="font-bold mb-3">Communities</h4>
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-2 mt-3">
                {isLgbtqAffirming && (
                  <span className="inline-block px-3 py-1 bg-purple-200 text-purple-900 rounded-full">
                    LGBTQ+ Affirming
                  </span>
                )}
                {therapist.clinical.populations &&
                  therapist.clinical.populations.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Insurance & Cost */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Cost
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {therapist.economics.fee_structure.cost_min > 0
                  ? `${therapist.economics.fee_structure.cost_min}`
                  : "Contact for rates"}
                {therapist.economics.fee_structure.cost_max >
                therapist.economics.fee_structure.cost_min
                  ? ` - ${therapist.economics.fee_structure.cost_max}`
                  : ""}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold mb-2">Insurance Accepted</h4>
              <p className="text-sm text-gray-700">
                {therapist.economics.insurance.in_network_plans &&
                  therapist.economics.insurance.in_network_plans.join(", ")}
              </p>
            </div>
          </div>

          {/* Platform */}
          {therapist.platform && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Profile from{" "}
                <span className="font-medium">{therapist.platform}</span>
              </p>
            </div>
          )}

          {/* Why This Match */}
          {therapist.matchReasons && therapist.matchReasons.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-indigo-900 mb-3">
                Why We Matched You
              </h4>
              <ul className="space-y-2">
                {therapist.matchReasons.map((reason, i) => (
                  <li key={i} className="flex items-start text-indigo-900">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-indigo-600" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <a
              href={therapist.identity.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
            >
              Book Free Consultation
            </a>
            <button
              onClick={() => onSave?.(therapist)}
              className={`px-6 py-4 border-2 rounded-lg font-semibold transition flex items-center ${
                isSaved
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 mr-2 ${isSaved ? "fill-current" : ""}`}
              />
              {isSaved ? "Saved" : "Save for Later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
