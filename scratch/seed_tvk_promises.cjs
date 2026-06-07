/**
 * One-time seed script: replaces Kerala placeholder data with real TVK promises.
 * Sources: User-provided research (June 7, 2026). Run once then archive.
 */
const fs = require('fs');
const path = require('path');

const promises = [

  // ─── FULFILLED — Day 1 GOs (May 10, 2026) ───────────────────────────────

  {
    "id": "p1",
    "slug": "free-200-units-electricity-1",
    "title": "200 units free electricity for domestic households",
    "titleTa": "வீட்டு நுகர்வோருக்கு 200 யூனிட் இலவச மின்சாரம்",
    "description": "A Government Order providing 200 units of free electricity per month to all domestic households consuming up to 500 units monthly was signed by CM C. Joseph Vijay on his first day in office (May 10, 2026).",
    "trackingNote": "GO signed May 10, 2026. Mark 'fulfilled' once reflected in TANGEDCO billing cycle.",
    "manifestoQuote": "200 units of free electricity will be provided to all domestic consumers as an immediate priority of the TVK government.",
    "sector": {
      "id": "s4",
      "name": "Social Security",
      "nameTa": "சமூக பாதுகாப்பு",
      "icon": "shield",
      "color": "#8B5CF6"
    },
    "status": "fulfilled",
    "icon": "zap",
    "sources": [
      {
        "title": "CM Vijay signs Day-1 GOs: free electricity, women's safety force, anti-narcotics task force",
        "url": "https://www.instagram.com/p/DYJb53hCKrU/",
        "publication": "Hindustan Times (Instagram)",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "Joseph Vijay signed major welfare-focused orders immediately after the swearing-in ceremony, including 200 units of free electricity, formation of Singa Pen Special Force and Anti-Narcotics Task Force."
      },
      {
        "title": "On his first day, Tamil Nadu CM Vijay signed GO to grant 200 units free electricity",
        "url": "https://www.instagram.com/p/DYJd87ICZfz/",
        "publication": "Media Report (Instagram)",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "Tamil Nadu Chief Minister C. Joseph Vijay signed the GO to grant 200 units of free electricity to households consuming up to 500 units monthly."
      },
      {
        "title": "Vijay announced three significant decisions after taking oath — free electricity, women's safety, anti-narcotics",
        "url": "https://www.youtube.com/watch?v=4vt4v7_6OJE",
        "publication": "YouTube / News Channel",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "Video report confirming CM Vijay's three Day-1 decisions, including the rollout of 200 units of free electricity for domestic consumers."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p2",
    "slug": "singa-pen-special-force-womens-safety-2",
    "title": "Establish Singa Pen Special Force for women's safety",
    "titleTa": "சிங்கப் பெண் சிறப்புப் படை அமைப்பு",
    "description": "Formation of the elite 'Singa Pen Special Force', a dedicated police unit for the protection of women, established via a Government Order signed by CM Vijay on Day 1 of his administration.",
    "trackingNote": "GO signed May 10, 2026. Full operational deployment and recruitment to be tracked.",
    "manifestoQuote": "A dedicated elite force — Singa Pen — will be established to ensure the safety and dignity of women across Tamil Nadu.",
    "sector": {
      "id": "s1",
      "name": "Women & Welfare",
      "nameTa": "பெண்கள் & நலன்",
      "icon": "shield-check",
      "color": "#EC4899"
    },
    "status": "fulfilled",
    "icon": "shield-check",
    "sources": [
      {
        "title": "CM Vijay signs Day-1 GOs: free electricity, women's safety force, anti-narcotics task force",
        "url": "https://www.instagram.com/p/DYJb53hCKrU/",
        "publication": "Hindustan Times (Instagram)",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "CM Vijay signed the GO for establishment of the Singa Pen Special Force dedicated to protecting women on his first day in office."
      },
      {
        "title": "On his first day, Tamil Nadu CM Vijay signed three major welfare orders",
        "url": "https://www.instagram.com/p/DYJd87ICZfz/",
        "publication": "Media Report (Instagram)",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "CM Vijay signed the GO to establish the Singa Pen Special Force as one of his three immediate Day-1 decisions."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p3",
    "slug": "anti-narcotics-task-force-3",
    "title": "Form Anti-Narcotics Task Force to combat drug menace",
    "titleTa": "போதைப்பொருள் எதிர்ப்பு சிறப்புப் படை அமைப்பு",
    "description": "A specialised Anti-Narcotics Task Force was formed via a Government Order signed on May 10, 2026 to crack down on illegal drug supply chains, trafficking, and substance abuse across Tamil Nadu.",
    "trackingNote": "GO signed May 10, 2026. Operational deployment, raids, and inter-agency coordination to be tracked.",
    "manifestoQuote": "An Anti-Narcotics Task Force will be formed on Day 1 to protect the youth of Tamil Nadu from the drug menace.",
    "sector": {
      "id": "s8",
      "name": "Law & Order",
      "nameTa": "சட்டம் & ஒழுங்கு",
      "icon": "shield",
      "color": "#EF4444"
    },
    "status": "fulfilled",
    "icon": "shield",
    "sources": [
      {
        "title": "CM Vijay signs Day-1 GOs: free electricity, women's safety force, anti-narcotics task force",
        "url": "https://www.instagram.com/p/DYJb53hCKrU/",
        "publication": "Hindustan Times (Instagram)",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "Joseph Vijay signed the GO forming the Anti-Narcotics Task Force to crack down on illegal substances across Tamil Nadu as one of his three immediate Day-1 decisions."
      },
      {
        "title": "Vijay announced three significant decisions after taking oath",
        "url": "https://www.youtube.com/watch?v=4vt4v7_6OJE",
        "publication": "YouTube / News Channel",
        "date": "2026-05-10",
        "tier": 2,
        "summary": "Video report confirming formation of the Anti-Narcotics Task Force as one of CM Vijay's Day-1 decisions after taking the oath of office."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  // ─── IN PROGRESS — First Cabinet Meeting (June 5, 2026) ─────────────────

  {
    "id": "p4",
    "slug": "tasmac-administrative-overhaul-4",
    "title": "TASMAC administrative overhaul for transparency",
    "titleTa": "டாஸ்மாக் நிர்வாக சீர்திருத்தம்",
    "description": "A major administrative overhaul of TASMAC (Tamil Nadu State Marketing Corporation) retail liquor operations was initiated at the first Cabinet meeting on June 5, 2026, targeting transparency from procurement to retail sale.",
    "trackingNote": "Cabinet decision June 5, 2026. Track gazette notification of new TASMAC policy framework.",
    "manifestoQuote": "TASMAC will be reformed to eliminate corruption, bring transparency in procurement and retail, and reduce the social harm of alcohol.",
    "sector": {
      "id": "s7",
      "name": "Governance & Administration",
      "nameTa": "நிர்வாகம் & ஆட்சி",
      "icon": "landmark",
      "color": "#6366F1"
    },
    "status": "in-progress",
    "icon": "landmark",
    "sources": [
      {
        "title": "First cabinet meeting of TVK-led Tamil Nadu government to focus on TASMAC reforms, investment promotion",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/first-cabinet-meeting-of-tvk-led-tamil-nadu-government-to-focus-on-tasmac-reforms-investment-promotion/article71061191.ece",
        "publication": "The Hindu",
        "date": "2026-06-05",
        "tier": 2,
        "summary": "The State government is planning a major administrative overhaul of TASMAC operations to bring transparency from the procurement to the retail stage of liquor sale."
      },
      {
        "title": "CM Vijay's first cabinet meeting: 436-project roadmap unveiled, TASMAC reforms initiated",
        "url": "https://thefederal.com/category/states/south/tamil-nadu/cm-vijay-first-cabinet-meeting-roadmap-436-projects-245564",
        "publication": "The Federal",
        "date": "2026-06-05",
        "tier": 3,
        "summary": "At the inaugural Cabinet meeting chaired by CM Vijay, the government initiated TASMAC reforms as part of a broader 436-project governance agenda."
      }
    ],
    "lastUpdated": "2026-06-05T00:00:00.000Z",
    "createdAt": "2026-06-05T00:00:00.000Z"
  },

  {
    "id": "p5",
    "slug": "mekedatu-dam-legal-action-water-rights-5",
    "title": "Legal action against Mekedatu dam to protect TN water rights",
    "titleTa": "மேகேதாட்டு அணை — தமிழ்நாடு நீர் உரிமை பாதுகாப்பு",
    "description": "At the first Cabinet meeting on June 5, 2026, the TVK government resolved to take necessary legal action to protect Tamil Nadu's water rights against the neighbouring state's proposed Mekedatu dam construction on the Cauvery river.",
    "trackingNote": "Cabinet resolution June 5, 2026. Track filing of legal petition before the Supreme Court or Cauvery Water Management Authority.",
    "manifestoQuote": "The TVK government will take every legal and constitutional measure to protect Tamil Nadu's rightful share of Cauvery waters and oppose the Mekedatu dam.",
    "sector": {
      "id": "s9",
      "name": "Water Resources",
      "nameTa": "நீர் வளங்கள்",
      "icon": "droplets",
      "color": "#06B6D4"
    },
    "status": "in-progress",
    "icon": "droplets",
    "sources": [
      {
        "title": "CM Vijay's first cabinet meeting: 436-project roadmap unveiled, Mekedatu legal action resolved",
        "url": "https://thefederal.com/category/states/south/tamil-nadu/cm-vijay-first-cabinet-meeting-roadmap-436-projects-245564",
        "publication": "The Federal",
        "date": "2026-06-05",
        "tier": 3,
        "summary": "At the inaugural Cabinet meeting, the government resolved to take necessary legal action against the Mekedatu project to protect state water interests."
      }
    ],
    "lastUpdated": "2026-06-05T00:00:00.000Z",
    "createdAt": "2026-06-05T00:00:00.000Z"
  },

  {
    "id": "p6",
    "slug": "436-project-governance-roadmap-6",
    "title": "436-project time-bound governance roadmap",
    "titleTa": "436 திட்டங்கள் — காலக்கெடு ஆட்சி திட்டம்",
    "description": "At the first Cabinet meeting on June 5, 2026, CM Vijay unveiled a comprehensive 436-project roadmap spanning all government departments with specific, time-bound execution targets to deliver on election promises.",
    "trackingNote": "Cabinet meeting June 5, 2026. Track department-wise rollout of individual projects within the 436 framework.",
    "manifestoQuote": "The TVK government will operate on a clear, time-bound project roadmap ensuring accountability and delivery across all departments.",
    "sector": {
      "id": "s7",
      "name": "Governance & Administration",
      "nameTa": "நிர்வாகம் & ஆட்சி",
      "icon": "landmark",
      "color": "#6366F1"
    },
    "status": "in-progress",
    "icon": "landmark",
    "sources": [
      {
        "title": "CM Vijay chairs first cabinet meeting: 436-project roadmap for all departments unveiled",
        "url": "https://thefederal.com/category/states/south/tamil-nadu/cm-vijay-first-cabinet-meeting-roadmap-436-projects-245564",
        "publication": "The Federal",
        "date": "2026-06-05",
        "tier": 3,
        "summary": "The government unveiled a comprehensive 436-project roadmap with specific, time-bound execution goals for targeted projects across all government departments."
      },
      {
        "title": "Tamil Nadu CM Vijay chairs first cabinet meeting",
        "url": "https://www.instagram.com/p/DZMg5Z_yzyQ/",
        "publication": "Media Report (Instagram)",
        "date": "2026-06-05",
        "tier": 3,
        "summary": "CM Vijay chaired the inaugural cabinet meeting of his Tamil Nadu government, unveiling the 436-project governance roadmap."
      }
    ],
    "lastUpdated": "2026-06-05T00:00:00.000Z",
    "createdAt": "2026-06-05T00:00:00.000Z"
  },

  // ─── PENDING — Key Manifesto Promises ───────────────────────────────────

  {
    "id": "p7",
    "slug": "free-bus-travel-for-women-7",
    "title": "Free bus travel for women on TNSTC and MTC buses",
    "titleTa": "பெண்களுக்கு இலவச பேருந்து பயணம்",
    "description": "Free travel for women on all Tamil Nadu State Transport Corporation (TNSTC) and Metropolitan Transport Corporation (MTC) ordinary services across Tamil Nadu.",
    "trackingNote": null,
    "manifestoQuote": "All women in Tamil Nadu will receive free travel on TNSTC and MTC buses as a right, not a privilege.",
    "sector": {
      "id": "s1",
      "name": "Women & Welfare",
      "nameTa": "பெண்கள் & நலன்",
      "icon": "users",
      "color": "#EC4899"
    },
    "status": "pending",
    "icon": "bus",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "The Hindu's coverage of the TVK government formation references key manifesto commitments including free bus travel for women."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p8",
    "slug": "1000-monthly-stipend-college-women-8",
    "title": "₹1,000 monthly stipend for college-going women students",
    "titleTa": "கல்லூரி படிக்கும் மாணவிகளுக்கு மாதம் ₹1,000 உதவித்தொகை",
    "description": "A monthly stipend of ₹1,000 to be provided to women enrolled in government and aided colleges across Tamil Nadu to reduce dropout rates and support women's higher education.",
    "trackingNote": null,
    "manifestoQuote": "Every woman studying in a college in Tamil Nadu will receive a monthly stipend of ₹1,000 to ensure she can complete her education without financial worry.",
    "sector": {
      "id": "s2",
      "name": "Education",
      "nameTa": "கல்வி",
      "icon": "graduation-cap",
      "color": "#3B82F6"
    },
    "status": "pending",
    "icon": "graduation-cap",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "Coverage of TVK's government formation referencing education-related manifesto commitments."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p9",
    "slug": "welfare-pension-raised-3000-9",
    "title": "Welfare pension raised to ₹3,000 per month",
    "titleTa": "நலத்துறை ஓய்வூதியம் மாதம் ₹3,000-ஆக உயர்வு",
    "description": "Increase the monthly welfare pension for all beneficiaries (elderly, widows, differently-abled, destitute) from the current amount to ₹3,000 per month.",
    "trackingNote": null,
    "manifestoQuote": "The welfare pension for all eligible beneficiaries will be raised to ₹3,000 per month to ensure dignified living for the most vulnerable.",
    "sector": {
      "id": "s4",
      "name": "Social Security",
      "nameTa": "சமூக பாதுகாப்பு",
      "icon": "shield",
      "color": "#8B5CF6"
    },
    "status": "pending",
    "icon": "heart-handshake",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "Coverage of TVK's government formation referencing welfare pension enhancement as a key manifesto commitment."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p10",
    "slug": "free-breakfast-scheme-govt-schools-10",
    "title": "Free breakfast scheme for all government school students",
    "titleTa": "அரசுப் பள்ளி மாணவர்களுக்கு இலவச காலை உணவு",
    "description": "Expansion and universalisation of the free breakfast scheme to cover all students in government and government-aided schools across Tamil Nadu, building on the existing noon-meal scheme.",
    "trackingNote": null,
    "manifestoQuote": "Every child in a government school will start their day with a nutritious free breakfast so that hunger is never a barrier to learning.",
    "sector": {
      "id": "s2",
      "name": "Education",
      "nameTa": "கல்வி",
      "icon": "graduation-cap",
      "color": "#3B82F6"
    },
    "status": "pending",
    "icon": "graduation-cap",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation coverage referencing school welfare and nutrition commitments."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p11",
    "slug": "cmchis-health-insurance-expansion-11",
    "title": "Universal health insurance expansion for all families",
    "titleTa": "அனைத்து குடும்பங்களுக்கும் உலகளாவிய சுகாதார காப்பீடு",
    "description": "Expansion of the Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS) to cover all families in Tamil Nadu with enhanced coverage limits and inclusion of more treatments and hospitals.",
    "trackingNote": null,
    "manifestoQuote": "No family in Tamil Nadu will be denied healthcare due to financial inability. The health insurance scheme will be universalised and its coverage enhanced.",
    "sector": {
      "id": "s3",
      "name": "Health",
      "nameTa": "சுகாதாரம்",
      "icon": "heart",
      "color": "#10B981"
    },
    "status": "pending",
    "icon": "heart",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation coverage referencing health insurance as a key welfare commitment. Portfolio for Health & Medical Education allocated to KG Arun Raj."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p12",
    "slug": "interest-free-loans-youth-entrepreneurs-12",
    "title": "Interest-free loans for youth entrepreneurs",
    "titleTa": "இளம் தொழில்முனைவோருக்கு வட்டியில்லா கடன்",
    "description": "Interest-free startup and business loans to be provided to educated unemployed youth and young entrepreneurs to promote self-employment and small business creation across Tamil Nadu.",
    "trackingNote": null,
    "manifestoQuote": "Every young person in Tamil Nadu who wishes to start a business will have access to interest-free loans to turn their dreams into reality.",
    "sector": {
      "id": "s5",
      "name": "Youth & Employment",
      "nameTa": "இளைஞர் & வேலைவாய்ப்பு",
      "icon": "briefcase",
      "color": "#F59E0B"
    },
    "status": "pending",
    "icon": "briefcase",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation referencing youth employment and entrepreneurship as priority commitment."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p13",
    "slug": "housing-landless-homeless-poor-13",
    "title": "Government housing for landless and homeless families",
    "titleTa": "நிலமற்ற, வீடற்ற குடும்பங்களுக்கு அரசு வீட்டுவசதி",
    "description": "Construction and allocation of government housing units to all landless and homeless families in Tamil Nadu, prioritising rural poor, Dalits, and tribal communities.",
    "trackingNote": null,
    "manifestoQuote": "No family in Tamil Nadu will be without a roof over their head. The TVK government will build housing for all homeless and landless citizens.",
    "sector": {
      "id": "s12",
      "name": "Housing",
      "nameTa": "வீட்டுவசதி",
      "icon": "home",
      "color": "#A78BFA"
    },
    "status": "pending",
    "icon": "home",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation referencing housing for homeless and landless families."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p14",
    "slug": "farm-loan-waiver-small-marginal-farmers-14",
    "title": "Agricultural loan waiver for small and marginal farmers",
    "titleTa": "சிறு, குறு விவசாயிகளுக்கு விவசாயக் கடன் தள்ளுபடி",
    "description": "Complete waiver of outstanding agricultural loans for small and marginal farmers across Tamil Nadu to provide debt relief and restore farmer livelihoods.",
    "trackingNote": null,
    "manifestoQuote": "Farmers who built this nation deserve freedom from debt. All small and marginal farmers will receive a complete loan waiver from the TVK government.",
    "sector": {
      "id": "s6",
      "name": "Agriculture & Farmers",
      "nameTa": "விவசாயம் & விவசாயிகள்",
      "icon": "tractor",
      "color": "#84CC16"
    },
    "status": "pending",
    "icon": "tractor",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation coverage referencing farmer loan waiver as a key manifesto commitment."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p15",
    "slug": "free-education-lkg-to-degree-15",
    "title": "Free education from LKG to undergraduate degree",
    "titleTa": "LKG முதல் பட்டப்படிப்பு வரை இலவசக் கல்வி",
    "description": "Provision of completely free education — from Lower Kindergarten through to undergraduate degree level — in all government institutions, eliminating all fees, examination charges, and incidental costs.",
    "trackingNote": null,
    "manifestoQuote": "Education is a right. From LKG to degree, every child in Tamil Nadu will study for free in government institutions under the TVK government.",
    "sector": {
      "id": "s2",
      "name": "Education",
      "nameTa": "கல்வி",
      "icon": "graduation-cap",
      "color": "#3B82F6"
    },
    "status": "pending",
    "icon": "graduation-cap",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation referencing free education commitment. Higher Education portfolio allocated to Congress ally P. Vishnuvanatan."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p16",
    "slug": "msp-paddy-agricultural-produce-16",
    "title": "Guaranteed Minimum Support Price for paddy and crops",
    "titleTa": "நெல் மற்றும் விளை பொருட்களுக்கு உறுதியான குறைந்தபட்ச ஆதரவு விலை",
    "description": "Guarantee a remunerative Minimum Support Price (MSP) for paddy and other key agricultural produce, with state procurement centres ensuring farmers are not forced to sell below cost.",
    "trackingNote": null,
    "manifestoQuote": "No farmer will sell their produce below cost under the TVK government. We will guarantee a fair MSP and procure directly at that price.",
    "sector": {
      "id": "s6",
      "name": "Agriculture & Farmers",
      "nameTa": "விவசாயம் & விவசாயிகள்",
      "icon": "tractor",
      "color": "#84CC16"
    },
    "status": "pending",
    "icon": "scale",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation referencing agricultural MSP as a farmer welfare commitment."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p17",
    "slug": "unemployment-allowance-educated-youth-17",
    "title": "Monthly unemployment allowance for educated job-seekers",
    "titleTa": "படித்த வேலையில்லா இளைஞர்களுக்கு வேலையின்மை கொடுப்பனவு",
    "description": "A monthly unemployment allowance to be paid to educated youth registered in the employment exchange who are unable to find suitable employment, as a temporary financial bridge.",
    "trackingNote": null,
    "manifestoQuote": "No educated young person in Tamil Nadu should go hungry while waiting for a job. The TVK government will provide a monthly unemployment allowance.",
    "sector": {
      "id": "s5",
      "name": "Youth & Employment",
      "nameTa": "இளைஞர் & வேலைவாய்ப்பு",
      "icon": "briefcase",
      "color": "#F59E0B"
    },
    "status": "pending",
    "icon": "briefcase",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation coverage referencing youth employment commitments."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p18",
    "slug": "neet-exemption-state-medical-admissions-18",
    "title": "NEET exemption — state-level medical college admissions",
    "titleTa": "நீட் விலக்கு — மாநில மருத்துவக் கல்லூரி சேர்க்கை",
    "description": "Push for a permanent exemption from NEET (National Eligibility cum Entrance Test) for Tamil Nadu medical college admissions, reverting to the state board merit-based system to protect rural and socially disadvantaged students.",
    "trackingNote": null,
    "manifestoQuote": "NEET is a tool of discrimination against Tamil Nadu's students. The TVK government will fight for a permanent NEET exemption through legislation and legal action.",
    "sector": {
      "id": "s2",
      "name": "Education",
      "nameTa": "கல்வி",
      "icon": "graduation-cap",
      "color": "#3B82F6"
    },
    "status": "pending",
    "icon": "graduation-cap",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation coverage — Higher Education portfolio allocated to Congress MLA P. Vishnuvanatan. NEET exemption is a core TVK-Congress alliance commitment."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p19",
    "slug": "sc-st-welfare-fund-scholarship-enhancement-19",
    "title": "Enhanced SC/ST welfare fund and scholarship programme",
    "titleTa": "தலித் & பழங்குடியினருக்கு மேம்படுத்தப்பட்ட நலத்திட்டம்",
    "description": "Substantial increase in the state welfare fund, scholarships, and reservation implementation support for Scheduled Caste (SC) and Scheduled Tribe (ST) communities across Tamil Nadu.",
    "trackingNote": "Tamil Nadu cabinet has best-ever SC representation — 22 ministers under age 45 and strong SC/ST presence (The Hindu, May 2026).",
    "manifestoQuote": "The TVK government will ensure that Dalit and tribal communities receive full constitutional rights, enhanced welfare funds, and zero-tolerance enforcement of reservation policies.",
    "sector": {
      "id": "s11",
      "name": "SC/ST Welfare",
      "nameTa": "தலித் & பழங்குடி நலன்",
      "icon": "users",
      "color": "#F97316"
    },
    "status": "pending",
    "icon": "users",
    "sources": [
      {
        "title": "Historic shift — Vijay's cabinet marks Tamil Nadu's best SC representation till date",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/historic-shift-vijays-cabinet-marks-tamil-nadus-best-sc-representation-till-date/article71007377.ece",
        "publication": "The Hindu",
        "date": "2026-05-22",
        "tier": 3,
        "summary": "Tamil Nadu cabinet marks best-ever SC representation with 22 ministers aged under 45 among the expanded 35-member ministry."
      }
    ],
    "lastUpdated": "2026-05-22T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p20",
    "slug": "minimum-wage-hike-unorganised-workers-20",
    "title": "Minimum wage hike for unorganised sector workers",
    "titleTa": "அமைப்புசாரா துறை தொழிலாளர்களுக்கு குறைந்தபட்ச ஊதிய உயர்வு",
    "description": "A significant revision and hike in the minimum wage for workers in the unorganised sector including construction, agricultural labour, domestic workers, and daily wage earners.",
    "trackingNote": null,
    "manifestoQuote": "Every worker in Tamil Nadu deserves a living wage. The TVK government will revise minimum wages to ensure dignity and economic security for all workers.",
    "sector": {
      "id": "s10",
      "name": "Labour & Workers",
      "nameTa": "தொழிலாளர் நலன்",
      "icon": "hard-hat",
      "color": "#64748B"
    },
    "status": "pending",
    "icon": "hard-hat",
    "sources": [
      {
        "title": "TVK government formation — key manifesto promises",
        "url": "https://www.thehindu.com/news/national/tamil-nadu/tamil-nadu-government-formation-know-the-tvk-ministers-in-c-joseph-vijays-cabinet/article70961530.ece",
        "publication": "The Hindu",
        "date": "2026-05-10",
        "tier": 3,
        "summary": "TVK government formation referencing labour and worker welfare commitments."
      }
    ],
    "lastUpdated": "2026-05-10T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p21",
    "slug": "womens-self-help-group-economic-empowerment-21",
    "title": "Strengthen Women's Self-Help Groups with increased revolving fund",
    "titleTa": "மகளிர் சுய உதவிக் குழுக்களுக்கு அதிகரிக்கப்பட்ட சுழலும் நிதி",
    "description": "Significant enhancement of revolving funds and credit linkages for Women's Self-Help Groups (SHGs) across Tamil Nadu to boost women's economic independence and rural entrepreneurship.",
    "trackingNote": "Women's Welfare portfolio retained by CM Vijay directly (May 16, 2026 portfolio allocation).",
    "manifestoQuote": "Tamil Nadu's women are the backbone of our economy. The TVK government will massively strengthen self-help groups with enhanced revolving funds.",
    "sector": {
      "id": "s1",
      "name": "Women & Welfare",
      "nameTa": "பெண்கள் & நலன்",
      "icon": "users",
      "color": "#EC4899"
    },
    "status": "pending",
    "icon": "users",
    "sources": [
      {
        "title": "Tamil Nadu Cabinet portfolio allocation — CM Vijay retains Women's Welfare",
        "url": "https://www.ndtv.com/india-news/tamil-nadu-ministries-vijay-keeps-home-changes-finance-full-list-11526929",
        "publication": "NDTV",
        "date": "2026-05-16",
        "tier": 3,
        "summary": "After the cabinet expansion, CM Vijay retained the Women's Welfare portfolio among the key departments he kept for himself."
      }
    ],
    "lastUpdated": "2026-05-16T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  },

  {
    "id": "p22",
    "slug": "sports-infrastructure-youth-development-22",
    "title": "Sports infrastructure development and youth talent programme",
    "titleTa": "விளையாட்டு உள்கட்டமைப்பு & இளைஞர் திறன் மேம்பாடு",
    "description": "Development of world-class sports infrastructure at district level and a structured talent identification and training programme to develop Tamil Nadu's sportspersons at national and international levels.",
    "trackingNote": "Youth Welfare portfolio retained by CM Vijay directly (May 16, 2026 portfolio allocation).",
    "manifestoQuote": "Every district in Tamil Nadu will have sports infrastructure. The TVK government will invest in our youth's sporting potential.",
    "sector": {
      "id": "s5",
      "name": "Youth & Employment",
      "nameTa": "இளைஞர் & வேலைவாய்ப்பு",
      "icon": "activity",
      "color": "#F59E0B"
    },
    "status": "pending",
    "icon": "activity",
    "sources": [
      {
        "title": "Tamil Nadu Cabinet portfolio allocation — CM Vijay retains Youth Welfare",
        "url": "https://www.ndtv.com/india-news/tamil-nadu-ministries-vijay-keeps-home-changes-finance-full-list-11526929",
        "publication": "NDTV",
        "date": "2026-05-16",
        "tier": 3,
        "summary": "CM Vijay retained the Youth Welfare portfolio among key departments he kept for himself after the full cabinet expansion."
      }
    ],
    "lastUpdated": "2026-05-16T00:00:00.000Z",
    "createdAt": "2026-05-10T00:00:00.000Z"
  }

];

const outPath = require('path').join(__dirname, '..', 'data', 'promises.json');
require('fs').writeFileSync(outPath, JSON.stringify(promises, null, 2), 'utf8');
console.log(`✓ Written ${promises.length} real TVK promises to data/promises.json`);
console.log(`  Fulfilled: ${promises.filter(p => p.status === 'fulfilled').length}`);
console.log(`  In Progress: ${promises.filter(p => p.status === 'in-progress').length}`);
console.log(`  Pending: ${promises.filter(p => p.status === 'pending').length}`);
