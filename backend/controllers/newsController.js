// Health News - static curated data (can be replaced with a real news API)
const healthNews = [
  {
    id: 1,
    title: "New Study Links Regular Exercise to Reduced Risk of Heart Disease",
    summary: "A comprehensive study involving 50,000 participants found that 30 minutes of daily moderate exercise reduces cardiovascular risk by up to 35%.",
    category: "Cardiology",
    date: "2024-12-01",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    source: "Health Journal",
  },
  {
    id: 2,
    title: "AI-Powered Diagnostics Improving Early Cancer Detection",
    summary: "Artificial intelligence models are now helping radiologists detect cancerous cells up to 2 years earlier than traditional methods.",
    category: "Technology",
    date: "2024-11-28",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
    source: "Medical Times",
  },
  {
    id: 3,
    title: "Mental Health Awareness: Managing Stress in Modern Life",
    summary: "Experts recommend mindfulness, regular sleep schedules, and physical activity as the top three methods to combat stress-related disorders.",
    category: "Mental Health",
    date: "2024-11-25",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    source: "Wellness Weekly",
  },
  {
    id: 4,
    title: "Breakthrough in Diabetes Management: New Drug Approved",
    summary: "The FDA has approved a new once-weekly injection that significantly improves blood glucose control in Type 2 diabetes patients.",
    category: "Endocrinology",
    date: "2024-11-20",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    source: "Pharma News",
  },
  {
    id: 5,
    title: "Telemedicine Adoption Reaches Record High in 2024",
    summary: "Over 65% of patients now prefer telemedicine consultations for routine checkups, significantly improving healthcare accessibility.",
    category: "Technology",
    date: "2024-11-15",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
    source: "Digital Health Today",
  },
  {
    id: 6,
    title: "Importance of Regular Health Screenings After Age 40",
    summary: "Medical experts urge adults above 40 to schedule annual screenings for blood pressure, cholesterol, diabetes, and cancer markers.",
    category: "Preventive Care",
    date: "2024-11-10",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    source: "Health Today",
  },
];

exports.getHealthNews = async (req, res) => {
  try {
    const { category } = req.query;
    let news = healthNews;
    if (category) {
      news = healthNews.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    }
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
