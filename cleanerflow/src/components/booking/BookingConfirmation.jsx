import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Calendar, MapPin, User, Phone, Mail, X } from "lucide-react";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";

export default function BookingConfirmation({ bookingData, onEdit, onClose }) {
  const formatTimes = (preferredTimes) => {
    return Object.entries(preferredTimes || {})
      .map(([dateStr, times]) => {
        const date = parse(dateStr, "yyyy-MM-dd", new Date());
        const formattedDate = format(date, "EEE, MMM do", { locale: enUS });
        const timesList = Array.isArray(times) ? times.join(", ") : times;
        return `${formattedDate}: ${timesList}`;
      })
      .join("\n");
  };

  const getServiceTypeName = (type) => {
    switch (type) {
      case "regular":
        return "Regular Cleaning";
      case "deep":
        return "Deep Cleaning";
      case "move":
        return "Move In/Out Cleaning";
      case "airbnb":
        return "Airbnb Cleaning";
      default:
        return "Cleaning Service";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <Card className="border-2 border-primary/30 bg-primary/5 relative">
        <CardContent className="p-4">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <div className="text-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-green-800 mb-1">
              {bookingData.isEstimateOnly ? "Estimate Request Submitted!" : "Booking Request Submitted!"}
            </h2>
            <p className="text-sm text-green-700">
              Thank you for choosing our cleaning service. We'll review your request and {bookingData.isEstimateOnly ? "send you an estimate" : "confirm availability"} as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Service Details */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Service Details
                </h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Service Type:</span>
                    <span>{getServiceTypeName(bookingData.serviceType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bedrooms:</span>
                    <span>{bookingData.bedrooms} {bookingData.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bathrooms:</span>
                    <span>{bookingData.bathrooms} {bookingData.bathrooms === 1 ? "bathroom" : "bathrooms"}</span>
                  </div>
                  {bookingData.square_feet && (
                    <div className="flex justify-between">
                      <span className="font-medium">Square Feet:</span>
                      <span>{bookingData.square_feet} sqft</span>
                    </div>
                  )}
                  {bookingData.extras && bookingData.extras.length > 0 && (
                    <div>
                      <span className="font-medium">Extras:</span>
                      <div className="mt-1">
                        {bookingData.extras.map((extra, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {extra}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Property Condition:</span>
                    <span>{bookingData.propertyCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pets:</span>
                    <span>{bookingData.hasPets}</span>
                  </div>
                </div>
              </div>

              {/* Schedule - only show for actual bookings, not estimates */}
              {!bookingData.isEstimateOnly && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                    Requested Schedule
                  </h3>
                  <div className="bg-white rounded-lg p-2 border">
                    <pre className="text-gray-700 whitespace-pre-wrap text-xs">
                      {formatTimes(bookingData.preferredTimes)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Contact & Address */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <User className="h-4 w-4 text-purple-600 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-3" />
                    <span>{bookingData.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-3" />
                    <span>{bookingData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                    <span>{bookingData.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 text-red-600 mr-2" />
                  Service Address
                </h3>
                <div className="bg-white rounded-lg p-2 border">
                  <div className="text-gray-700 text-sm">
                    <div>{bookingData.streetAddress}</div>
                    {bookingData.unitNumber && (
                      <div className="text-gray-600">{bookingData.unitNumber}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Total Estimate
                </h3>
                <div className="bg-primary text-white rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">${bookingData.totalPrice}</div>
                  <div className="text-xs opacity-90">Final price may vary based on actual conditions</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button
              onClick={onEdit}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 text-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Booking
            </Button>
            <p className="text-gray-600 mt-2 text-xs">
              Need to make changes? Click the edit button above to modify your booking details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}