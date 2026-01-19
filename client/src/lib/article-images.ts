import seoulApartment from '@assets/generated_images/seoul_apartment_market_skyline.png';
import housingSubscription from '@assets/generated_images/housing_subscription_documents_calculator.png';
import rentalFraud from '@assets/generated_images/rental_fraud_prevention_checklist.png';
import propertyTax from '@assets/generated_images/property_tax_calculation_strategy.png';
import stockBeginners from '@assets/generated_images/stock_investing_for_beginners.png';
import reitInvestment from '@assets/generated_images/reit_real_estate_investment.png';
import dividendIncome from '@assets/generated_images/dividend_income_money_growth.png';
import portfolioAllocation from '@assets/generated_images/portfolio_asset_allocation_chart.png';
import monthlyReview from '@assets/generated_images/monthly_investment_review_january.png';
import workingMom from '@assets/generated_images/working_mom_daily_routine.png';
import investmentFailure from '@assets/generated_images/investment_failure_lessons_learned.png';
import successStory from '@assets/generated_images/real_estate_upgrade_success_story.png';

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
