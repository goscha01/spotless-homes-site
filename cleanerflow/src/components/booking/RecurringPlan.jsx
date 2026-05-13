import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";

const plans = [
  {
    id: "weekly",
    title: "Weekly",
    description: "Best value for regular maintenance",
    discount: 15,
    icon: CalendarCheck,
  },
  {
    id: "biweekly",
    title: "Every 2 Weeks",
    description: "Popular for maintained homes",
    discount: 10,
    icon: CalendarDays,
  },
  {
    id: "monthly",
    title: "Monthly",
    description: "Light maintenance needed",
    discount: 10,
    icon: CalendarRange,
  },
  {
    id: "once",
    title: "One Time",
    description: "Single deep clean",
    discount: 0,
    icon: Calendar,
  },
];

export default function RecurringPlan({ form }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Save with a Recurring Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => form.setValue("recurringPlan", plan.id)}
          >
            <Card
              className={`cursor-pointer transition-colors ${
                form.watch("recurringPlan") === plan.id
                  ? "border-[#2196F3] bg-blue-50"
                  : ""
              }`}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <plan.icon className="h-12 w-12 mb-4 text-[#2196F3]" />
                <h3 className="text-xl font-medium mb-2">{plan.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                {plan.discount > 0 && (
                  <p className="text-lg font-semibold text-green-600">
                    Save {plan.discount}% off
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
