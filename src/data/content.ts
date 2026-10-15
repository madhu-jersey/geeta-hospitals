export const showReviews = false;

export type Review = {
  reviewer: string;
  date: string;
  text: string;
  stars: number;
};

export type ReviewContent = {
  rating: string;
  count: string;
  reviews: Review[];
};

// No review, rating, or count source data has been supplied.
export const reviewsData: ReviewContent | undefined = undefined;
