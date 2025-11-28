/**
 * Error Message Component
 *
 * Displays appropriate error messages for different error types.
 *
 * Requirements: 1.5, 6.5
 */

type ErrorType =
  | "insufficient-questions"
  | "quota-exceeded"
  | "corrupted-data"
  | "invalid-question"
  | "general";

interface ErrorMessageProps {
  type: ErrorType;
  message?: string;
}

export default function ErrorMessage({ type, message }: ErrorMessageProps) {
  const getErrorContent = () => {
    switch (type) {
      case "insufficient-questions":
        return {
          icon: "⚠️",
          title: "Not Enough Questions",
          description:
            message || "The question bank doesn't have enough questions to start a quiz.",
          color: "bloodRed",
        };
      case "quota-exceeded":
        return {
          icon: "💾",
          title: "Storage Space Full",
          description:
            message ||
            "Your browser's storage is full. Old data has been cleared to save your progress.",
          color: "warningGlow",
        };
      case "corrupted-data":
        return {
          icon: "🔧",
          title: "Cannot Restore Session",
          description:
            message ||
            "Your previous session data couldn't be restored. You can start a fresh quiz.",
          color: "bloodRed",
        };
      case "invalid-question":
        return {
          icon: "❓",
          title: "Invalid Question Data",
          description: message || "Some questions have invalid data and will be skipped.",
          color: "warningGlow",
        };
      default:
        return {
          icon: "⚠️",
          title: "Error",
          description: message || "An unexpected error occurred.",
          color: "bloodRed",
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className={`p-4 bg-${content.color}/10 border border-${content.color}/30 rounded-lg`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{content.icon}</div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold text-${content.color} mb-1`}>{content.title}</h3>
          <p className="text-ghostWhite/80 text-sm">{content.description}</p>
        </div>
      </div>
    </div>
  );
}
