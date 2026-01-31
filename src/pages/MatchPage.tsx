import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  DollarSign,
  CheckCircle,
  Sparkles,
  X,
  Bookmark,
} from "lucide-react";
import ProfileModal from "../components/ProfileModal";
import { Therapist, FormData } from "../types";
import profiles from "../../profiles.json";

const therapistDatabase: Therapist[] = (profiles as any).therapists;
const STORAGE_KEY = "bettermatch_session";

const MatchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("concerns");
  const [formData, setFormData] = useState<FormData>({
    concerns: [],
    therapyApproach: "",
    communicationStyle: "",
    pastTherapy: "",
    culturalMatch: "",
    languagePreference: [],
    lgbtqAffirming: "",
    religiousPreference: "",
    insurance: "",
    notes: "", 
  });
  const [matches, setMatches] = useState<Therapist[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Therapist | null>(null);
  const [savedMatches, setSavedMatches] = useState<Therapist[]>([]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  

  // Load saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const session = JSON.parse(saved);
        // Check for new structure; if not present, it's old data.
        if (
          session.matches &&
          session.matches.length > 0 &&
          session.matches[0].provider_id
        ) {
          setStep("results");
          setFormData(session.formData);
          setMatches(session.matches);
          setSavedMatches(session.savedMatches || []);
          // Redirect to /matches if we have results
          if (location.pathname !== "/matches") {
            navigate("/matches", { replace: true });
          }
        } else if (session.savedMatches && session.savedMatches.length > 0) {
          // Old structure but has saved matches — restore savedMatches only
          setSavedMatches(session.savedMatches || []);
        } else {
          // Old data structure, clear it.
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save session and update URL when matches change
  useEffect(() => {
    // Avoid overwriting restored saved matches on initial mount.
    // The initial load effect will populate savedMatches; skip the first save cycle.
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    const session = {
      formData,
      matches,
      savedMatches,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [matches, savedMatches, formData]);

  // Update URL when step changes to results
  useEffect(() => {
    if (step === "results" && location.pathname !== "/matches") {
      navigate("/matches", { replace: true });
    } else if (
      step !== "results" &&
      location.pathname === "/matches" &&
      matches.length === 0
    ) {
      navigate("/match", { replace: true });
    }
  }, [step, location.pathname, matches.length, navigate]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const saveMatch = (therapist: Therapist) => {
    const isAlreadySaved = savedMatches.some(
      (t) => t.provider_id === therapist.provider_id
    );
    if (isAlreadySaved) {
      setSavedMatches((prev) =>
        prev.filter((t) => t.provider_id !== therapist.provider_id)
      );
      showToast(`${therapist.identity.name} removed from saved`);
    } else {
      setSavedMatches((prev) => [...prev, therapist]);
      showToast(`${therapist.identity.name} saved for later!`);
    }
  };

  const isTherapistSaved = (therapistId: string) => {
    return savedMatches.some((t) => t.provider_id === therapistId);
  };

  // Question 1: What brings you to therapy?
  const concerns: string[] = [
    "Anxiety",
    "Depression",
    "Trauma/PTSD",
    "Grief & Loss",
    "Relationship Issues",
    "Family Issues",
    "Cultural Identity",
    "Racial Trauma",
    "LGBTQ+ Identity",
    "Self-Esteem",
    "Life Transitions",
    "Stress & Burnout",
  ];

  // Question 2: What sounds most helpful to you?
  const approachOptions: {
    value: string;
    label: string;
    description: string;
  }[] = [
    {
      value: "practical",
      label: "Practical tools & strategies",
      description: "I can use right away",
    },
    {
      value: "insight",
      label: "Understanding patterns",
      description: "Gaining deeper insight into myself",
    },
    {
      value: "trauma",
      label: "Processing emotions & trauma",
      description: "Working through difficult experiences",
    },
    {
      value: "both",
      label: "Both practical AND deeper work",
      description: "A balanced approach",
    },
    {
      value: "unsure",
      label: "Not sure yet",
      description: "Open to recommendations",
    },
  ];

  // Question 3: Communication style
  const styleOptions: { value: string; label: string; description: string }[] =
    [
      {
        value: "direct",
        label: "Direct and straightforward",
        description: "Tell it like it is",
      },
      {
        value: "warm",
        label: "Warm and gentle",
        description: "Supportive and nurturing",
      },
      {
        value: "collaborative",
        label: "Collaborative",
        description: "We figure it out together",
      },
      {
        value: "no-preference",
        label: "No strong preference",
        description: "Flexible on style",
      },
    ];

  // Question 4: Past therapy experience
  const pastTherapyOptions: { value: string; label: string }[] = [
    { value: "helped", label: "Yes, and it helped" },
    { value: "not-right-fit", label: "Yes, but it wasn't the right fit" },
    { value: "first-time", label: "No, this is my first time" },
  ];

  // Question 5: Cultural matching importance
  const culturalOptions: { value: string; label: string }[] = [
    { value: "very-important", label: "Very important to me" },
    { value: "somewhat-important", label: "Somewhat important" },
    { value: "open", label: "Open to anyone" },
  ];

  // Question 6: Languages
  const languages: string[] = [
    "English",
    "Spanish",
    "Mandarin",
    "Cantonese",
    "Korean",
    "Vietnamese",
    "Tagalog",
    "Hindi",
    "Arabic",
    "Farsi",
    "Portuguese",
    "French",
    "Japanese",
    "Russian",
  ];

  // Question 7: LGBTQ+ affirming
  const lgbtqOptions: { value: string; label: string }[] = [
    { value: "essential", label: "Yes, this is essential" },
    { value: "preferred", label: "Preferred but not required" },
    { value: "not-needed", label: "Not a priority for me" },
  ];

  // Question 8: Religious/spiritual background
  const religiousOptions: { value: string; label: string }[] = [
    { value: "secular", label: "Secular / Non-religious" },
    { value: "christian", label: "Christian" },
    { value: "catholic", label: "Catholic" },
    { value: "jewish", label: "Jewish" },
    { value: "muslim", label: "Muslim" },
    { value: "hindu", label: "Hindu" },
    { value: "buddhist", label: "Buddhist" },
    { value: "spiritual", label: "Spiritual but not religious" },
    { value: "no-preference", label: "No preference" },
  ];

  // Question 9: Insurance
  const insuranceOptions: string[] = [
    "Aetna",
    "Blue Cross",
    "Cigna",
    "UnitedHealthcare",
    "Kaiser",
    "Medicare",
    "Medicaid/Medi-Cal",
    "Out of Pocket",
  ];

  const handleConcernToggle = (concern: string) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languagePreference: prev.languagePreference.includes(lang)
        ? prev.languagePreference.filter((l) => l !== lang)
        : [...prev.languagePreference, lang],
    }));
  };

  // Mapping: User concerns → Related therapist specialty keywords
  const specialtyGroups: Record<string, string[]> = {
    Anxiety: [
      "Anxiety",
      "Anxiety Disorders",
      "OCD",
      "Panic",
      "Social Anxiety",
      "Stress",
    ],
    Depression: ["Depression", "Mood Disorders", "Bipolar"],
    "Trauma/PTSD": [
      "Trauma",
      "PTSD",
      "Complex Trauma",
      "EMDR",
      "Sexual Assault",
      "Domestic Violence",
      "Intergenerational Trauma",
    ],
    "Grief & Loss": ["Grief", "Loss", "Bereavement"],
    "Relationship Issues": [
      "Relationship",
      "Couples",
      "Marriage",
      "Dating",
      "Intimacy",
      "Communication",
    ],
    "Family Issues": [
      "Family",
      "Parenting",
      "Family Conflict",
      "Family Expectations",
      "Family Dynamics",
    ],
    "Cultural Identity": [
      "Cultural Identity",
      "Identity",
      "Multicultural",
      "Immigration",
      "Acculturation",
      "Biracial",
      "Multiracial",
    ],
    "Racial Trauma": [
      "Racial Trauma",
      "Black Mental Health",
      "Racism",
      "Discrimination",
      "Microaggressions",
    ],
    "LGBTQ+ Identity": [
      "LGBTQ+",
      "Gender Identity",
      "Coming Out",
      "Trans",
      "Queer",
      "Sexual Identity",
    ],
    "Self-Esteem": [
      "Self-Esteem",
      "Self-Worth",
      "Confidence",
      "Imposter Syndrome",
      "Perfectionism",
    ],
    "Life Transitions": [
      "Life Transitions",
      "Career",
      "College",
      "Divorce",
      "Retirement",
      "Moving",
    ],
    "Stress & Burnout": [
      "Stress",
      "Burnout",
      "Work Stress",
      "Work-Life Balance",
      "Overwhelm",
    ],
  };

  // Mapping: Therapy approach preference → Therapist approach keywords
  const approachMapping: Record<string, string[]> = {
    practical: [
      "CBT",
      "DBT",
      "Solution-Focused",
      "Skills",
      "Coaching",
      "Behavioral",
      "Practical",
    ],
    insight: [
      "Psychodynamic",
      "Insight",
      "Narrative",
      "Exploratory",
      "Depth",
      "Reflective",
    ],
    trauma: [
      "EMDR",
      "Trauma",
      "Somatic",
      "IFS",
      "Trauma-Informed",
      "Trauma-Focused",
    ],
    both: ["Integrative", "Holistic", "Eclectic", "Comprehensive"],
  };

  // Mapping: Communication style → Therapist style keywords
  const styleMapping: Record<string, string[]> = {
    direct: [
      "direct",
      "straightforward",
      "solution-focused",
      "practical",
      "goal-oriented",
      "structured",
    ],
    warm: [
      "warm",
      "gentle",
      "compassionate",
      "empathetic",
      "nurturing",
      "supportive",
    ],
    collaborative: [
      "collaborative",
      "partnership",
      "interactive",
      "team",
      "together",
    ],
  };

  // Fallback algorithm for when AI API is unavailable
  const calculateMatchFallback = (): Therapist[] => {
    const scored: Therapist[] = therapistDatabase.map((t) => {
      let score = 0;
      const reasons: string[] = [];

      if (formData.concerns.length > 0) {
        const matchedConcerns: string[] = [];
        formData.concerns.forEach((concern) => {
          if (t.clinical.specialties.includes(concern)) {
            matchedConcerns.push(concern);
          }
        });
        const concernScore = Math.min(matchedConcerns.length * 8, 25);
        score += concernScore;
        if (matchedConcerns.length > 0) {
          reasons.push(
            `Specializes in ${matchedConcerns.slice(0, 2).join(" and ")}`
          );
        }
      }

      const isLgbtqAffirming =
        t.clinical.lgbtq_affirming ||
        (t.identity.narrative || "").toLowerCase().includes("lgbtq");
      if (formData.lgbtqAffirming === "essential" && isLgbtqAffirming) {
        score += 15;
        reasons.push("LGBTQ+ affirming practice");
      } else if (formData.lgbtqAffirming === "preferred" && isLgbtqAffirming) {
        score += 8;
        reasons.push("LGBTQ+ affirming");
      }

      if (formData.insurance) {
        const insuranceMatch =
          formData.insurance === "Out of Pocket" ||
          t.economics.insurance.in_network_plans.some((ins) =>
            ins.toLowerCase().includes(formData.insurance.toLowerCase())
          );
        if (insuranceMatch) {
          score += 10;
          reasons.push(`Accepts ${formData.insurance}`);
        }
      }

      return {
        ...t,
        matchScore: Math.min(Math.round(score), 100),
        matchReasons: reasons,
      };
    });

    return scored
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 5);
  };

  // AI-powered matching using Claude API
  const calculateMatch = async () => {
    setIsMatching(true);
    setMatchError(null);
    setStep("loading");

    try {
      // Prepare user profile for API
      const userProfile = {
        concerns: formData.concerns,
        therapyApproach: formData.therapyApproach,
        communicationStyle: formData.communicationStyle,
        pastTherapy: formData.pastTherapy,
        culturalMatch: formData.culturalMatch,
        languagePreference: formData.languagePreference,
        lgbtqAffirming: formData.lgbtqAffirming,
        religiousPreference: formData.religiousPreference,
        insurance: formData.insurance,
      };

      const therapistsForAPI = therapistDatabase.map((t) => ({
        provider_id: t.provider_id,
        identity: t.identity,
        economics: t.economics,
        clinical: t.clinical,
        location: t.location,
      }));

      const response = await fetch("http://localhost:3001/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile,
          therapists: therapistsForAPI,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "AI matching service unavailable");
      }

      const data = await response.json();

      // Merge AI scores with full therapist data
      const scoredTherapists: Therapist[] = data.matches.map(
        (match: { id: string; score: number; reasons: string[] }) => {
          const therapist = therapistDatabase.find(
            (t) => t.provider_id === match.id
          );
          return {
            ...therapist!,
            matchScore: match.score,
            matchReasons: match.reasons,
          };
        }
      );

      setMatches(scoredTherapists);
      setStep("results");
    } catch (error) {
      console.error("AI matching failed:", error);
      setMatchError(
        error instanceof Error ? error.message : "Something went wrong"
      );
      // Stay on loading screen to show error, don't auto-fallback
    } finally {
      setIsMatching(false);
    }
  };

  const retryWithFallback = () => {
    const fallbackMatches = calculateMatchFallback();
    setMatches(fallbackMatches);
    setMatchError(null);
    setStep("results");
  };
  // Step 1: What brings you to therapy?
  if (step === "concerns") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 1 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            What brings you to therapy?
          </h2>
          <p className="text-gray-600 mb-6">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {concerns.map((c) => (
              <button
                key={c}
                onClick={() => handleConcernToggle(c)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  formData.concerns.includes(c)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep("approach")}
            disabled={formData.concerns.length === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step 2: What sounds most helpful?
  if (step === "approach") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 2 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            What sounds most helpful to you?
          </h2>
          <p className="text-gray-600 mb-6">
            This helps us match your therapy style
          </p>
          <div className="space-y-3 mb-8">
            {approachOptions.map((o) => (
              <button
                key={o.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, therapyApproach: o.value }))
                }
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  formData.therapyApproach === o.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">{o.label}</div>
                <div className="text-sm text-gray-500">{o.description}</div>
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("concerns")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("style")}
              disabled={!formData.therapyApproach}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Communication style
  if (step === "style") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 3 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            What communication style works best for you?
          </h2>
          <p className="text-gray-600 mb-6">
            How would you like your therapist to communicate?
          </p>
          <div className="space-y-3 mb-8">
            {styleOptions.map((o) => (
              <button
                key={o.value}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    communicationStyle: o.value,
                  }))
                }
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  formData.communicationStyle === o.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">{o.label}</div>
                <div className="text-sm text-gray-500">{o.description}</div>
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("approach")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("past-therapy")}
              disabled={!formData.communicationStyle}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Past therapy experience
  if (step === "past-therapy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 4 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            Have you tried therapy before?
          </h2>
          <p className="text-gray-600 mb-6">
            This helps us personalize your matches
          </p>
          <div className="space-y-3 mb-8">
            {pastTherapyOptions.map((o) => (
              <button
                key={o.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, pastTherapy: o.value }))
                }
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  formData.pastTherapy === o.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("style")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("cultural")}
              disabled={!formData.pastTherapy}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Cultural matching
  if (step === "cultural") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 5 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            How important is cultural background matching?
          </h2>
          <p className="text-gray-600 mb-6">
            Finding a therapist who understands your cultural context
          </p>
          <div className="space-y-3 mb-8">
            {culturalOptions.map((o) => (
              <button
                key={o.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, culturalMatch: o.value }))
                }
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  formData.culturalMatch === o.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("past-therapy")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("language")}
              disabled={!formData.culturalMatch}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Language preferences
  if (step === "language") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 6 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">Language preferences</h2>
          <p className="text-gray-600 mb-6">
            Select languages you'd like your therapist to speak (optional)
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageToggle(l)}
                className={`p-4 rounded-lg border-2 transition ${
                  formData.languagePreference.includes(l)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("cultural")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("lgbtq")}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 7: LGBTQ+ affirming
  if (step === "lgbtq") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 7 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            Is LGBTQ+ affirming care important to you?
          </h2>
          <p className="text-gray-600 mb-6">
            We'll prioritize therapists with LGBTQ+ affirming practices
          </p>
          <div className="space-y-3 mb-8">
            {lgbtqOptions.map((o) => (
              <button
                key={o.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, lgbtqAffirming: o.value }))
                }
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  formData.lgbtqAffirming === o.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("language")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("religious")}
              disabled={!formData.lgbtqAffirming}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 8: Religious/spiritual background
  if (step === "religious") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 8 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">
            Religious or spiritual preference?
          </h2>
          <p className="text-gray-600 mb-6">
            Match with a therapist who understands your background
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {religiousOptions.map((r) => (
              <button
                key={r.value}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    religiousPreference: r.value,
                  }))
                }
                className={`p-4 rounded-lg border-2 text-left transition ${
                  formData.religiousPreference === r.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("lgbtq")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("insurance")}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

// Step 9: Insurance
  if (step === "insurance") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 9 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">What's your insurance?</h2>
          <p className="text-gray-600 mb-6">
            We'll show therapists who accept your insurance
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {insuranceOptions.map((ins) => (
              <button
                key={ins}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, insurance: ins }))
                }
                className={`p-4 rounded-lg border-2 transition ${
                  formData.insurance === ins
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {ins}
              </button>
            ))}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("religious")}
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep("additional-notes")}
              disabled={!formData.insurance}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final Step: Additional Notes (Added to complete the logic)
  if (step === "additional-notes") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-indigo-600 font-medium mb-2">
            Step 10 of 10
          </p>
          <h2 className="text-3xl font-bold mb-2">Is there anything else you want us to know?</h2>
          <textarea
            className="w-full p-4 border-2 rounded-lg mb-8 h-32 focus:border-indigo-600 outline-none"
            placeholder="Tell us anything else that might help with matching..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
          <div className="flex space-x-3">
            <button onClick={() => setStep("insurance")} className="px-6 py-3 border-2 rounded-lg hover:bg-gray-50">
              Back
            </button>
            <button
              onClick={calculateMatch}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Find My Matches
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen while AI is matching
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          {matchError ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Matching Error
              </h2>
              <p className="text-gray-600 mb-6">{matchError}</p>
              <div className="space-y-3">
                <button
                  onClick={calculateMatch}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Try Again
                </button>
                <button
                  onClick={retryWithFallback}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Use Basic Matching Instead
                </button>
                <button
                  onClick={() => setStep("insurance")}
                  className="w-full text-gray-500 py-2 hover:text-gray-700 transition"
                >
                  Go Back
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Finding Your Perfect Matches
              </h2>
              <p className="text-gray-600 mb-4">
                Our AI is analyzing therapist profiles to find the best fits for
                your unique needs...
              </p>
              <div className="flex justify-center space-x-1">
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Toast Notification */}
          {toast.visible && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
              <CheckCircle className="w-5 h-5" />
              <span>{toast.message}</span>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Perfect Matches</h1>
            <p className="text-xl text-gray-600">
              We found {matches.length} ideal therapists
            </p>
          </div>

          {/* Saved Therapists Button */}
          {savedMatches.length > 0 && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowSavedPanel(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition"
              >
                <Bookmark className="w-5 h-5 text-indigo-600 fill-current" />
                <span className="text-gray-700 font-medium">
                  {savedMatches.length} Saved
                </span>
              </button>
            </div>
          )}

          {/* Saved Therapists Panel */}
          {showSavedPanel && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Saved Therapists</h2>
                    <button
                      onClick={() => setShowSavedPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {savedMatches.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No saved therapists yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {savedMatches.map((t) => (
                        <div
                          key={t.provider_id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-4xl">{t.identity.photo}</span>
                            <div>
                              <h3 className="font-bold">{t.identity.name}</h3>
                              <p className="text-sm text-gray-600">
                                {t.identity.credentials.join(", ")}
                              </p>
                              <div className="flex items-center mt-1">
                                <Heart className="w-4 h-4 text-red-500 fill-current mr-1" />
                                <span className="text-sm font-semibold text-indigo-600">
                                  {t.matchScore}% match
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedMatch(t);
                                setShowSavedPanel(false);
                              }}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => saveMatch(t)}
                              className="p-2 text-gray-400 hover:text-red-500 transition"
                              title="Remove from saved"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Therapist Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {matches.map((t, i) => (
              <div
                key={t.provider_id}
                className={`bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl`}
              >
                <div
                  className={`p-6 ${
                    i === 0
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      {i === 0 && (
                        <div className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full mb-2">
                          BEST MATCH
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveMatch(t);
                      }}
                      className={`p-2 rounded-full transition ${
                        isTherapistSaved(t.provider_id)
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isTherapistSaved(t.provider_id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <div className="text-5xl mb-3">
                    {t.identity.photo || "🧑‍⚕️"}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{t.identity.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {t.identity.credentials.join(", ")}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                      <span className="text-2xl font-bold text-indigo-600">
                        {t.matchScore}%
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">Match</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">
                        {t.economics.fee_structure.cost_min > 0
                          ? `$${t.economics.fee_structure.cost_min}`
                          : "Contact for rates"}
                        {t.economics.fee_structure.cost_max >
                        t.economics.fee_structure.cost_min
                          ? ` - $${t.economics.fee_structure.cost_max}`
                          : ""}
                      </span>
                    </div>
                  </div>
                  {t.platform && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">
                        From {t.platform}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white space-y-2">
                  <button
                    onClick={() => setSelectedMatch(t)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          <ProfileModal
            therapist={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onSave={saveMatch}
            isSaved={
              selectedMatch
                ? isTherapistSaved(selectedMatch.provider_id)
                : false
            }
          />

          <div className="mt-8 text-center flex flex-col items-center space-y-4">
	  {/* NEW: Review Button */}
	  <button 
	    onClick={() => navigate("/review")}
	    className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
	  >
    <CheckCircle className="mr-2" size={18} />
    Review my last session
  </button>
            <button
              onClick={() => {
                // Preserve saved therapists across "Start Over".
                // Use in-memory savedMatches state to avoid race conditions with localStorage.
                try {
                  const preserved = savedMatches || [];
                  const newSession = {
                    formData: {
                      concerns: [],
                      therapyApproach: "",
                      communicationStyle: "",
                      pastTherapy: "",
                      culturalMatch: "",
                      languagePreference: [],
                      lgbtqAffirming: "",
                      religiousPreference: "",
                      insurance: "",
                    },
                    matches: [],
                    savedMatches: preserved,
                  };
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
                } catch (e) {
                  // If anything goes wrong, do not overwrite existing localStorage.
                }

                // Reset local UI state
                setStep("concerns");
                setFormData({
                  concerns: [],
                  therapyApproach: "",
                  communicationStyle: "",
                  pastTherapy: "",
                  culturalMatch: "",
                  languagePreference: [],
                  lgbtqAffirming: "",
                  religiousPreference: "",
                  insurance: "",
                });
                setMatches([]);
                navigate("/");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MatchPage;