import { AiOutlineCheck } from "react-icons/ai"; // For tick symbol
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const Detail = () => {
  const steps = [
    {
      number: 1,
      title: "Customize your cleaning service",
      description:
        "Provide details like the number of bedrooms and bathrooms you need cleaned and any optional cleaning extras",
    },
    {
      number: 2,
      title: "Pick an arrival window",
      description:
        "We operate 6 days a week. We offer early morning and afternoon timeslots to accommodate any schedule. On the day of your cleaning, we'll send you a text message with the exact arrival time",
    },
    {
      number: 3,
      title: "We clean",
      description:
        "We provide a thorough cleaning making sure to check every item on our cleaning checklist.",
    },
  ];

  const features = [
    {
      title: "Instant online booking",
      description:
        "Book online instantly, and schedule your first cleaning for as early as tomorrow. Get your home cleaned anytime from 9am to 6pm, 6 days a week.",
    },
    {
      title: "Customer Service First, vetted professionals",
      description:
        "All professionals on the Home Spotless platform are screened, background checked, and are rated by customers like you to ensure quality.",
    },
    {
      title: "Focused on your needs",
      description:
        "Professionals bring supplies and work from a comprehensive checklist that you can tailor to your liking.",
    },
    {
      title: "Same cleaner each cleaning",
      description:
        "Spotless Homes strives to match you with the right professional for you and your home every time.",
    },
    {
      title: "Easy and secure online payments",
      description:
        "No more last minute runs to the bank. Pay online and tip at your discretion.",
    },
    {
      title: "Happiness Guarantee",
      description:
        "Your happiness is our goal. If you're not happy, we'll work hard to make it right. The Requester must report the claim within 24 hours of the Spotless Homes Pro completion of service. The Professional Service is paid for in full through the Spotless Homes Platform.",
    },
  ];
  const faqs = [
    {
      question: "What is your cancellation policy?",
      answer:
        "You may reschedule or cancel service for free 24hrs in advance of the cleaning day.",
    },
    {
      question: "What's included?",
      answer:
        "**Bathroom:** Scrub grout, disinfect wastebaskets, remove soap scum and limescale. Deep clean baseboards, door frames, vanities, medicine cabinets. Disinfect knobs, clean toilet base, and shower areas.\n\n**Kitchen:** Clean behind and under appliances. Tackle oven, fridge, microwave, and range hood. Scrub cabinets, countertops, and small appliances. Organize cabinets and drawers, disinfect knobs and switches. \n\n**General Spaces:** Clean under furniture, wipe down fans and lights. Vacuum and clean upholstery, clean blinds, and dust decor. Sanitize trash cans, dust lamps, clean baseboards, window frames, and vents. Scrub window sills and tracks, clean walls, vacuum edges, and polish furniture. ",
    },
    {
      question: "Which pro will come to my place?",
      answer:
        "You will receive an email with details about your cleaning professional prior to your appointment.",
    },
    {
      question: "I need more help",
      answer:
        "Prefer to talk to someone? Give us a call at 813-000-0000 M-F 9 AM - 6pm EST",
    },
  ];
  const reviews = [
    {
      text: "Overall good cleaning. Pleasant, open to guidance on suggested areas. Next appointment would like to focus on enhancing glass/mirror cleaning to avoid streaks and stains.",
      author: "Nancy R.",
    },
    {
      text: "I like how professional and quick the guys cleaned my apartment! They didn't leave a spot without their attention. Especially I like how they removed all water tracks on my shower glass! I recommend Spotless Homes to anyone who search quick and reliable cleaning service!",
      author: "Ivan D.",
    },
    {
      text: "Amazing service! Professional consultation was given to keep house clean! Quick! Highly recommended!",
      author: "Nadin U.",
    },
    {
      text: "Spotless Homes is fantastic! From our first phone call to the helpful reminders before each service, the team is professional, friendly, and well-organized. They clearly outline the services they offer while remaining flexible, treating your home with the utmost care as if it were their own. Working with them is truly a pleasure.",
      author: "Gosha B.",
    },
    {
      text: "Spotless Homes team did a great job! Arrived on time and immediately began to work. Larissa was easy to talk to, very professional, and addressed each of the specific areas needed for the deep cleaning service. House looks great! Highly recommend!",
      author: "Lena V.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-12 py-12 ">
      {/* How it works section */}
      <h2 className="text-xl font-bold mb-4">How it works</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col">
            <div className="flex items-center space-x-4 ">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold mt-4">
                {step.number}
              </span>
              <h3 className="text-md font-semibold text-gray-700">
                {step.title}
              </h3>
            </div>
            <p className="text-gray-600 ml-12">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Why choose section */}
      <h2 className="text-xl font-bold mt-24 mb-6">
        Why choose Spotless Homes?
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <AiOutlineCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQS section */}
      <h2 className="text-xl font-bold mt-24 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="grid grid-cols-1 gap-2">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Reviews section */}
      <h2 className="text-xl font-bold mt-24 mb-6">
        Why our customers love Home Spotless{" "}
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {reviews.map((review, index) => (
          <div key={index}>
            <div className="flex text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-7 h-7 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">{review.text}</p>
            <p className="font-semibold">{review.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
