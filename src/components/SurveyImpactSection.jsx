import React from 'react';
import { SURVEY_SUMMARY, PROGRAM_FEEDBACK, CONTINUE_INTEREST } from '../data/surveyFeedback';
import InfiniteTestimonialGallery from './InfiniteTestimonialGallery';

const RATING_BAR_COLORS = {
  5: '#23c07e',
  4: '#f97316',
  3: '#eab308',
  2: '#a3a3a3',
  1: '#737373',
};

const SurveyImpactSection = () => {
  const { instructorRating, favoriteUnit } = SURVEY_SUMMARY;
  const fiveStar = instructorRating.ratings.find((r) => r.score === 5);
  const fourStar = instructorRating.ratings.find((r) => r.score === 4);

  return (
    <>
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
        <div className="grid md:grid-cols-2 gap-8 text-center mb-10 max-w-2xl mx-auto">
          <div>
            <h4 className="text-4xl font-bold text-[#23c07e] mb-2">{fiveStar.percent}%</h4>
            <p className="text-gray-700 font-medium">Rated Instructors 5/5</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-orange-500 mb-2">{fourStar.percent}%</h4>
            <p className="text-gray-700 font-medium">Rated Instructors 4/5</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Instructor Ratings</h3>
            <div className="space-y-2">
              {instructorRating.ratings
                .slice()
                .reverse()
                .map((r) => (
                  <div key={r.score} className="flex items-center gap-3 text-sm">
                    <span className="w-16 shrink-0 text-gray-700 font-medium">{r.score}/5</span>
                    <div className="flex-grow bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-5 rounded-full text-xs text-white flex items-center justify-center min-w-[2rem]"
                        style={{
                          width: `${Math.max(r.percent, r.percent > 0 ? 8 : 0)}%`,
                          backgroundColor: RATING_BAR_COLORS[r.score],
                        }}
                      >
                        {r.percent > 0 && `${r.percent}%`}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Favorite Unit</h3>
            <div className="space-y-2">
              {favoriteUnit.units.map((unit) => (
                <div key={unit.name} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: unit.color }}
                    aria-hidden="true"
                  />
                  <span className="w-40 shrink-0 text-gray-700">{unit.name}</span>
                  <div className="flex-grow bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-5 rounded-full text-xs text-white flex items-center justify-center"
                      style={{ width: `${unit.percent}%`, backgroundColor: unit.color }}
                    >
                      {unit.percent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <InfiniteTestimonialGallery
          title="What Students Said About the Program"
          testimonials={PROGRAM_FEEDBACK}
        />
      </div>

      <div className="mt-16 pb-4">
        <InfiniteTestimonialGallery
          title="Students Who Want to Continue"
          testimonials={CONTINUE_INTEREST}
        />
      </div>
    </>
  );
};

export default SurveyImpactSection;
