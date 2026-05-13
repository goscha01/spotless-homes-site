import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { extras } from "@/constants/price";

export default function ExtrasSelection({ form, nextStep }) {
  return (
    <div className="h-full lg:h-[580px] flex flex-col">
      <div className="bg-white rounded-lg border p-4 md:p-6 h-full flex flex-col justify-between">
        <div className="space-y-6 lg:space-y-4">
          <section>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-left">
              Extras
            </h2>
            <p className="text-sm lg:text-sm text-gray-600 mb-4 lg:mb-3 text-left">
              Add on extras for a cleaning upgrade.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-2">
          {extras.map((extra, index) => {
            const isChecked = (form.watch("extras") || []).includes(extra.id);
            return (
              <Card
                key={extra.id}
                className={`cursor-pointer border border-gray-300 transition-all flex items-center p-2 lg:p-3 rounded-lg shadow-sm ${
                  isChecked ? "border-primary border-2 bg-primaryDull" : ""
                }`}
              >
                <CardContent className="flex flex-1 items-center space-x-2 lg:space-x-3 p-0">
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
                      className={`w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center border-2 rounded-md transition cursor-pointer ${
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
                          className={`text-xs lg:text-sm ${
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