/**
 * Quota Warning Component
 *
 * Displays warning when localStorage quota is exceeded and old data is cleared.
 *
 * Requirements: 1.5
 */

export default function QuotaWarning() {
  return (
    <div className="p-4 bg-warningGlow/10 border border-warningGlow/30 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-warningGlow mb-1">Storage Space Warning</h3>
          <p className="text-ghostWhite/80 text-sm">
            Your browser's storage space was full. We've cleared some old results to save your
            current progress.
          </p>
        </div>
      </div>
    </div>
  );
}
