import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// Function to shuffle an array
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// AI Matching endpoint
app.post("/api/match", async (req, res) => {
  try {
    let { userProfile, therapists } = req.body;

    if (!CLAUDE_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // Shuffle therapists to mitigate positional bias
    therapists = shuffle(therapists);

    const specialtyGroups = {
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

    // Build a focused prompt for Claude
    const prompt = `You are BetterMatch AI, a specialized therapist matching assistant. Your role is to thoughtfully match therapy seekers with therapists who best fit their needs. Treat the provided therapist list as the complete candidate pool; do not favor any provider because of position or prior frequency. Apply the rules below strictly.

    ## User Profile
    ${JSON.stringify(userProfile, null, 2)}

    ## Available Therapists
    ${JSON.stringify(therapists, null, 2)}

    ## Specialty Concern Mapping
    Use this guide to connect the user's general concerns to the therapist's specific specialties. For example, if a user lists "Anxiety", a therapist specializing in "Panic" or "OCD" is a strong match.
    ${JSON.stringify(specialtyGroups, null, 2)}

    ## Scoring Guidelines (normalize to 100)
    Compute a numeric score (0–100) for each therapist using the weighted criteria below. Be explicit in reasons about which fields produced the score.

    1.  **Specialty Match (max 25)**: Match user's concerns to 'clinical.specialties'. Award proportional points up to 25.
    2.  **Therapeutic Approach (max 12)**: Prefer approaches matching user's preference (practical, insight, trauma-informed). Award up to 12.
    3.  **Cultural Match (max 30)**: Infer from 'identity.narrative', 'clinical.populations', and explicit cultural keywords (e.g., "South Asian", "Hindu", "BIPOC", "AAPI", "immigrant", "culturally-informed").
        -   If userProfile.culturalMatch === "very-important": require an explicit cultural signal in the therapist data (narrative or clinical.populations) to be eligible for the top slot. If a therapist lacks explicit cultural signals, mark them "culturally ineligible for top slot" in reasons and do not place them above any therapist who does meet the signal threshold.
        -   If userProfile.culturalMatch === "very-important", prefer therapists with a cultural component score >= 65 (on a 0–100 subscale) for top-1 eligibility. If none meet that threshold, still return matches but label which ones are close matches and include the short note described below.
    4.  **Language Match (max 12)**: Full points if therapist lists user's preferred language(s) in 'clinical.languages'.
    5.  **LGBTQ+ Affirming (max 8)**: Award if user indicates it matters and therapist shows explicit affirming cues.
    6.  **Communication Style (max 6)**: Match user's requested communication tone to narrative tone.
    7.  **Religious/Spiritual Match (max 4)**: Award for explicit faith-spoken modalities if user requested a spiritual match.
    8.  **Insurance/Cost/Availability (max 3)**: Small adjustment for insurance/telehealth/fee constraints.

    ## Diversity & Repetition Controls (strict)
    - Penalize repetition: if the request includes userProfile.recentRecommendations (array of provider_id strings), subtract 15 points from any therapist whose provider_id appears in that recent list to avoid recommending the same person repeatedly.
    - Tie-breaking: when scores are within 5 points, prefer therapist with higher cultural match first, then language, then finally apply a randomized selection among remaining ties (so the same name is not always chosen deterministically).
    - Do not return the same provider multiple times in the same response.
    - If a single provider dominates the candidate pool metadata (e.g., the only one who lists "Hindu" explicitly), call that out in the reasons and include an action line: "No strong culturally-matching top candidate; consider expanding to telehealth or searching by language/cultural keywords."

    ## Output constraints & required behavior
    - For each therapist, produce a numeric score (0–100) and 2–4 concise human-readable reasons written in plain English. Do NOT include raw JSON keys, field paths, or code-like identifiers in the reasons. Instead, describe the evidence naturally and clearly (for example: "Profile states experience with South Asian families and immigrants; also lists Hindi language ability"). Use natural phrases like "speaks Hindi", "works with South Asian families", "accepts Blue Cross and Blue Shield", "offers telehealth", and "CBT and Solution-Focused modalities".
    - If userProfile.culturalMatch === "very-important", ensure at least one of the returned top-5 has a strong cultural match (a cultural subscore of 65 or higher on a 0–100 scale) when such a therapist exists in the pool. If none reach that threshold, still return the top-5 but include a clear plain-English note on the top result such as "Cultural threshold not met — no strong matches in the current pool" and explicitly explain which returned candidates are near-misses and why (e.g., "mentions working with diverse populations but does not explicitly reference South Asian/Hindu communities").
    - When applicable, apply the repetition penalty described above and document it: e.g., "Applied repetition penalty: -15 pts (recently recommended)".

    ## Response Format
    Return ONLY valid JSON (no markdown, no explanation) in this exact format. The 'id' field must be the therapist's provider_id string.
    [
      {
        "id": "<therapist_provider_id_string>",
        "score": <0-100>,
        "reasons": ["<specific reason 1 citing fields>", "<specific reason 2>", "..."]
      }
    ]

    Return the top 5 matches, sorted by score descending. Each reason must be written in plain English and explain the evidence without using JSON keys or field paths (for example: "Mentions South Asian family work; speaks Hindi; accepts Blue Cross and Blue Shield; offers telehealth"). If you applied any penalties or ineligibility rules, state them in plain English (for example: "Applied a 15‑point repetition penalty because this therapist was recently recommended"). Do not output raw key names or code-like labels in the reasons.
    `;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API error:", errorData);
      return res.status(response.status).json({ error: "AI service error" });
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    // Parse the JSON response from Claude
    let matches;
    try {
      matches = JSON.parse(aiResponse);
    } catch (parseError) {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse AI response:", aiResponse);
        return res.status(500).json({ error: "Failed to parse AI response" });
      }
    }

    res.json({ matches });
  } catch (error) {
    console.error("Match error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BetterMatch API server running on port ${PORT}`);
});
