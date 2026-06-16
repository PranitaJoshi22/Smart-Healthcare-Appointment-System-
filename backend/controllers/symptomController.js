// AI Symptom Checker - Rule-based engine
const symptomDatabase = {
  fever: {
    conditions: ["Common Cold", "Flu", "COVID-19", "Malaria", "Typhoid"],
    specialists: ["General Physician", "Internal Medicine"],
    urgency: "medium",
    tips: ["Stay hydrated", "Rest well", "Monitor temperature", "Take paracetamol if above 101°F"],
  },
  headache: {
    conditions: ["Tension Headache", "Migraine", "Sinusitis", "Hypertension"],
    specialists: ["Neurologist", "General Physician"],
    urgency: "low",
    tips: ["Rest in a dark room", "Stay hydrated", "Avoid screens", "Try cold/warm compress"],
  },
  "chest pain": {
    conditions: ["Angina", "Heart Attack", "Acid Reflux", "Muscle Strain"],
    specialists: ["Cardiologist", "Emergency"],
    urgency: "high",
    tips: ["SEEK IMMEDIATE MEDICAL ATTENTION", "Do not ignore chest pain", "Call emergency if severe"],
  },
  cough: {
    conditions: ["Common Cold", "Bronchitis", "Asthma", "COVID-19", "Allergies"],
    specialists: ["Pulmonologist", "General Physician", "ENT"],
    urgency: "low",
    tips: ["Drink warm fluids", "Honey and ginger tea", "Avoid cold air", "Use humidifier"],
  },
  "stomach pain": {
    conditions: ["Gastritis", "Appendicitis", "IBS", "Food Poisoning"],
    specialists: ["Gastroenterologist", "General Physician"],
    urgency: "medium",
    tips: ["Avoid spicy food", "Stay hydrated", "Eat light meals", "Rest"],
  },
  "back pain": {
    conditions: ["Muscle Strain", "Herniated Disc", "Sciatica", "Kidney Stones"],
    specialists: ["Orthopedist", "Physiotherapist", "Neurologist"],
    urgency: "low",
    tips: ["Apply heat/ice", "Gentle stretching", "Avoid heavy lifting", "Maintain good posture"],
  },
  "shortness of breath": {
    conditions: ["Asthma", "COPD", "Pneumonia", "Heart Failure", "Anxiety"],
    specialists: ["Pulmonologist", "Cardiologist", "Emergency"],
    urgency: "high",
    tips: ["Seek immediate care if severe", "Sit upright", "Avoid triggers", "Use inhaler if prescribed"],
  },
  "skin rash": {
    conditions: ["Eczema", "Allergic Reaction", "Psoriasis", "Chickenpox", "Contact Dermatitis"],
    specialists: ["Dermatologist", "Allergist"],
    urgency: "low",
    tips: ["Avoid scratching", "Use gentle soap", "Apply calamine lotion", "Avoid known allergens"],
  },
  "joint pain": {
    conditions: ["Arthritis", "Gout", "Lupus", "Injury", "Lyme Disease"],
    specialists: ["Rheumatologist", "Orthopedist"],
    urgency: "medium",
    tips: ["Rest the joint", "Ice pack for 15 min", "Anti-inflammatory medication", "Light exercise"],
  },
  fatigue: {
    conditions: ["Anemia", "Depression", "Thyroid Disorder", "Diabetes", "Sleep Disorder"],
    specialists: ["General Physician", "Endocrinologist", "Psychiatrist"],
    urgency: "low",
    tips: ["Improve sleep hygiene", "Regular exercise", "Balanced diet", "Reduce stress"],
  },
  dizziness: {
    conditions: ["Vertigo", "Low Blood Pressure", "Dehydration", "Inner Ear Problem"],
    specialists: ["ENT", "Neurologist", "General Physician"],
    urgency: "medium",
    tips: ["Sit or lie down", "Stay hydrated", "Avoid sudden movements", "Rest"],
  },
  "sore throat": {
    conditions: ["Strep Throat", "Tonsillitis", "Common Cold", "Flu"],
    specialists: ["ENT", "General Physician"],
    urgency: "low",
    tips: ["Warm salt water gargle", "Honey and lemon tea", "Throat lozenges", "Rest voice"],
  },
};

exports.checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body; // array of symptom strings
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide symptoms" });
    }

    const results = [];
    const allConditions = new Set();
    const allSpecialists = new Set();
    let highestUrgency = "low";

    const urgencyLevel = { low: 1, medium: 2, high: 3 };

    symptoms.forEach((symptom) => {
      const key = symptom.toLowerCase().trim();
      const match = Object.keys(symptomDatabase).find(
        (k) => key.includes(k) || k.includes(key)
      );

      if (match) {
        const data = symptomDatabase[match];
        results.push({ symptom: match, ...data });
        data.conditions.forEach((c) => allConditions.add(c));
        data.specialists.forEach((s) => allSpecialists.add(s));
        if (urgencyLevel[data.urgency] > urgencyLevel[highestUrgency]) {
          highestUrgency = data.urgency;
        }
      }
    });

    const disclaimer =
      "This is a preliminary symptom analysis for informational purposes only. Please consult a qualified healthcare professional for proper diagnosis and treatment.";

    res.status(200).json({
      success: true,
      analysis: {
        symptoms: results,
        possibleConditions: [...allConditions],
        recommendedSpecialists: [...allSpecialists],
        urgency: highestUrgency,
        tips: results.flatMap((r) => r.tips).filter((v, i, a) => a.indexOf(v) === i),
        disclaimer,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSymptomList = async (req, res) => {
  const symptoms = Object.keys(symptomDatabase);
  res.status(200).json({ success: true, symptoms });
};
