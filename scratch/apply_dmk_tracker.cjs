// apply_dmk_tracker.cjs
// Applies all DMK Manifesto Tracker (rganand.com) updates:
//   1. Fix dmk-086 status: in-progress -> fulfilled
//   2. Add tracker source to 12 existing promises
//   3. Add 32 new promises (dmk-111 to dmk-142)

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'dmk-promises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const TRACKER_SOURCE = {
  title: "DMK's Manifesto Tracker: Promises vs. Performance (2021–2025)",
  url: "https://rganand.com/images/publications/DMK_manifesto_tracker.pdf",
  publication: "Dr. R.G. Anand (Independent Analysis)",
  date: "2025-05-01",
  tier: 2,
  summary: "Third-party tracker of 500+ DMK 2021 manifesto promises. Classifies each as Fully Implemented (~36%), Partially Implemented (~42%), or Not Implemented (~22%)."
};

// ────────────────────────────────────────────────────────────
// STEP 1: Fix dmk-086 status + update trackingNote
// ────────────────────────────────────────────────────────────
const p86 = data.find(p => p.id === 'dmk-086');
if (p86) {
  p86.status = 'fulfilled';
  p86.trackingNote = "Innuyir Kappom – Nammai Kakkum 48 scheme launched 2021: free emergency cashless treatment for road accident victims during the first 48 hours. Fully operational across government hospitals statewide.";
  p86.lastUpdated = '2026-06-07';
  console.log('✅ Fixed dmk-086 status → fulfilled');
}

// ────────────────────────────────────────────────────────────
// STEP 2: Add tracker source to existing promises
// ────────────────────────────────────────────────────────────
const addSource = (id) => {
  const p = data.find(p => p.id === id);
  if (!p) { console.warn(`⚠️  ${id} not found`); return; }
  const alreadyAdded = p.sources.some(s => s.url === TRACKER_SOURCE.url);
  if (!alreadyAdded) {
    p.sources.push({ ...TRACKER_SOURCE });
    p.lastUpdated = '2026-06-07';
    console.log(`✅ Added tracker source to ${id}`);
  }
};

[
  'dmk-001', // ₹1,000 for women
  'dmk-002', // Free bus travel
  'dmk-003', // CM Breakfast Scheme
  'dmk-005', // Illam Thedi Kalvi
  'dmk-006', // Naan Mudhalvan
  'dmk-009', // Old age pension
  'dmk-010', // 20 lakh jobs
  'dmk-014', // Kalaignar Health Insurance
  'dmk-019', // Chennai Metro Phase 2
  'dmk-086', // Cashless accident treatment
  'dmk-092', // Free laptops
  'dmk-097', // Foundational literacy
].forEach(addSource);

// ────────────────────────────────────────────────────────────
// STEP 3: Build 32 new promise objects
// ────────────────────────────────────────────────────────────
const BASE_SOURCES = (manifestoNote, trackerNote) => {
  const s = [
    {
      title: "DMK Manifesto 2021 – English",
      url: "https://dmk.blob.core.windows.net/website/assets/DMK_Manifesto2021_English_809d88d084",
      publication: "DMK Official",
      date: "2021-03-01",
      tier: 1,
      summary: manifestoNote || "Original manifesto promise."
    },
    {
      ...TRACKER_SOURCE,
      summary: trackerNote || TRACKER_SOURCE.summary
    }
  ];
  return s;
};

const newPromises = [
  // ── Welfare & Subsidies ──────────────────────────────────
  {
    id: "dmk-111",
    slug: "rs-4000-one-time-relief-ration-card-holders",
    partyId: "dmk",
    title: "₹4,000 one-time financial assistance to all ration card holders",
    titleTa: "",
    description: "A one-time payment of ₹4,000 to every ration card-holding family as immediate financial relief, promised on assuming office.",
    trackingNote: "Disbursed in 2021 shortly after the DMK government took office. Reached over 2 crore families. Fully implemented.",
    manifestoQuote: "₹4,000 will be provided as immediate financial assistance to all ration card holders.",
    sector: { id: "s4", name: "Social Security", nameTa: "", icon: "shield", color: "#8B5CF6" },
    status: "fulfilled",
    icon: "shield",
    sources: BASE_SOURCES("Original manifesto promise – ₹4,000 one-time relief.", "Tracker confirms: Fully Implemented."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-112",
    slug: "lpg-cylinder-100-rupee-subsidy",
    partyId: "dmk",
    title: "₹100 subsidy per LPG cylinder",
    titleTa: "",
    description: "A subsidy of ₹100 per LPG cooking gas cylinder to be provided to all households, reducing the burden of rising fuel prices.",
    trackingNote: "Only limited/partial implementation reported. Consistent ₹100 per cylinder subsidy not fully sustained due to global LPG price volatility.",
    manifestoQuote: "A subsidy of ₹100 per LPG cylinder will be provided to all households.",
    sector: { id: "s4", name: "Social Security", nameTa: "", icon: "shield", color: "#8B5CF6" },
    status: "modified",
    icon: "shield",
    sources: BASE_SOURCES("Original manifesto promise – ₹100 LPG subsidy.", "Tracker: Partially Implemented — limited consistent coverage reported."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-113",
    slug: "reduce-petrol-diesel-prices",
    partyId: "dmk",
    title: "Reduce petrol by ₹5 and diesel by ₹4 per litre",
    titleTa: "",
    description: "State VAT reduction to cut retail petrol prices by ₹5 per litre and diesel by ₹4 per litre, providing direct relief to consumers.",
    trackingNote: "State government reduced petrol by ₹3/litre and diesel by ₹3/litre (not ₹5/₹4 as promised). Partial but not full relief delivered.",
    manifestoQuote: "The price of petrol will be reduced by ₹5 and diesel by ₹4 per litre.",
    sector: { id: "s4", name: "Social Security", nameTa: "", icon: "shield", color: "#8B5CF6" },
    status: "modified",
    icon: "shield",
    sources: BASE_SOURCES("Original manifesto promise – fuel price reduction.", "Tracker: Implemented at ₹3/₹3 reduction, not the full ₹5/₹4 promised."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-114",
    slug: "reduce-aavin-milk-price",
    partyId: "dmk",
    title: "Reduce Aavin milk price by ₹3 per litre",
    titleTa: "",
    description: "The price of Aavin brand milk sold through government cooperatives to be reduced by ₹3 per litre to make dairy products more affordable.",
    trackingNote: "Price reduction of ₹3 per litre on Aavin milk was implemented after the DMK government assumed office. Fully implemented.",
    manifestoQuote: "The price of Aavin milk will be reduced by ₹3 per litre.",
    sector: { id: "s4", name: "Social Security", nameTa: "", icon: "shield", color: "#8B5CF6" },
    status: "fulfilled",
    icon: "shield",
    sources: BASE_SOURCES("Original manifesto promise – Aavin milk price reduction.", "Tracker: Fully Implemented — ₹3/litre reduction carried out."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-115",
    slug: "kalaignar-unavagam-500-canteens",
    partyId: "dmk",
    title: "Kalaignar Unavagam – 500 subsidized food canteens across Tamil Nadu",
    titleTa: "",
    description: "Establish 500 Kalaignar Unavagam subsidized food canteens offering affordable nutritious meals to the public, especially daily wage workers and the urban poor.",
    trackingNote: "Several canteens have been established and are operational, but the target of 500 statewide is yet to be fully achieved. Ongoing expansion.",
    manifestoQuote: "500 Kalaignar Unavagam canteens will be set up across Tamil Nadu to provide subsidized food.",
    sector: { id: "s4", name: "Social Security", nameTa: "", icon: "shield", color: "#8B5CF6" },
    status: "in-progress",
    icon: "shield",
    sources: BASE_SOURCES("Original manifesto promise – Kalaignar Unavagam.", "Tracker: Partially Implemented — canteens launched but 500-target not yet met."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-116",
    slug: "extend-maternity-leave-12-months",
    partyId: "dmk",
    title: "Extend maternity leave for women employees to 12 months",
    titleTa: "",
    description: "Increase paid maternity leave entitlement for working women to 12 months, supporting mother and child welfare and encouraging female workforce participation.",
    trackingNote: "Extension to 12 months announced for government employees, but full implementation across all public and private sectors is pending.",
    manifestoQuote: "Maternity leave for women will be extended to 12 months.",
    sector: { id: "s5", name: "Women & Child", nameTa: "", icon: "users", color: "#EC4899" },
    status: "in-progress",
    icon: "users",
    sources: BASE_SOURCES("Original manifesto promise – maternity leave extension.", "Tracker: Partially Implemented — announced for government sector; private sector coverage pending."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Education ────────────────────────────────────────────
  {
    id: "dmk-117",
    slug: "neet-exemption-state-law",
    partyId: "dmk",
    title: "Pass a law to exempt Tamil Nadu students from NEET",
    titleTa: "",
    description: "Enact state legislation to exempt Tamil Nadu students from the National Eligibility cum Entrance Test (NEET) for MBBS admissions, allowing state-based merit criteria.",
    trackingNote: "State assembly passed the NEET exemption bill. However, it requires Presidential assent (central government approval) which has not been granted. Effectively stalled at the central level.",
    manifestoQuote: "A law will be enacted to exempt Tamil Nadu from NEET examination for medical admissions.",
    sector: { id: "s2", name: "Education", nameTa: "", icon: "graduation-cap", color: "#0EA5E9" },
    status: "stalled",
    icon: "graduation-cap",
    sources: BASE_SOURCES("Original manifesto promise – NEET exemption.", "Tracker: Not Implemented — state bill passed but central approval withheld."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-118",
    slug: "free-tablets-with-data-government-school-students",
    partyId: "dmk",
    title: "Distribute free tablets with internet data to government school students",
    titleTa: "",
    description: "Provide free tablets loaded with educational content and with prepaid internet data to all students in government schools, bridging the digital divide.",
    trackingNote: "Distribution started in phases from 2022 onwards. Older class students prioritized. Full coverage across all government school students is still ongoing.",
    manifestoQuote: "Free tablets with data will be given to all government school students.",
    sector: { id: "s2", name: "Education", nameTa: "", icon: "graduation-cap", color: "#0EA5E9" },
    status: "in-progress",
    icon: "graduation-cap",
    sources: BASE_SOURCES("Original manifesto promise – free tablets.", "Tracker: Partially Implemented — phased distribution started; full coverage pending."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-119",
    slug: "waive-education-loans-under-30",
    partyId: "dmk",
    title: "Waive education loans for students under 30 years of age",
    titleTa: "",
    description: "Complete waiver of outstanding educational loans for students aged below 30, providing financial relief to first-generation graduates burdened by debt.",
    trackingNote: "Measures to ease repayment have been introduced (interest subsidies, extended moratoriums) but a complete blanket waiver for all eligible students is not fully in place.",
    manifestoQuote: "Education loans for students below the age of 30 will be waived.",
    sector: { id: "s2", name: "Education", nameTa: "", icon: "graduation-cap", color: "#0EA5E9" },
    status: "in-progress",
    icon: "graduation-cap",
    sources: BASE_SOURCES("Original manifesto promise – education loan waiver.", "Tracker: Partially Implemented — interest relief given; full waiver pending."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-120",
    slug: "separate-state-education-policy-tamil-nadu",
    partyId: "dmk",
    title: "Formulate a separate State Education Policy for Tamil Nadu",
    titleTa: "",
    description: "Develop and implement a Tamil Nadu-specific education policy distinct from the National Education Policy (NEP 2020), aligned with the state's social justice and language priorities.",
    trackingNote: "A high-level committee was constituted by the state government to formulate a separate Tamil Nadu education policy. Committee has submitted its report.",
    manifestoQuote: "A separate education policy will be formulated for Tamil Nadu.",
    sector: { id: "s2", name: "Education", nameTa: "", icon: "graduation-cap", color: "#0EA5E9" },
    status: "fulfilled",
    icon: "graduation-cap",
    sources: BASE_SOURCES("Original manifesto promise – state education policy.", "Tracker: Fully Implemented — high-level committee constituted and report submitted."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Employment & Economy ────────────────────────────────
  {
    id: "dmk-121",
    slug: "75-percent-reservation-private-industry-locals",
    partyId: "dmk",
    title: "75% reservation for local workers in private industries",
    titleTa: "",
    description: "Legislation to mandate that private industries operating in Tamil Nadu reserve 75% of their jobs for Tamil Nadu residents, protecting local employment.",
    trackingNote: "No legislation enacted. The proposal has faced significant legal and constitutional challenges. Industry opposition and court stays have prevented implementation.",
    manifestoQuote: "75% of jobs in industries will be reserved for people of Tamil Nadu.",
    sector: { id: "s6", name: "Employment", nameTa: "", icon: "briefcase", color: "#F59E0B" },
    status: "not-fulfilled",
    icon: "briefcase",
    sources: BASE_SOURCES("Original manifesto promise – local job reservation.", "Tracker: Not Implemented — legal challenges prevent enactment."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-122",
    slug: "right-to-skill-training-act",
    partyId: "dmk",
    title: "Enact Right to Skill Training Act for marginalized groups",
    titleTa: "",
    description: "Legislate a Right to Skill Training Act guaranteeing skill development opportunities to SC/ST, women, and other marginalized groups, with assured job or self-employment placement.",
    trackingNote: "Skill development programs under Naan Mudhalvan and other schemes have been expanded. Formal enactment of a standalone Right to Skill Training Act is pending.",
    manifestoQuote: "A Right to Skill Training Act will be enacted to ensure skill training for all marginalized groups.",
    sector: { id: "s6", name: "Employment", nameTa: "", icon: "briefcase", color: "#F59E0B" },
    status: "in-progress",
    icon: "briefcase",
    sources: BASE_SOURCES("Original manifesto promise – Right to Skill Training Act.", "Tracker: Partially Implemented — programs running; formal act not yet passed."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-123",
    slug: "interest-free-loans-women-cottage-industries",
    partyId: "dmk",
    title: "₹50,000 interest-free loans to 1 lakh women for cottage industries",
    titleTa: "",
    description: "Provide ₹50,000 interest-free startup loans to 1 lakh women entrepreneurs to establish cottage and micro-enterprises, empowering women economically.",
    trackingNote: "Loan schemes have been introduced through Tamil Nadu Corporation for Development of Women (TNCDW) and SHG channels. Reaching the full 1 lakh beneficiary target is ongoing.",
    manifestoQuote: "₹50,000 interest-free loans will be given to 1 lakh women for starting cottage industries.",
    sector: { id: "s5", name: "Women & Child", nameTa: "", icon: "users", color: "#EC4899" },
    status: "in-progress",
    icon: "users",
    sources: BASE_SOURCES("Original manifesto promise – interest-free women entrepreneurs loan.", "Tracker: Partially Implemented — schemes active; 1L target in progress."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-124",
    slug: "low-interest-loans-first-generation-engineering-graduates",
    partyId: "dmk",
    title: "Low-interest business loans for first-generation engineering graduates",
    titleTa: "",
    description: "Provide concessional business startup loans to first-generation engineering graduates from underprivileged families, enabling entrepreneurship among technically qualified youth.",
    trackingNote: "Financial assistance programs through EDII-TN and SIDCO have been initiated. Comprehensive statewide coverage is still ongoing.",
    manifestoQuote: "Business loans at low interest will be given to first-generation engineering graduates to start their own enterprises.",
    sector: { id: "s6", name: "Employment", nameTa: "", icon: "briefcase", color: "#F59E0B" },
    status: "in-progress",
    icon: "briefcase",
    sources: BASE_SOURCES("Original manifesto promise – startup loans for engineers.", "Tracker: Partially Implemented — programs launched; full coverage ongoing."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Agriculture & Farmers ───────────────────────────────
  {
    id: "dmk-125",
    slug: "rs-10000-subsidy-farmers-irrigation-motors",
    partyId: "dmk",
    title: "₹10,000 subsidy to farmers for purchasing new irrigation motors",
    titleTa: "",
    description: "Provide a ₹10,000 direct subsidy to farmers for purchasing new irrigation pump sets and motors, reducing the cost of agricultural water management.",
    trackingNote: "Subsidies provided to farmers for pump sets through agriculture department schemes. Full statewide coverage of the ₹10,000 per farmer target is partially implemented.",
    manifestoQuote: "A subsidy of ₹10,000 will be given to farmers for purchasing new motors for irrigation.",
    sector: { id: "s1", name: "Agriculture", nameTa: "", icon: "wheat", color: "#65A30D" },
    status: "in-progress",
    icon: "wheat",
    sources: BASE_SOURCES("Original manifesto promise – irrigation motor subsidy.", "Tracker: Partially Implemented — subsidies given to some farmers; full coverage pending."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-126",
    slug: "separate-agriculture-budget-tamil-nadu",
    partyId: "dmk",
    title: "Present a separate Agriculture Budget for Tamil Nadu",
    titleTa: "",
    description: "Present an independent dedicated Agriculture Budget separate from the General Budget, focusing solely on farming sector priorities, welfare, and investment.",
    trackingNote: "Tamil Nadu presented its first-ever separate Agriculture Budget in 2022. Continued annually. Promise fully delivered.",
    manifestoQuote: "A separate Agriculture Budget will be presented to demonstrate the government's commitment to the farming sector.",
    sector: { id: "s1", name: "Agriculture", nameTa: "", icon: "wheat", color: "#65A30D" },
    status: "fulfilled",
    icon: "wheat",
    sources: BASE_SOURCES("Original manifesto promise – separate Agriculture Budget.", "Tracker: Fully Implemented — first separate agriculture budget presented in 2022."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-127",
    slug: "coconut-development-centers-pollachi-pattukottai",
    partyId: "dmk",
    title: "Establish coconut development sub-regional centres in Pollachi and Pattukottai",
    titleTa: "",
    description: "Set up sub-regional coconut development centres in Pollachi (Coimbatore district) and Pattukottai (Thanjavur district) to support coconut farmers with research, processing and marketing.",
    trackingNote: "Plans announced and land identified for centres. Operational status of both centres is still in progress.",
    manifestoQuote: "Sub-regional centres for coconut development will be established in Pollachi and Pattukottai.",
    sector: { id: "s1", name: "Agriculture", nameTa: "", icon: "wheat", color: "#65A30D" },
    status: "in-progress",
    icon: "wheat",
    sources: BASE_SOURCES("Original manifesto promise – coconut development centres.", "Tracker: Partially Implemented — plans made; centres not yet fully operational."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-128",
    slug: "turmeric-research-institute-erode",
    partyId: "dmk",
    title: "Set up a state-of-the-art Turmeric Research Institute in Erode",
    titleTa: "",
    description: "Establish a dedicated Turmeric Research Institute in Erode — the country's largest turmeric trading hub — to improve crop varieties, processing technology and farmer incomes.",
    trackingNote: "Proposal has been made and included in budget announcements. The institute's physical establishment is in progress. Not yet operational.",
    manifestoQuote: "A world-class Turmeric Research Institute will be established in Erode.",
    sector: { id: "s1", name: "Agriculture", nameTa: "", icon: "wheat", color: "#65A30D" },
    status: "in-progress",
    icon: "wheat",
    sources: BASE_SOURCES("Original manifesto promise – Turmeric Research Institute, Erode.", "Tracker: Partially Implemented — proposal made; institute not yet operational."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-129",
    slug: "salem-mecheri-thoni-maduvu-irrigation-projects",
    partyId: "dmk",
    title: "Implement Salem Mecheri and Salem Thoni Maduvu irrigation projects",
    titleTa: "",
    description: "Complete the long-pending Salem Mecheri and Salem Thoni Maduvu irrigation schemes to bring water to drought-prone farmlands in Salem district.",
    trackingNote: "Civil works on both projects have commenced. Completion and full water distribution is pending.",
    manifestoQuote: "The Salem Mecheri and Salem Thoni Maduvu irrigation projects will be implemented to bring water to farmers.",
    sector: { id: "s1", name: "Agriculture", nameTa: "", icon: "wheat", color: "#65A30D" },
    status: "in-progress",
    icon: "wheat",
    sources: BASE_SOURCES("Original manifesto promise – Salem irrigation projects.", "Tracker: Partially Implemented — works commenced; completion pending."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Infrastructure & Urban Development ─────────────────
  {
    id: "dmk-130",
    slug: "convert-ground-level-bridges-high-level",
    partyId: "dmk",
    title: "Convert all ground-level bridges to high-level bridges to prevent flooding",
    titleTa: "",
    description: "Replace existing low-level / submersible road bridges across Tamil Nadu with high-level bridges to prevent road disruption and loss of life during monsoon flooding.",
    trackingNote: "State has upgraded several bridges in flood-prone districts. Statewide conversion of all ground-level bridges is ongoing across multiple phases.",
    manifestoQuote: "All ground-level bridges will be converted into high-level bridges to prevent flooding and ensure road connectivity during rains.",
    sector: { id: "s8", name: "Infrastructure", nameTa: "", icon: "building", color: "#0891B2" },
    status: "in-progress",
    icon: "building",
    sources: BASE_SOURCES("Original manifesto promise – bridge upgradation.", "Tracker: Partially Implemented — some bridges upgraded; statewide completion ongoing."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-131",
    slug: "riverfront-beautification-cauvery-vaigai",
    partyId: "dmk",
    title: "Create dedicated commissions for Cauvery and Vaigai riverfront beautification",
    titleTa: "",
    description: "Establish separate commissions or authorities to undertake systematic beautification, restoration and maintenance of the Cauvery and Vaigai riverfronts for public benefit.",
    trackingNote: "Beautification projects initiated at select stretches of both Cauvery (Trichy, Karur) and Vaigai (Madurai). Dedicated commissions as originally promised are still being structured.",
    manifestoQuote: "Separate commissions will be set up for the beautification of Cauvery and Vaigai riverfronts.",
    sector: { id: "s8", name: "Infrastructure", nameTa: "", icon: "building", color: "#0891B2" },
    status: "in-progress",
    icon: "building",
    sources: BASE_SOURCES("Original manifesto promise – riverfront beautification.", "Tracker: Partially Implemented — projects initiated in select areas; commissions still being formalised."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-132",
    slug: "stormwater-drainage-all-municipalities",
    partyId: "dmk",
    title: "Construct stormwater drainage systems in all municipalities",
    titleTa: "",
    description: "Build comprehensive underground stormwater drainage networks in every municipality and town panchayat in Tamil Nadu to prevent urban flooding.",
    trackingNote: "Stormwater drain projects sanctioned and underway in Chennai and several district towns under AMRUT and state funds. Complete coverage of all municipalities is in progress.",
    manifestoQuote: "Stormwater drainage systems will be constructed in all municipalities to prevent flooding.",
    sector: { id: "s8", name: "Infrastructure", nameTa: "", icon: "building", color: "#0891B2" },
    status: "in-progress",
    icon: "building",
    sources: BASE_SOURCES("Original manifesto promise – stormwater drainage.", "Tracker: Partially Implemented — several municipalities covered; full completion ongoing."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Digital Governance & State Rights ──────────────────
  {
    id: "dmk-133",
    slug: "right-to-services-act-government-delivery",
    partyId: "dmk",
    title: "Enact Right to Services Act for timely government service delivery",
    titleTa: "",
    description: "Pass a Right to Services Act setting legally binding time limits for government service delivery, with penalties for delays, ensuring accountability in public administration.",
    trackingNote: "Efforts underway to streamline service delivery timelines. Formal enactment of a standalone Right to Services Act is pending.",
    manifestoQuote: "A Right to Services Act will be implemented to ensure timely delivery of all government services to citizens.",
    sector: { id: "s9", name: "Governance", nameTa: "", icon: "landmark", color: "#64748B" },
    status: "in-progress",
    icon: "landmark",
    sources: BASE_SOURCES("Original manifesto promise – Right to Services Act.", "Tracker: Partially Implemented — administrative measures taken; formal act not yet passed."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-134",
    slug: "live-telecast-assembly-proceedings",
    partyId: "dmk",
    title: "Live telecast of Tamil Nadu Legislative Assembly proceedings",
    titleTa: "",
    description: "Broadcast Tamil Nadu Assembly sessions live on television and digital platforms, enabling citizens to watch legislative debates and government accountability in real time.",
    trackingNote: "Assembly proceedings are now being telecast live on state government TV channel and YouTube. Fully implemented, enhancing democratic transparency.",
    manifestoQuote: "Proceedings of the Tamil Nadu Legislative Assembly will be telecast live for public viewing.",
    sector: { id: "s9", name: "Governance", nameTa: "", icon: "landmark", color: "#64748B" },
    status: "fulfilled",
    icon: "landmark",
    sources: BASE_SOURCES("Original manifesto promise – live telecast of assembly.", "Tracker: Fully Implemented — live telecast operational."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-135",
    slug: "ungal-thoguthiyil-mudhalamaichar-cm-grievance",
    partyId: "dmk",
    title: "Ungal Thoguthiyil Mudhalamaichar – Chief Minister's constituency grievance initiative",
    titleTa: "",
    description: "Launch a programme where the Chief Minister personally visits constituencies to hear and resolve public grievances, ensuring direct accountability between government and citizens.",
    trackingNote: "Launched in 2021. Over 2.3 lakh public grievances addressed within the first 100 days. Programme has continued regularly across districts.",
    manifestooQuote: "The Chief Minister will visit every constituency to hear and solve the public's problems directly.",
    manifestoQuote: "The Chief Minister will visit every constituency to hear and solve the public's problems directly.",
    sector: { id: "s9", name: "Governance", nameTa: "", icon: "landmark", color: "#64748B" },
    status: "fulfilled",
    icon: "landmark",
    sources: BASE_SOURCES("Original manifesto promise – CM constituency visits.", "Tracker: Fully Implemented — 2.3L+ grievances addressed within first 100 days."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Social Justice ───────────────────────────────────────
  {
    id: "dmk-136",
    slug: "advocate-33-percent-women-reservation-parliament",
    partyId: "dmk",
    title: "Advocate for 33% women's reservation in Parliament and state legislatures",
    titleTa: "",
    description: "Urge the central government to pass the Women's Reservation Bill providing 33% seats for women in Parliament and state assemblies.",
    trackingNote: "DMK has consistently and publicly advocated for the women's reservation bill at Parliament. The central government passed the bill in 2023 (Nari Shakti Vandan Adhiniyam), though implementation is deferred to post-delimitation.",
    manifestoQuote: "We will urge the central government to pass the 33% reservation bill for women in Parliament and state assemblies.",
    sector: { id: "s5", name: "Women & Child", nameTa: "", icon: "users", color: "#EC4899" },
    status: "in-progress",
    icon: "users",
    sources: BASE_SOURCES("Original manifesto promise – women's Parliamentary reservation.", "Tracker: Implemented — DMK advocated; central bill passed 2023 but operational post-delimitation."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Language, Culture & Identity ────────────────────────
  {
    id: "dmk-137",
    slug: "tamil-co-official-language-central-offices-tn",
    partyId: "dmk",
    title: "Declare Tamil as co-official language in central government offices in Tamil Nadu",
    titleTa: "",
    description: "Press the central government to recognize Tamil as a co-official language for all central government offices and public communications in Tamil Nadu.",
    trackingNote: "The state has formally urged the central government. No central government action or notification has been issued. Remains unimplemented.",
    manifestoQuote: "Tamil will be declared a co-official language in central government offices located in Tamil Nadu.",
    sector: { id: "s7", name: "Language & Culture", nameTa: "", icon: "book-open", color: "#7C3AED" },
    status: "stalled",
    icon: "book-open",
    sources: BASE_SOURCES("Original manifesto promise – Tamil as co-official language.", "Tracker: Not Implemented — central government has not acted on the state's request."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-138",
    slug: "thirukkural-national-textbook-advocacy",
    partyId: "dmk",
    title: "Advocate for Thirukkural to be declared the national textbook of India",
    titleTa: "",
    description: "Urge the Government of India to declare the ancient Tamil classical work Thirukkural as the national textbook, to be introduced in schools across India.",
    trackingNote: "The state government has passed resolutions and raised the demand at national forums. No central government action taken. Remains a symbolic advocacy.",
    manifestoQuote: "We will advocate for Thirukkural to be declared the national textbook of India.",
    sector: { id: "s7", name: "Language & Culture", nameTa: "", icon: "book-open", color: "#7C3AED" },
    status: "stalled",
    icon: "book-open",
    sources: BASE_SOURCES("Original manifesto promise – Thirukkural as national textbook.", "Tracker: Not Implemented — advocacy made; central recognition not granted."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-139",
    slug: "tamil-language-chairs-international-universities",
    partyId: "dmk",
    title: "Establish Tamil language chairs in international universities",
    titleTa: "",
    description: "Fund and establish dedicated Tamil language and literature professorships in universities across the world to promote Tamil globally.",
    trackingNote: "Initiatives taken to establish Tamil chairs in select universities abroad. Wider establishment across multiple international institutions is still in progress.",
    manifestoQuote: "Tamil language chairs will be established in international universities to promote Tamil globally.",
    sector: { id: "s7", name: "Language & Culture", nameTa: "", icon: "book-open", color: "#7C3AED" },
    status: "in-progress",
    icon: "book-open",
    sources: BASE_SOURCES("Original manifesto promise – Tamil chairs in international universities.", "Tracker: Partially Implemented — some initiatives taken; broader establishment ongoing."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-140",
    slug: "semmozhi-poonga-refurbishment-parks-corporations",
    partyId: "dmk",
    title: "Refurbish Semmozhi Poonga and set up similar parks in all municipal corporations",
    titleTa: "",
    description: "Renovate and upgrade the existing Semmozhi Poonga (Classical Language Botanical Garden) in Chennai and establish similar Tamil cultural botanical parks in all municipal corporations across the state.",
    trackingNote: "Refurbishment of Semmozhi Poonga in Chennai has commenced. Plans to replicate in all corporations are in progress.",
    manifestoQuote: "Semmozhi Poonga will be refurbished and similar parks will be set up in all municipal corporations.",
    sector: { id: "s7", name: "Language & Culture", nameTa: "", icon: "book-open", color: "#7C3AED" },
    status: "in-progress",
    icon: "book-open",
    sources: BASE_SOURCES("Original manifesto promise – Semmozhi Poonga and corporation parks.", "Tracker: Partially Implemented — refurbishment started; corporation-level parks in planning."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },

  // ── Environment & Climate ───────────────────────────────
  {
    id: "dmk-141",
    slug: "oppose-methane-shale-gas-cauvery-delta",
    partyId: "dmk",
    title: "Oppose methane and shale gas extraction in the Cauvery Delta region",
    titleTa: "",
    description: "Block all harmful methane and shale gas extraction projects in the Cauvery Delta, which is designated a Protected Agricultural Zone, safeguarding farming and ecology.",
    trackingNote: "Government has consistently opposed such projects and passed resolutions. The Cauvery Delta was declared a Protected Agricultural Zone. Effectively implemented.",
    manifestoQuote: "We will oppose all harmful methane and shale gas projects in the Cauvery Delta region.",
    sector: { id: "s10", name: "Environment", nameTa: "", icon: "leaf", color: "#16A34A" },
    status: "fulfilled",
    icon: "leaf",
    sources: BASE_SOURCES("Original manifesto promise – oppose Delta methane/shale gas.", "Tracker: Fully Implemented — government has opposed all such projects."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  },
  {
    id: "dmk-142",
    slug: "agricultural-biomass-fuel-public-private-partnerships",
    partyId: "dmk",
    title: "Promote agricultural biomass fuel producers through public-private partnerships",
    titleTa: "",
    description: "Encourage the production and use of agricultural biomass as fuel by facilitating public-private partnerships, providing an alternative income source for farmers and promoting clean energy.",
    trackingNote: "Initiatives for biofuel and biomass energy production have been launched under renewable energy and agricultural diversification programmes. Comprehensive statewide PPP rollout is ongoing.",
    manifestoQuote: "Agricultural biomass fuel producers will be encouraged through public-private partnerships.",
    sector: { id: "s10", name: "Environment", nameTa: "", icon: "leaf", color: "#16A34A" },
    status: "in-progress",
    icon: "leaf",
    sources: BASE_SOURCES("Original manifesto promise – biomass fuel PPPs.", "Tracker: Partially Implemented — initiatives launched; full-scale PPP rollout ongoing."),
    lastUpdated: "2026-06-07",
    createdAt: "2026-06-07"
  }
];

// Remove accidental duplicate key in dmk-135
newPromises.forEach(p => { delete p.manifestooQuote; });

// ────────────────────────────────────────────────────────────
// Merge and write
// ────────────────────────────────────────────────────────────
const existingIds = new Set(data.map(p => p.id));
let added = 0;
for (const np of newPromises) {
  if (existingIds.has(np.id)) {
    console.warn(`⚠️  ${np.id} already exists — skipping`);
  } else {
    data.push(np);
    existingIds.add(np.id);
    added++;
    console.log(`✅ Added ${np.id}: ${np.title.substring(0, 60)}`);
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');

console.log('\n─────────────────────────────────────────────');
console.log(`Total promises: ${data.length}`);
console.log(`New promises added: ${added}`);
console.log('Done. Written to data/dmk-promises.json');
