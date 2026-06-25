// Spotless Homes · Florida service-area data
// Each entry powers /locations/:city and /locations/:city/:subcity routes.
//
// Tampa + Clearwater + Saint Petersburg use copy adapted from the live
// www.spotless.homes site. Other cities are rewritten in the same voice.

export const LOCATIONS = {
  tampa: {
    slug: "tampa",
    name: "Tampa",
    state: "FL",
    zip: "33614",
    address: "7508 N Cameron Ave, Tampa, FL 33614",
    phone: "(656) 400-1469",
    phoneRaw: "6564001469",
    heroPhoto: "/assets/cities/tampa.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Tampa, FL",
    intro:
      "Looking for a reliable Tampa maid service? Look no further than Spotless Homes, your premier source for top-notch cleaning services in Tampa. Our house cleaning services for Tampa residents are trusted to deliver consistent results, from occasional deep cleans to ongoing maintenance. Our Tampa maids are trained, insured, and background-checked for your peace of mind.",
    whyParas: [
      "Our routine house cleaning service in Tampa is designed to keep your home fresh, tidy, and stress-free. Whether you live in South Tampa, Seminole Heights, or Westchase, our professional house cleaners deliver consistent results you can trust.",
      "From vacuuming and mopping to disinfecting kitchens and bathrooms, Spotless Homes ensures high-quality service with every visit. We offer flexible scheduling and budget-friendly plans, making regular cleaning in Tampa easy and convenient.",
      "Whether you require weekly support or a complete home transformation, we offer affordable and convenient house cleaning Tampa FL services. Book today and experience what it is like to have an excellent maid service Tampa FL homeowners recommend.",
    ],
    hoodsBlurb:
      "Our trained Tampa maids serve neighborhoods from South Tampa and Hyde Park to Seminole Heights, Westchase, and Carrollwood — with consistent attention to detail across every ZIP.",
    hoods: [
      { slug: "south-tampa",       name: "South Tampa" },
      { slug: "hyde-park",         name: "Hyde Park" },
      { slug: "seminole-heights",  name: "Seminole Heights" },
      { slug: "westchase",         name: "Westchase" },
      { slug: "carrollwood",       name: "Carrollwood" },
      { slug: "ybor-city",         name: "Ybor City" },
    ],
  },

  "saint-petersburg": {
    slug: "saint-petersburg",
    name: "Saint Petersburg",
    state: "FL",
    zip: "33716",
    address: "12001 Dr M.L.K. Jr St N, St. Petersburg, FL 33716",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/saint-petersburg.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Saint Petersburg, FL",
    intro:
      "Require a reliable and professional Saint Petersburg maid service? Our dedicated maids Saint Petersburg offer you superior outcomes on each visit, making your home tidy and renewed. We offer comprehensive house cleaning services Saint Petersburg tailored to your schedule and lifestyle, ranging from one-time deep clean to routine upkeep.",
    whyParas: [
      "Our expert team provides top-rated cleaning services Saint Petersburg, including dusting, mopping, sanitizing, and more — perfect for busy households or anyone who wants to enjoy a clean, stress-free space.",
      "As a trusted provider of house cleaning services Saint Petersburg, we bring efficiency, attention to detail, and a personal touch to every project. Choose a maid service Saint Petersburg that understands your needs.",
      "Book today and experience the difference of professional, local service with a personal touch.",
    ],
    hoodsBlurb:
      "Our trained maids and cleaners serve neighborhoods like Old Northeast, Kenwood, and Snell Isle with exceptional attention to detail. Detailed results across Crescent Heights, Jungle Terrace, and Shore Acres.",
    hoods: [
      { slug: "old-northeast",    name: "Old Northeast" },
      { slug: "kenwood",          name: "Kenwood" },
      { slug: "snell-isle",       name: "Snell Isle" },
      { slug: "crescent-heights", name: "Crescent Heights" },
      { slug: "jungle-terrace",   name: "Jungle Terrace" },
      { slug: "shore-acres",      name: "Shore Acres" },
    ],
  },

  clearwater: {
    slug: "clearwater",
    name: "Clearwater",
    state: "FL",
    zip: "34683",
    address: "2240 Alden Ln, Palm Harbor, FL 34683",
    phone: "(727) 390-8889",
    phoneRaw: "7273908889",
    heroPhoto: "/assets/cities/clearwater.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Clearwater, FL",
    intro:
      "Need a dependable house cleaning service in Clearwater? Spotless Homes delivers exceptional home cleaning services to keep your living space pristine and refreshed. Whether you require a deep cleaning, routine upkeep, or a move-in cleaning service, our skilled team is here to help. As a trusted cleaning company in your area, we are committed to excellence and customer satisfaction.",
    whyParas: [
      "Our routine house cleaning service in Clearwater is tailored to keep your home consistently tidy and refreshed. If you're looking for dependable home cleaning services or professional house cleaners near you, our dedicated team is here to ensure every space remains spotless and welcoming.",
      "From dusting and vacuuming to sanitizing bathrooms and kitchens, we uphold the highest cleaning standards. With flexible scheduling and affordable pricing, maintaining a clean home has never been easier.",
      "Enjoy top-tier house cleaning at competitive rates. Our deep house cleaning service in Clearwater offers a comprehensive, top-to-bottom clean that goes beyond routine upkeep.",
    ],
    hoodsBlurb:
      "Our Clearwater cleaners cover the beach, Belleair, Island Estates, Countryside, and points north into Palm Harbor — with the same standard in every ZIP.",
    hoods: [
      { slug: "clearwater-beach", name: "Clearwater Beach" },
      { slug: "island-estates",   name: "Island Estates" },
      { slug: "belleair",         name: "Belleair" },
      { slug: "countryside",      name: "Countryside" },
      { slug: "downtown",         name: "Downtown Clearwater" },
      { slug: "morningside",      name: "Morningside" },
    ],
  },

  jacksonville: {
    slug: "jacksonville",
    name: "Jacksonville",
    state: "FL",
    zip: "32202",
    address: "Jacksonville, FL · Service area: Duval County",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/jacksonville.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Jacksonville, FL",
    intro:
      "Looking for a trusted Jacksonville maid service? Spotless Homes brings the same family-run, results-first cleaning standard to Duval County that has earned us 4.5★ across 150+ reviews. From the St. Johns River to the beaches, our Jacksonville cleaners are trained, insured, and background-checked.",
    whyParas: [
      "Our routine house cleaning service in Jacksonville is built around your week. Whether you're in Riverside, San Marco, or Atlantic Beach, our professional cleaners deliver consistent results that hold up between visits.",
      "Need something deeper? Our move-in/move-out and deep cleaning services in Jacksonville cover baseboards, inside appliances, and the corners most teams skip — perfect for first cleans, end-of-lease, or seasonal resets.",
      "Book your Jacksonville cleaning service today and find out what it's like to come home to a place you don't have to fix on the weekend.",
    ],
    hoodsBlurb:
      "From Riverside and Avondale up the river to San Marco, and out to Atlantic and Jacksonville Beach — our team covers every Duval ZIP with the same standard.",
    hoods: [
      { slug: "riverside",          name: "Riverside" },
      { slug: "avondale",           name: "Avondale" },
      { slug: "san-marco",          name: "San Marco" },
      { slug: "mandarin",           name: "Mandarin" },
      { slug: "atlantic-beach",     name: "Atlantic Beach" },
      { slug: "jacksonville-beach", name: "Jacksonville Beach" },
    ],
  },

  orlando: {
    slug: "orlando",
    name: "Orlando",
    state: "FL",
    zip: "32801",
    address: "Orlando, FL · Service area: Orange & Seminole Counties",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/orlando.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Orlando, FL",
    intro:
      "Searching for a dependable Orlando maid service? Spotless Homes serves Central Florida with the same vetted team and pay-after-satisfaction promise that built our Tampa Bay reputation. From Winter Park to Lake Nona, our Orlando cleaners are trained, insured, and ready when you are.",
    whyParas: [
      "Our routine house cleaning service in Orlando keeps homes from College Park to Baldwin Park and Audubon Park consistently fresh — dust, vacuum, mop, sanitize the kitchens and baths, and the surfaces that get touched a hundred times a day.",
      "Hosting around the parks? Our Airbnb turnover and short-term-rental cleaning in Orlando keeps your listing five-star ready between guests, with fresh linens, photo-checked staging, and same-day turns when you need them.",
      "Book your Orlando house cleaning today — flexible scheduling, transparent pricing, no card needed to get an estimate.",
    ],
    hoodsBlurb:
      "We cover Winter Park, Lake Nona, Thornton Park, Baldwin Park, College Park, Audubon Park, Mills 50 and the Hourglass District — same standard in every ZIP.",
    hoods: [
      { slug: "winter-park",      name: "Winter Park" },
      { slug: "lake-nona",        name: "Lake Nona" },
      { slug: "thornton-park",    name: "Thornton Park" },
      { slug: "baldwin-park",     name: "Baldwin Park" },
      { slug: "college-park",     name: "College Park" },
      { slug: "audubon-park",     name: "Audubon Park" },
    ],
  },

  miami: {
    slug: "miami",
    name: "Miami",
    state: "FL",
    zip: "33131",
    address: "Miami, FL · Service area: Miami-Dade County",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/miami.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Miami, FL",
    intro:
      "Need a reliable Miami maid service that shows up on time and leaves a 5-star clean? Spotless Homes brings the same family-run standard to Miami-Dade — Brickell condos, Coral Gables homes, South Beach turnovers — vetted cleaners, insured and bonded, paid only when you're happy.",
    whyParas: [
      "Our routine house cleaning service in Miami fits the way you actually live. From Brickell high-rises to Coconut Grove craftsmans and Coral Gables family homes, our cleaners deliver consistent results you can plan around.",
      "Running an Airbnb in South Beach or Wynwood? Our turnover service handles fresh linens, photo-checked staging, and same-day turns so your listing stays guest-ready.",
      "Book your Miami cleaning today — flexible scheduling, transparent pricing, English & Spanish friendly.",
    ],
    hoodsBlurb:
      "From Brickell and Downtown to Coral Gables, Coconut Grove, Wynwood, and the beach — same vetted team, same standard, every ZIP.",
    hoods: [
      { slug: "south-beach",     name: "South Beach" },
      { slug: "brickell",        name: "Brickell" },
      { slug: "coconut-grove",   name: "Coconut Grove" },
      { slug: "coral-gables",    name: "Coral Gables" },
      { slug: "wynwood",         name: "Wynwood" },
      { slug: "key-biscayne",    name: "Key Biscayne" },
    ],
  },

  "boca-raton": {
    slug: "boca-raton",
    name: "Boca Raton",
    state: "FL",
    zip: "33432",
    address: "Boca Raton, FL · Service area: South Palm Beach County",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/boca-raton.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Boca Raton, FL",
    intro:
      "Looking for a trustworthy Boca Raton maid service? Spotless Homes brings the same vetted, insured, family-run cleaning standard to South Palm Beach County. From Boca West to East Boca and the country-club communities in between — clean homes, on time, every time.",
    whyParas: [
      "Our routine house cleaning service in Boca Raton keeps homes in Old Floresta, Royal Palm Polo, and The Sanctuary consistently tidy. Recurring weekly, biweekly, or monthly — with the same cleaner whenever possible so they learn your home.",
      "Selling, moving in, or hosting? Our move-in/out and deep cleaning services in Boca Raton cover baseboards, inside appliances, light fixtures, and the corners most teams skip.",
      "Book your Boca Raton house cleaning today — pay only when you're satisfied with the result.",
    ],
    hoodsBlurb:
      "We serve Boca West, Royal Palm Polo, Old Floresta, Pearl City, The Sanctuary, Boca Bridges, and East Boca with one standard.",
    hoods: [
      { slug: "boca-west",        name: "Boca West" },
      { slug: "royal-palm-polo",  name: "Royal Palm Polo" },
      { slug: "old-floresta",     name: "Old Floresta" },
      { slug: "the-sanctuary",    name: "The Sanctuary" },
      { slug: "boca-bridges",     name: "Boca Bridges" },
      { slug: "east-boca",        name: "East Boca" },
    ],
  },

  "fort-myers": {
    slug: "fort-myers",
    name: "Fort Myers",
    state: "FL",
    zip: "33901",
    address: "Fort Myers, FL · Service area: Lee County",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/fort-myers.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Fort Myers, FL",
    intro:
      "Need a dependable Fort Myers maid service? Spotless Homes serves Lee County with the same vetted team and pay-after-satisfaction promise we built our reputation on. From McGregor Boulevard to the islands, our cleaners are trained, insured, and ready when you are.",
    whyParas: [
      "Our routine house cleaning service in Fort Myers keeps homes in McGregor, Edison Park, and Gateway consistently fresh — dust, vacuum, mop, sanitize the kitchens and baths, and the corners most teams skip.",
      "Have a vacation rental or seasonal home? Our turnover and seasonal-open services keep your Fort Myers property guest-ready and welcoming, with fresh linens and photo-checked staging.",
      "Book your Fort Myers house cleaning today — flexible scheduling, transparent pricing, no surprises.",
    ],
    hoodsBlurb:
      "We cover McGregor Boulevard, Edison Park, Iona, Pelican Preserve, Gateway, Fort Myers Beach, and the islands — same standard in every ZIP.",
    hoods: [
      { slug: "mcgregor-boulevard", name: "McGregor Boulevard" },
      { slug: "edison-park",        name: "Edison Park" },
      { slug: "iona",               name: "Iona" },
      { slug: "pelican-preserve",   name: "Pelican Preserve" },
      { slug: "gateway",            name: "Gateway" },
      { slug: "fort-myers-beach",   name: "Fort Myers Beach" },
    ],
  },
};

export const CITY_SLUGS = Object.keys(LOCATIONS);

export function getCity(slug) {
  return LOCATIONS[slug] || null;
}

export function getSubcity(citySlug, subcitySlug) {
  const city = getCity(citySlug);
  if (!city) return null;
  return city.hoods.find((h) => h.slug === subcitySlug) || null;
}
