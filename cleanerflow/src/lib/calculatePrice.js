import { pricingData } from "@/constants/price";

export const  calculatePrice = (formData) => {
  let basePrice = 0;

  function getBasePrice(serviceType, bedrooms, bathrooms) {
    const foundPrice = pricingData.find(
      (item) => item.bedrooms == bedrooms && item.bathrooms == bathrooms
    );
    if (foundPrice) {
      formData.square_feet = foundPrice.square_feet;
      return {
        price: Number(foundPrice[serviceType]) || 0,
        square_feet: foundPrice.square_feet,
      };
    }
    return { price: 0, square_feet: "N/A" };
  }

  const initialBasePrice = (() => {
    switch (formData.serviceType) {
      case "regular":
        return 119;
      case "deep":
        return 149;
      case "move":
        return 149;
      case "airbnb":
        return 129;
      default:
        return 0;
    }
  })();

  const { price } =
    getBasePrice(formData.serviceType, formData.bedrooms, formData.bathrooms) ||
    0;

  basePrice = Math.max(initialBasePrice, price);

  switch (formData.propertyCondition) {
    case "Well maintained":
      // No surcharge — clean home is the baseline.
      break;
    case "Fair":
      basePrice += 100;
      break;
    case "Need attention":
      basePrice += 200;
      break;
  }

  if (formData.extras) {
    if (formData.extras.includes("cabinet")) basePrice += 30;
    if (formData.extras.includes("fridge")) basePrice += 40;
    if (formData.extras.includes("oven")) basePrice += 40;
    if (formData.extras.includes("laundry")) basePrice += 20;
    if (formData.extras.includes("window")) basePrice += 20;
    if (formData.extras.includes("dish")) basePrice += 20;
    if (formData.extras.includes("glass-door")) basePrice += 20;
    if (formData.extras.includes("door")) basePrice += 50;
    if (formData.extras.includes("garage")) basePrice += 50;
  }

  if (formData.hasPets == "Yes") basePrice += 20;

  let discount = 0;
  if (formData.recurringPlan > 0) {
    discount = 0.15;
  }

  const discountAmount = basePrice * discount;
  basePrice -= discountAmount;

  return {
    subtotal: Math.round(basePrice + discountAmount),
    discount: Math.round(discountAmount),
    total: Math.round(basePrice),
  };
};