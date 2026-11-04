import { pricingData } from "@/constants/price";

export const  calculatePrice = (formData) => {
  let basePrice = 0;

  function getBasePrice(serviceType, bedrooms, bathrooms) {
    // Half-baths (1.5, 2.5, …) count as a full bathroom for pricing — matches
    // the "A half-bathroom counts as a full bathroom" copy in the UI and
    // keeps the pricingData table integer-only.
    const bathLookup = Math.ceil(Number(bathrooms));
    const foundPrice = pricingData.find(
      (item) => item.bedrooms == bedrooms && item.bathrooms == bathLookup
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
    // extras may arrive as an array of selected ids (legacy shape) or as a
    // { [id]: quantity } map (new shape, used by the main booking wizard so
    // user can specify # of windows / doors). Normalize via qtyOf.
    const isArray = Array.isArray(formData.extras);
    const qtyOf = (id) => {
      if (isArray) return formData.extras.includes(id) ? 1 : 0;
      const v = formData.extras[id];
      return typeof v === "number" ? v : v ? 1 : 0;
    };
    const unit = {
      cabinet: 30, fridge: 40, oven: 40, laundry: 20,
      window: 10, dish: 20, "glass-door": 20, door: 50, garage: 50,
    };
    for (const id in unit) basePrice += unit[id] * qtyOf(id);
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