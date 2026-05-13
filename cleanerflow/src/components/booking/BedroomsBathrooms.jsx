import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const bedrooms = Array.from({ length: 6 }, (_, i) => i + 1);
const bathrooms = Array.from({ length: 5 }, (_, i) => i + 1);

export default function BedroomsBathrooms({ form, nextStep }) {
  const bedroomsRef = useRef(null);
  const bathroomsRef = useRef(null);

  useEffect(() => {
    if (!form.watch("bathrooms")) {
      form.setValue("bathrooms", 1);
      form.clearErrors("bathrooms");
    }
  }, [form]);

  useEffect(() => {
    if (!form.watch("bedrooms")) {
      form.setValue("bedrooms", 1);
      form.clearErrors("bedrooms");
    }
  }, [form]);

  // Removed scrollToSection function and error scrolling

  const handleBedroomSelect = (num) => {
    form.setValue("bedrooms", num);
    form.clearErrors("bedrooms");
  };

  const handleBathroomSelect = (num) => {
    form.setValue("bathrooms", num);
    form.clearErrors("bathrooms");
  };

  // Removed auto-scroll to bathrooms section

  return (
    <div className="h-full lg:h-[580px] flex flex-col">
      <div className="bg-white rounded-lg border p-4 md:p-6 h-full flex flex-col justify-between">
        <div className="space-y-6 lg:space-y-4">
          <section ref={bedroomsRef}>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 lg:mb-3 text-left">
              Number of Bedrooms <span className="text-red-500">*</span>
              {form.formState.errors.bedrooms && (
                <div className="flex items-center gap-2 mt-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Please select number of bedrooms</span>
                </div>
              )}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-2">
          {bedrooms.map((num) => (
            <motion.div
              key={num}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBedroomSelect(num)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("bedrooms") === num
                    ? "border-primary border-2 text-primary bg-primaryDull font-bold"
                    : ""
                }`}
              >
                <CardContent className="p-3 lg:p-4 text-center">
                  <span className="text-sm lg:text-base">
                    {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

          <section ref={bathroomsRef}>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 mt-8 lg:mt-6 text-left">
              Number of Bathrooms <span className="text-red-500">*</span>
              {form.formState.errors.bathrooms && (
                <div className="flex items-center gap-2 mt-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Please select number of bathrooms</span>
                </div>
              )}
            </h2>
            <p className="text-sm lg:text-sm text-gray-600 mb-4 lg:mb-3 text-left">
              For our service a half-bathroom is considered as full bathrooms.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-2">
          {bathrooms.map((num) => (
            <motion.div
              key={num}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBathroomSelect(num)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("bathrooms") === num
                    ? "border-primary border-2 text-primary bg-primaryDull font-bold"
                    : ""
                }`}
              >
                <CardContent className="p-3 lg:p-4 text-center">
                  <span className="text-sm lg:text-base">
                    {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
            </div>
          </section>
        </div>

        <div className="mt-6 lg:mt-6 flex justify-start">
          <Button
            type="button"
            onClick={nextStep}
            className="continue-button bg-primary text-white px-8 lg:px-12 py-4 lg:py-4 text-sm lg:text-sm hover:bg-primaryHover w-full md:w-auto"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}