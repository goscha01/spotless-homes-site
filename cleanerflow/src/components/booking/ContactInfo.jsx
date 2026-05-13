import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReactGA from "react-ga4";

const VITE_COUPON_CODE = import.meta.env.VITE_COUPON_CODE;

export default function ContactInfo({ form }) {
  const formData = form.watch();
  const [sendNotifications, setSendNotifications] = useState(false);
  const [errors, setErrors] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const isValid = formData.name && formData.phone && formData.email;
      setErrors(!isValid);
    };
    validateForm();
  }, [formData.name, formData.phone, formData.email]);

  useEffect(() => {
    form.setValue("sendNotifications", sendNotifications);
  }, [sendNotifications]);

  const handleModalOpen = () => {
    setShowModal(true);
    form.setValue("recurringPlan", 0);
  };

  const handleCouponApply = () => {
    if (coupon === VITE_COUPON_CODE) {
      form.setValue("recurringPlan", Number(coupon));
      setShowModal(false);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Please try again.");
    }
  };

  return (
    <div className="px-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-1 text-left">
        Contact Information
      </h2>
      <p className="text-[16px] text-gray-600 mb-6 text-left">
        Please provide your contact details so we can reach you to confirm your
        booking
      </p>
      <div className="flex ">
        <div className="w-full">
          <Input
            id="name"
            placeholder="Your Full Name"
            {...form.register("name")}
            className="w-full py-6 rounded-xl text-base focus:outline-none focus:ring-0 focus:border-primary"
            style={{ fontSize: "16px" }}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="w-full sm:w-[49%]">
          <Input
            id="phone"
            placeholder="Phone Number"
            {...form.register("phone")}
            className="w-full py-6 rounded-xl text-base focus:outline-none focus:ring-0 focus:border-primary"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="w-full sm:w-[49%]">
          <Input
            id="email"
            placeholder="Email Address"
            type="email"
            {...form.register("email")}
            className="w-full py-6 rounded-xl text-base focus:outline-none focus:ring-0 focus:border-primary"
            style={{ fontSize: "16px" }}
          />
        </div>
      </div>
      <div className="flex items-start gap-2 mt-4">
        <Checkbox
          id="notifications"
          checked={sendNotifications}
          onCheckedChange={(checked) => setSendNotifications(checked)}
          className="mt-0.5"
        />
        <label htmlFor="notifications" className="text-gray-700 text-sm">
          I agree to receive SMS messages related to my service request at the phone number provided.
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Message frequency may vary. Message and data rates may apply. Reply STOP to unsubscribe. Reply HELP for assistance.
      </p>
      <p className="text-xs text-gray-500 mt-1">
        See our{' '}
        <a href="https://geos-ai.com/privacy.html" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primaryHover">Privacy Policy</a>,{' '}
        <a href="https://geos-ai.com/terms.html" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primaryHover">Terms of Service</a>, and{' '}
        <a href="https://geos-ai.com/sms-policy.html" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primaryHover">SMS Policy</a>.
      </p>
      {/* <div className="mt-4">
        <Button
          onClick={handleModalOpen}
          className="bg-transparent hover:bg-transparent hover:text-primaryHover text-primary text-lg font-extrabold"
        >
          Apply Coupon
        </Button>
      </div> */}
      <div className="mt-4 flex justify-start">
        <Button
          type="submit"
          disabled={errors}
          className={`continue-button px-16 py-6 w-full text-white text-lg ${
            errors ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primaryHover"
          }`}
        >
          Request Appointment
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Enter Coupon Code</h2>
            <Input
              placeholder="Enter your coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg mb-4"
            />
            {couponError && (
              <p className="text-red-500 text-sm mb-4">{couponError}</p>
            )}
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowModal(false)}
                className="bg-transparent border border-primary hover:text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCouponApply}
                disabled={!coupon}
                className={`px-6 py-2 rounded-lg ${
                  coupon
                    ? "bg-primary hover:bg-primaryHover text-white"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
