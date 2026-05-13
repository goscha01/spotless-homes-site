import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { conditions, pets } from "@/constants/price";

export default function PropertyConditionPets({ form, nextStep }) {
  const conditionRef = useRef(null);
  const petRef = useRef(null);

  // Removed scrollToSection function and all scrolling behavior

  const handleConditionSelect = (conditionId) => {
    form.setValue("propertyCondition", conditionId);
    form.clearErrors("propertyCondition");
  };

  // Removed auto-scroll to pets section

  return (
    <div className="h-full lg:h-[580px] flex flex-col">
      <div className="bg-white rounded-lg border p-4 md:p-6 h-full flex flex-col justify-between">
        <div className="space-y-6 lg:space-y-4">
          <section ref={conditionRef}>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-left">
              Property Condition <span className="text-red-500">*</span>
              {form.formState.errors.propertyCondition && (
                <div className="flex items-center gap-2 mt-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Please select property condition</span>
                </div>
              )}
            </h2>
            <p className="text-sm lg:text-sm text-gray-600 mb-4 lg:mb-3 text-left">
              How would you rate your property condition in the rate from 1 dirty to 10 clean?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-2">
          {[...conditions].reverse().map((condition) => (
            <motion.div
              key={condition.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleConditionSelect(condition.id)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("propertyCondition") === condition.id
                    ? "border-primary border-2 text-primary font-bold bg-primaryDull"
                    : ""
                }`}
              >
                <CardContent className="p-3 lg:p-4 text-center">
                  <div className="text-sm lg:text-base font-medium">{condition.label}</div>
                  <div className="text-xs lg:text-xs text-gray-600 mt-1">
                    {condition.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

          <section ref={petRef}>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mt-8 lg:mt-6 mb-2 text-left">
              Any pets <span className="text-red-500">*</span>
              {form.formState.errors.hasPets && (
                <div className="flex items-center gap-2 mt-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Please select if you have pets</span>
                </div>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-2">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                form.setValue("hasPets", pet.id);
                form.clearErrors("hasPets");
              }}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("hasPets") === pet.id
                    ? "border-primary border-2 text-primary font-bold bg-primaryDull"
                    : ""
                }`}
              >
                <CardContent className="p-4 lg:p-4 text-center">
                  <div className="text-sm lg:text-base">{pet.label}</div>
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
            onClick={(e) => {
              // Validate required fields
              let hasError = false;
              
              if (!form.watch("propertyCondition")) {
                form.setError("propertyCondition", { message: "Property condition is required" });
                hasError = true;
              }
              
              if (!form.watch("hasPets")) {
                form.setError("hasPets", { message: "Pet information is required" });
                hasError = true;
              }
              
              if (!hasError) {
                nextStep();
              }
            }}
            className="continue-button bg-primary text-white px-8 lg:px-12 py-4 lg:py-4 text-sm lg:text-sm hover:bg-primaryHover w-full md:w-auto"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}