import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { extras, conditions, pets, requirements } from "@/constants/price";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const bedrooms = Array.from({ length: 6 }, (_, i) => i + 1);
const bathrooms = Array.from({ length: 5 }, (_, i) => i + 1);

export default function PropertyDetails({ form, nextStep }) {
  const bedroomsRef = useRef(null);
  const bathroomsRef = useRef(null);
  const extrasRef = useRef(null);
  const conditionRef = useRef(null);
  const petRef = useRef(null);
  const requirementsRef = useRef(null);
  const continueBtton = useRef(null)
  const noteRef = useRef(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

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

  // Removed scrollToSection function
  // Removed validation error scroll handling

  const handleBedroomSelect = (num) => {
    form.setValue("bedrooms", num);
    form.clearErrors("bedrooms");
  };

  const handleBathroomSelect = (num) => {
    form.setValue("bathrooms", num);
    form.clearErrors("bathrooms");
  };

  const handleConditionSelect = (conditionId) => {
    form.setValue("propertyCondition", conditionId);
    form.clearErrors("propertyCondition");
  };

  // Removed all auto-scroll on selection effects

  return (
    <div className="space-y-8">
      <section ref={bedroomsRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Number of Bedrooms <span className="text-red-500">*</span>{" "}
          {form.formState.errors.bedrooms && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Please select number of bedrooms</span>
            </div>
          )}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-2 gap-1">
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
                    : // : form.formState.errors.bedrooms
                      // ? "border-red-500"
                      ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-lg">
                    {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={bathroomsRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 mt-16">
          Number of Bathrooms <span className="text-red-500">*</span>
          {form.formState.errors.bathrooms && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Please select number of bathrooms</span>
            </div>
          )}
        </h2>
        <p className="text-[16px] text-gray-600 mb-6 text-justify">
          For our service a half-bathroom is considered as full bathrooms.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-2 gap-1">
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
                    ? "border-primary border-2 text-primary bg-primaryDulls font-bold"
                    : // : form.formState.errors.bathrooms
                      // ? "border-red-500"
                      ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-lg">
                    {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={extrasRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 mt-16">
          Extras
        </h2>
        <p className="text-[16px] text-gray-600 mb-6">
          Add on extras for a cleaning upgrade.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-2 gap-1 ">
          {extras.map((extra, index) => {
            const isChecked = (form.watch("extras") || []).includes(extra.id);
            return (
              <Card
                key={extra.id}
                className={`cursor-pointer border border-gray-300 transition-all flex items-center p-4 rounded-lg shadow-sm ${
                  isChecked ? "border-primary border-2 bg-primaryDull" : ""
                }`}
              >
                <CardContent className="flex flex-1 items-center space-x-4 p-0">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={extra.id}
                      checked={isChecked}
                      onChange={(e) => {
                        const currentExtras = form.watch("extras") || [];
                        const newExtras = e.target.checked
                          ? [...currentExtras, extra.id]
                          : currentExtras.filter((id) => id !== extra.id);
                        form.setValue("extras", newExtras);
                      }}
                      className="peer hidden"
                    />
                    <label
                      htmlFor={extra.id}
                      className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition cursor-pointer ${
                        isChecked
                          ? "border-primary bg-primary text-white font-bold"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked && "✓"}
                    </label>
                  </div>

                  <Label htmlFor={extra.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span
                          className={`text-lg ${
                            isChecked ? "text-primary font-bold" : ""
                          }`}
                        >
                          {extra.label}
                        </span>
                      </div>
                    </div>
                  </Label>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section ref={conditionRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-2">
          Property Condition <span className="text-red-500">*</span>
          {form.formState.errors.propertyCondition && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Please select property condition</span>
            </div>
          )}
        </h2>
        <p className="text-[16px] text-gray-600 mb-6">
          How would you rate your property condition in the rate from 1 dirty to
          10 clean?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                    ? "border-primary border-2 text-primary font-bold bg-primaryDulls"
                    : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-lg">{condition.label}</div>
                  <div className="text-sm text-gray-600">
                    {condition.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={petRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-6">
          Any pets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => form.setValue("hasPets", pet.id)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("hasPets") === pet.id
                    ? "border-primary border-2 text-primary font-bold bg-primaryDull"
                    : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-lg">{pet.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* <section ref={requirementsRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-6">
          How do we get in?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {requirements.map((req) => (
            <Card
              key={req.id}
              className={`cursor-pointer transition-colors ${
                selectedRequirement === req.id
                  ? "border-primary border-2 text-primary font-bold bg-primaryDulls"
                  : ""
              }`}
              onClick={() => {
                setSelectedRequirement(req.id);
                if (req.id === "home") {
                  form.setValue("accessMethod", {});
                }
              }}
            >
              <CardContent className="p-6">
                <div className="text-lg">{req.label}</div>
                {selectedRequirement === req.id && req.id !== "home" && (
                  <Input
                    className="mt-4"
                    placeholder={`Enter your ${req.label.toLowerCase()}`}
                    value={form.watch(`accessMethod.${req.id}`) || ""}
                    onChange={(e) => {
                      const current = form.watch("accessMethod") || {};
                      form.setValue("accessMethod", {
                        ...current,
                        [req.id]: e.target.value,
                      });
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* <section ref={noteRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-2">
          Special Notes or Instructions
        </h2>
        <p className="text-[15px] text-gray-500 mb-6">
          If there is anything we should know before arriving, please let us
          know in advance. For example:
          <br /> ✅ How to get through a gate.
          <br /> ✅ Parking requirements.
          <br /> ✅ How to access the house (someone will open the door, or you
          would like us to use a key, etc.).
          <br /> ✅ Preferences for cleaning products - please let us know if
          you have any allergies.
          <br /> ✅ Do you have surfaces that require specific care? For
          example, marble, natural stone, hardwood, etc.
        </p>
        <Textarea
          placeholder="Add any special instructions or notes for the cleaning team..."
          className="min-h-[100px]"
          {...form.register("specialNotes")}
        />
      </section> */}
      <div className="mt-8 flex justify-start" ref={continueBtton}>
        <Button
          type="button"
          onClick={nextStep}
          className="continue-button bg-primary text-white px-16 py-6 hover:bg-primaryHover"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
