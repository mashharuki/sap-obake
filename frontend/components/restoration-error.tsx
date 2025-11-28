/**
 * Restoration Error Component
 *
 * Displays message when previous session cannot be restored due to corrupted data.
 *
 * Requirements: 1.5
 */

export default function RestorationError() {
  return (
    <div className="p-4 bg-bloodRed/10 border border-bloodRed/30 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-2xl">❌</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-bloodRed mb-1">
            Couldn't Restore Previous Session
          </h3>
          <p className="text-ghostWhite/80 text-sm">
            Your previous session data was corrupted and couldn't be restored. You can start a fresh
            quiz session.
          </p>
        </div>
      </div>
    </div>
  );
}
