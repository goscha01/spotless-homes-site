// Spotless Homes · Florida service-area data
// Each entry powers /locations/:city and /locations/:city/:subcity routes.
//
// Tampa + Clearwater + Saint Petersburg use copy adapted from the live
// www.spotless.homes site. Other cities are rewritten in the same voice.

import { ratingSummary } from "./reviews-stats.js";

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
    // Parent ZIPs covered by Tampa (Hillsborough County):
    serviceZips: ["33602","33603","33604","33605","33606","33607","33609","33614","33629","33647"],
    hoods: [
      // In-city Tampa neighborhoods (no isCity flag — they don't get their own JSON-LD)
      { slug: "south-tampa",       name: "South Tampa" , heroPhoto: "/assets/cities/south-tampa.jpg" },
      { slug: "hyde-park",         name: "Hyde Park" , heroPhoto: "/assets/cities/hyde-park.jpg" },
      { slug: "seminole-heights",  name: "Seminole Heights" },
      { slug: "westchase",         name: "Westchase" , heroPhoto: "/assets/cities/westchase.jpg" },
      { slug: "carrollwood",       name: "Carrollwood" },
      { slug: "ybor-city",         name: "Ybor City" , heroPhoto: "/assets/cities/ybor-city.jpg" },
      // Surrounding Hillsborough County cities (isCity=true → own LocalBusiness schema).
      // `heroPhoto` set where a genuine Wikimedia Commons photo exists; when omitted,
      // template falls back to the parent Tampa image (see location.jsx).
      { slug: "brandon",           name: "Brandon",           isCity: true, county: "Hillsborough", zips: ["33510","33511"],                     heroPhoto: "/assets/cities/brandon.jpg" },
      { slug: "riverview",         name: "Riverview",         isCity: true, county: "Hillsborough", zips: ["33569","33578","33579"] },
      { slug: "apollo-beach",      name: "Apollo Beach",      isCity: true, county: "Hillsborough", zips: ["33572"],                             heroPhoto: "/assets/cities/apollo-beach.jpg" },
      { slug: "sun-city-center",   name: "Sun City Center",   isCity: true, county: "Hillsborough", zips: ["33573"],                             heroPhoto: "/assets/cities/sun-city-center.jpg" },
      { slug: "seffner",           name: "Seffner",           isCity: true, county: "Hillsborough", zips: ["33584"],                             heroPhoto: "/assets/cities/seffner.jpg" },
      { slug: "thonotosassa",      name: "Thonotosassa",      isCity: true, county: "Hillsborough", zips: ["33592"],                             heroPhoto: "/assets/cities/thonotosassa.jpg" },
      { slug: "dover",             name: "Dover",             isCity: true, county: "Hillsborough", zips: ["33527"],                             heroPhoto: "/assets/cities/dover.jpg" },
      { slug: "valrico",           name: "Valrico",           isCity: true, county: "Hillsborough", zips: ["33594","33596"],                     heroPhoto: "/assets/cities/valrico.jpg" },
      { slug: "lutz",              name: "Lutz",              isCity: true, county: "Hillsborough", zips: ["33548","33549","33558","33559"],     heroPhoto: "/assets/cities/lutz.jpg" },
      { slug: "gibsonton",         name: "Gibsonton",         isCity: true, county: "Hillsborough", zips: ["33534"],                             heroPhoto: "/assets/cities/gibsonton.jpg" },
      { slug: "balm",              name: "Balm",              isCity: true, county: "Hillsborough", zips: ["33503"] },
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
    serviceZips: ["33701","33702","33703","33704","33705","33706","33707","33716"],
    hoods: [
      // In-city St. Pete neighborhoods
      { slug: "old-northeast",    name: "Old Northeast" },
      { slug: "kenwood",          name: "Kenwood" },
      { slug: "snell-isle",       name: "Snell Isle" , heroPhoto: "/assets/cities/snell-isle.jpg" },
      { slug: "crescent-heights", name: "Crescent Heights" },
      { slug: "jungle-terrace",   name: "Jungle Terrace" },
      { slug: "shore-acres",      name: "Shore Acres" },
      // Surrounding south-Pinellas cities
      { slug: "pinellas-park",    name: "Pinellas Park", isCity: true, county: "Pinellas", zips: ["33781","33782"] , heroPhoto: "/assets/cities/pinellas-park.jpg" },
      { slug: "seminole",         name: "Seminole",      isCity: true, county: "Pinellas", zips: ["33772","33776","33777"] , heroPhoto: "/assets/cities/seminole.jpg" },
      { slug: "largo",            name: "Largo",         isCity: true, county: "Pinellas", zips: ["33770","33771","33773","33774","33778"] , heroPhoto: "/assets/cities/largo.jpg" },
      { slug: "bay-pines",        name: "Bay Pines",     isCity: true, county: "Pinellas", zips: ["33744"] },
    ],
  },

  clearwater: {
    slug: "clearwater",
    name: "Clearwater",
    state: "FL",
    zip: "33755",
    address: "Clearwater, FL · Service area: Pinellas County",
    phone: "(727) 390-8889",
    phoneRaw: "7273908889",
    heroPhoto: "/assets/cities/clearwater.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Clearwater, FL",
    intro:
      "Looking for a Clearwater house cleaning service you can actually plan your week around? Spotless Homes runs a vetted, insured, family-led team across Pinellas County — from Cleveland Street condos and Island Estates waterfront to the beach rentals and quiet Countryside cul-de-sacs. Standard upkeep, deep resets, move-in/out, and Airbnb turnovers — booked in two minutes, paid only after you're happy.",
    whyParas: [
      "Our recurring house cleaning in Clearwater is built for the salt-air, sand-tracked reality of Gulf Coast living. Whether you're on the bridge in Island Estates, behind a screen on the beach, or off Drew Street downtown, the same trained cleaner shows up on the same cadence — so they learn your floors, your fixtures, and how you like the kitchen left.",
      "Hosting on the beach or near Pier 60? Our Airbnb turnover service handles fresh linens, photo-checked staging, and same-day turns between guests — so your listing stays five-star and your calendar stays full through season.",
      "Selling, moving in, or finally tackling the post-storm reset? Our Clearwater deep cleans cover baseboards, inside the fridge, behind the stove, light fixtures, and the corners most teams skip. Transparent pricing, no card to get an estimate, and a satisfaction promise on every visit.",
    ],
    hoodsBlurb:
      "From Cleveland Street downtown and Island Estates across the causeway to Clearwater Beach, Belleair, Countryside, and Morningside — one vetted team, one standard, every Pinellas ZIP.",
    serviceZips: ["33755","33756","33759","33760","33761","33762","33763","33767"],
    hoods: [
      // In-city Clearwater neighborhoods
      { slug: "clearwater-beach", name: "Clearwater Beach" , heroPhoto: "/assets/cities/clearwater-beach.jpg" },
      { slug: "island-estates",   name: "Island Estates" },
      { slug: "belleair",         name: "Belleair" , heroPhoto: "/assets/cities/belleair.jpg" },
      { slug: "countryside",      name: "Countryside" },
      { slug: "downtown",         name: "Downtown Clearwater" },
      { slug: "morningside",      name: "Morningside" },
      // Surrounding central/north-Pinellas + Pasco cities
      { slug: "indian-rocks-beach", name: "Indian Rocks Beach", isCity: true, county: "Pinellas", zips: ["33785"] , heroPhoto: "/assets/cities/indian-rocks-beach.jpg" },
      { slug: "belleair-beach",     name: "Belleair Beach",     isCity: true, county: "Pinellas", zips: ["33786"] , heroPhoto: "/assets/cities/belleair-beach.jpg" },
      { slug: "dunedin",            name: "Dunedin",            isCity: true, county: "Pinellas", zips: ["34698"] , heroPhoto: "/assets/cities/dunedin.jpg" },
      { slug: "tarpon-springs",     name: "Tarpon Springs",     isCity: true, county: "Pinellas", zips: ["34688","34689"] , heroPhoto: "/assets/cities/tarpon-springs.jpg" },
      { slug: "oldsmar",            name: "Oldsmar",            isCity: true, county: "Pinellas", zips: ["34677"] , heroPhoto: "/assets/cities/oldsmar.jpg" },
      { slug: "safety-harbor",      name: "Safety Harbor",      isCity: true, county: "Pinellas", zips: ["34695"] , heroPhoto: "/assets/cities/safety-harbor.jpg" },
      { slug: "palm-harbor",        name: "Palm Harbor",        isCity: true, county: "Pinellas", zips: ["34683","34684","34685"] , heroPhoto: "/assets/cities/palm-harbor.jpg" },
      { slug: "crystal-beach",      name: "Crystal Beach",      isCity: true, county: "Pinellas", zips: ["34681"] , heroPhoto: "/assets/cities/crystal-beach.jpg" },
      { slug: "holiday",            name: "Holiday",            isCity: true, county: "Pasco",    zips: ["34690","34691"] , heroPhoto: "/assets/cities/holiday.jpg" },
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
      `Looking for a trusted Jacksonville maid service? Spotless Homes brings the same family-run, results-first cleaning standard to Duval County that has earned us ${ratingSummary}. From the St. Johns River to the beaches, our Jacksonville cleaners are trained, insured, and background-checked.`,
    whyParas: [
      "Our routine house cleaning service in Jacksonville is built around your week. Whether you're in Riverside, San Marco, or Atlantic Beach, our professional cleaners deliver consistent results that hold up between visits.",
      "Need something deeper? Our move-in/move-out and deep cleaning services in Jacksonville cover baseboards, inside appliances, and the corners most teams skip — perfect for first cleans, end-of-lease, or seasonal resets.",
      "Book your Jacksonville cleaning service today and find out what it's like to come home to a place you don't have to fix on the weekend.",
    ],
    hoodsBlurb:
      "From Riverside and Avondale up the river to San Marco, and out to Atlantic and Jacksonville Beach — our team covers every Duval ZIP with the same standard.",
    serviceZips: ["32202","32204","32205","32206","32207","32208","32209","32250","32233","32266"],
    hoods: [
      // In-city Jacksonville neighborhoods (Duval — same city, no separate JSON-LD)
      { slug: "riverside",          name: "Riverside" },
      { slug: "avondale",           name: "Avondale" },
      { slug: "san-marco",          name: "San Marco" , heroPhoto: "/assets/cities/san-marco.jpg" },
      { slug: "mandarin",           name: "Mandarin" },
      { slug: "atlantic-beach",     name: "Atlantic Beach" , heroPhoto: "/assets/cities/atlantic-beach.jpg" },
      { slug: "jacksonville-beach", name: "Jacksonville Beach" , heroPhoto: "/assets/cities/jacksonville-beach.jpg" },
      // Surrounding Duval/Clay/St. Johns cities
      { slug: "neptune-beach",      name: "Neptune Beach",      isCity: true, county: "Duval",     zips: ["32266"] , heroPhoto: "/assets/cities/neptune-beach.jpg" },
      { slug: "fleming-island",     name: "Fleming Island",     isCity: true, county: "Clay",      zips: ["32003"] , heroPhoto: "/assets/cities/fleming-island.jpg" },
      { slug: "orange-park",        name: "Orange Park",        isCity: true, county: "Clay",      zips: ["32065","32073"] , heroPhoto: "/assets/cities/orange-park.jpg" },
      { slug: "saint-johns",        name: "Saint Johns",        isCity: true, county: "St. Johns", zips: ["32259"] },
      { slug: "ponte-vedra-beach",  name: "Ponte Vedra Beach",  isCity: true, county: "St. Johns", zips: ["32082"] , heroPhoto: "/assets/cities/ponte-vedra-beach.jpg" },
      { slug: "ponte-vedra",        name: "Ponte Vedra",        isCity: true, county: "St. Johns", zips: ["32081"] },
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
      { slug: "winter-park",      name: "Winter Park" , heroPhoto: "/assets/cities/winter-park.jpg" },
      { slug: "lake-nona",        name: "Lake Nona" },
      { slug: "thornton-park",    name: "Thornton Park" , heroPhoto: "/assets/cities/thornton-park.jpg" },
      { slug: "baldwin-park",     name: "Baldwin Park" , heroPhoto: "/assets/cities/baldwin-park.jpg" },
      { slug: "college-park",     name: "College Park" , heroPhoto: "/assets/cities/college-park.jpg" },
      { slug: "audubon-park",     name: "Audubon Park" },
    ],
  },

  "fort-lauderdale": {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale",
    state: "FL",
    zip: "33301",
    address: "Fort Lauderdale, FL · Service area: Broward County",
    phone: "(813) 921-2100",
    phoneRaw: "8139212100",
    heroPhoto: "/assets/cities/fort-lauderdale.jpg",
    proofPhoto: "/assets/fridge.jpg",
    eyebrow: "Cleaning services · Fort Lauderdale, FL",
    intro:
      "Need a reliable Fort Lauderdale maid service that shows up on time and leaves a 5-star clean? Spotless Homes brings the same family-run standard to Broward County — Las Olas condos, Victoria Park homes, Harbor Beach turnovers — vetted cleaners, insured and bonded, paid only when you're happy.",
    whyParas: [
      "Our routine house cleaning service in Fort Lauderdale fits the way you actually live. From downtown high-rises to Coral Ridge family homes and Rio Vista waterfront properties, our cleaners deliver consistent results you can plan around.",
      "Running an Airbnb on the beach or near Las Olas? Our turnover service handles fresh linens, photo-checked staging, and same-day turns so your listing stays guest-ready.",
      "Book your Fort Lauderdale cleaning today — flexible scheduling, transparent pricing, English & Spanish friendly.",
    ],
    hoodsBlurb:
      "From Las Olas and downtown to Victoria Park, Coral Ridge, Rio Vista, and the beach — same vetted team, same standard, every ZIP.",
    serviceZips: ["33301","33304","33305","33306","33308","33309","33311","33312","33313","33315","33316","33317","33334"],
    hoods: [
      // In-city Fort Lauderdale neighborhoods
      { slug: "las-olas",        name: "Las Olas" },
      { slug: "victoria-park",   name: "Victoria Park" },
      { slug: "coral-ridge",     name: "Coral Ridge" },
      { slug: "rio-vista",       name: "Rio Vista" },
      { slug: "harbor-beach",    name: "Harbor Beach" },
      { slug: "imperial-point",  name: "Imperial Point" },
      // Surrounding Broward County cities
      { slug: "pompano-beach",   name: "Pompano Beach",   isCity: true, county: "Broward", zips: ["33060","33062","33063","33064","33066","33067","33068"] , heroPhoto: "/assets/cities/pompano-beach.jpg" },
      { slug: "coral-springs",   name: "Coral Springs",   isCity: true, county: "Broward", zips: ["33065","33071"] , heroPhoto: "/assets/cities/coral-springs.jpg" },
      { slug: "deerfield-beach", name: "Deerfield Beach", isCity: true, county: "Broward", zips: ["33441","33442"] , heroPhoto: "/assets/cities/deerfield-beach.jpg" },
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
      { slug: "boca-west",        name: "Boca West" , heroPhoto: "/assets/cities/boca-west.jpg" },
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
      { slug: "fort-myers-beach",   name: "Fort Myers Beach" , heroPhoto: "/assets/cities/fort-myers-beach.jpg" },
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
