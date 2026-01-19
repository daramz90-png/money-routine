import seoulApartment from '@assets/generated_images/seoul_apartment_skyline_clean.png';
import housingSubscription from '@assets/generated_images/housing_documents_calculator_clean.png';
import rentalFraud from '@assets/generated_images/rental_checklist_inspection_clean.png';
import propertyTax from '@assets/generated_images/property_tax_calculation_clean.png';
import stockBeginners from '@assets/generated_images/stock_investing_beginner_clean.png';
import reitInvestment from '@assets/generated_images/reit_buildings_skyline_clean.png';
import dividendIncome from '@assets/generated_images/dividend_money_growth_clean.png';
import portfolioAllocation from '@assets/generated_images/portfolio_pie_chart_clean.png';
import monthlyReview from '@assets/generated_images/monthly_investment_review_clean.png';
import workingMom from '@assets/generated_images/working_mom_routine_clean.png';
import investmentFailure from '@assets/generated_images/investment_failure_lesson_clean.png';
import successStory from '@assets/generated_images/real_estate_success_clean.png';

export const realEstateImages: Record<string, string> = {
  buy: seoulApartment,
  subscription: housingSubscription,
  rent: rentalFraud,
  tax: propertyTax,
};

export const investImages: Record<string, string> = {
  stock: stockBeginners,
  'reit-etf': reitInvestment,
  dividend: dividendIncome,
  portfolio: portfolioAllocation,
};

export const columnImages: Record<string, string> = {
  monthly: monthlyReview,
  routine: workingMom,
  failure: investmentFailure,
  gap: successStory,
};

export function getRealEstateImage(category: string): string {
  return realEstateImages[category] || seoulApartment;
}

export function getInvestImage(category: string): string {
  return investImages[category] || stockBeginners;
}

export function getColumnImage(category: string): string {
  return columnImages[category] || monthlyReview;
}
