/**
 * Insufficient Questions Error Component
 *
 * Displays error message when question bank has fewer than required questions.
 *
 * Requirements: 1.5
 */

interface InsufficientQuestionsErrorProps {
  available: number;
  required: number;
}

export default function InsufficientQuestionsError({
  available,
  required,
}: InsufficientQuestionsErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-shadowGray/80 backdrop-blur-sm rounded-lg border-2 border-bloodRed/30 p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-creepster text-bloodRed mb-2">Not Enough Questions</h1>
          <p className="text-ghostWhite/80 mb-4">
            The question bank doesn't have enough questions to start a quiz.
          </p>
        </div>

        <div className="mb-6 p-4 bg-darkVoid/50 rounded border border-bloodRed/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-ghostWhite/60">Available:</span>
            <span className="text-2xl font-bold text-bloodRed">{available}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ghostWhite/60">Required:</span>
            <span className="text-2xl font-bold text-hauntedOrange">{required}</span>
          </div>
        </div>

        <p className="text-sm text-ghostWhite/60">
          Please add more questions to the question bank to start a quiz session.
        </p>
      </div>
    </div>
  );
}
