import React from "react";
import profiles from "../../profiles.json";

const ProfileCount: React.FC = () => {
  const count = profiles.therapists.length;
  return (
    <p className="text-sm text-gray-500 mt-4">
      Now featuring {count} diverse therapist profiles.
    </p>
  );
};

export default ProfileCount;
