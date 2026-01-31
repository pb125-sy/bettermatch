export interface Therapist {
  provider_id: string;
  identity: {
    name: string;
    credentials: string[];
    title: string;
    profile_url: string;
    narrative?: string;
    photo?: string;
  };
  economics: {
    fee_structure: {
      session_type: string;
      cost_min: number;
      cost_max: number;
      currency: string;
      sliding_scale_available: boolean;
    };
    insurance: {
      in_network_plans: string[];
      out_of_network_eligible: boolean;
      superbill_provided: boolean;
    };
  };
  clinical: {
    specialties: string[];
    modalities: string[];
    populations: string[];
    languages?: string[];
    lgbtq_affirming?: boolean;
    poc_focused?: boolean;
  };
  location: {
    city: string;
    state: string;
    telehealth: boolean;
  };
  matchScore?: number;
  matchReasons?: string[];
  platform?: string; // from old data
  education?: string; // from old data
  yearsInPractice?: number; // from old data
}

export interface FormData {
  concerns: string[];
  therapyApproach: string;
  communicationStyle: string;
  pastTherapy: string;
  culturalMatch: string;
  languagePreference: string[];
  lgbtqAffirming: string;
  religiousPreference: string;
  insurance: string;
}
