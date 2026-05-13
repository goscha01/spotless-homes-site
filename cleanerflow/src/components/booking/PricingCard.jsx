import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, parse } from "date-fns";
import { pricingData } from "@/constants/price";
import { calculatePrice } from '@/lib/calculatePrice'


export default function PricingCard({ form, currentStep }) {
  const formData = form.watch();
  useEffect(() => {
    const { total } = calculatePrice(formData);
    form.setValue("totalPrice", total);
     console.log('pricing card total', total)
  }, []);

  const { subtotal, discount, total } = calculatePrice(formData);
  // const { total } = calculatePrice(formData);
  return (
    <Card className="sticky top-24 hidden lg:block h-[580px] overflow-y-auto">
      <CardContent className="p-6 px-0 pb-0 flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-4 px-6 text-gray-700">
          {formData.serviceType === "regular"
            ? "Regular Cleaning"
            : formData.serviceType === "deep"
            ? "Deep Cleaning"
            : formData.serviceType === "move"
            ? "Move In/Out Cleaning"
            : "Airbnb Cleaning"}
        </h3>
        <div className="space-y-1 flex-1">
          {formData.bedrooms > 0 && (
            <div className="flex justify-between text-md px-6 text-gray-600">
              <span>{`${formData.bedrooms} ${
                formData.bedrooms === 1 ? "bedroom" : "bedrooms"
              }`}</span>
            </div>
          )}
          {formData.bathrooms > 0 && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>{`${formData.bathrooms} ${
                formData.bathrooms === 1 ? "bathroom" : "bathrooms"
              }`}</span>{" "}
            </div>
          )}
          {formData.square_feet != null && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>{`${formData.square_feet} Sq. Feet`}</span>{" "}
            </div>
          )}
          {formData.extras?.length > 0 && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>
                {formData.extras.map((extra, index) => (
                  <div key={index}>{extra}</div>
                ))}
              </span>
            </div>
          )}

          {formData.propertyCondition && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>{formData.propertyCondition}</span>
            </div>
          )}
          {formData.hasPets && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>{formData.hasPets}</span>
            </div>
          )}
          {formData.preferredDates && formData.preferredDates.length > 0 && (
            <>
              <div className="pt-4 px-6 text-xs text-gray-700 flex items-center">
                <span className="pr-1">REQUESTED TIME</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {formData.preferredDates.map((date) => {
                const times = formData.preferredTimes[date] || [];
                const parsedDate = parse(date, "yyyy-MM-dd", new Date());
                return (
                  <div key={date} className="text-sm text-gray-600 px-6 pb-2">
                    <div className="flex justify-between font-semibold">
                      <span>{format(parsedDate, "PPP")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {times.map((time, index) => (
                        <span
                          key={index}
                          className="border-[1px] border-gray-200 rounded-md px-2 py-1 text-gray-500"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {formData.streetAddress && (
            <div className="pt-8 pb-2 border-t text-lg text-gray-600 px-6">
              <div className="flex justify-between">
                {/* <IoLocationOutline /> */}
                <span className="text-right">{formData.streetAddress}</span>
              </div>
            </div>
          )}
          {formData.unitNumber && (
            <div className="text-lg text-gray-600 px-6 pb-4">
              <div className="flex justify-between">
                <span className="text-right">{formData.unitNumber}</span>
              </div>
            </div>
          )}
          {discount > 0 && (
            <div className="pt-4 border-t px-6 pb-2">
              <div className="flex justify-between text-md font-semibold">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Recurring Plan Discount (15%)</span>
                <span>-${discount}</span>
              </div>
            </div>
          )}
          <div className="pt-4 border-t px-6 pb-2">
            <motion.div
              className="flex justify-between text-md font-semibold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              <span>Today's Total</span>
              <span className="text-primary font-bold text-xl">${total}</span>
            </motion.div>
          </div>
          <div className="pt-4 border-t px-6 pb-6 bg-gray-50 mt-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">
                  What's Included: <a 
                    href="https://www.spotless.homes/cleaning-products" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    check here
                  </a>
                </h4>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 inline">Next Step: </h4>
                <span className="text-sm text-gray-600">
                  {currentStep === 0 && "Property condition"}
                  {currentStep === 1 && "Add-ons"}
                  {currentStep === 2 && "Scheduling"}
                  {currentStep === 3 && "Contact data"}
                  {currentStep === 4 && "Submit your request"}
                  {currentStep === undefined && "Complete the booking form"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
