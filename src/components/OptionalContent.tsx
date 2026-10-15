import { Star } from 'lucide-react';
import { showReviews, type ReviewContent } from '../data/content';
import { useRevealGroup } from '../hooks/useRevealGroup';

export function ReviewsSection({ data }: { data?: ReviewContent }) {
  const sectionRef = useRevealGroup<HTMLElement>(showReviews && Boolean(data?.reviews.length));
  if (!showReviews || !data || !data.reviews.length) return null;
  return <section ref={sectionRef} className="section optional-reviews">
    <div className="container">
      <div className="section-heading" data-reveal>
        <span className="eyebrow">Reviews</span>
        <h2>Words from our <em>community.</em></h2>
        <p className="section-sub">{data.rating} · {data.count}</p>
      </div>
      <div className="review-grid">{data.reviews.slice(0, 4).map((review, index) =>
        <article className="review-card" data-reveal key={`${review.reviewer}-${review.date}`} style={{ transitionDelay: `${index * 100}ms` }}>
          <div className="review-stars" aria-label={`${review.stars} out of 5`} role="img">{Array.from({ length: 5 }, (_, star) => <Star key={star} className={star < review.stars ? 'filled' : ''} size={17} style={{ transitionDelay: `${star * 120}ms` }} />)}</div>
          <p>{review.text}</p><div className="review-meta"><strong>{review.reviewer}</strong><time>{review.date}</time></div>
        </article>)}</div>
    </div>
  </section>;
}
