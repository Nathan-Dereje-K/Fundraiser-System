import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const AlertMessage = ({ type, message }) => {
  const alertStyles = {
    success: {
      bgColor: "bg-green-50",
      textColor: "text-green-500",
      icon: faCircleCheck,
    },
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-500",
      icon: faCircleXmark,
    },
  };

  const { bgColor, textColor, icon } = alertStyles[type] || alertStyles.error;

  return (
    <div
      className={`flex items-start space-x-3 mb-8 text-sm ${bgColor} p-4 rounded-lg`}
    >
      <FontAwesomeIcon className={`${textColor} text-lg pt-3`} icon={icon} />
      <p className="text-gray-700 leading-relaxed">{message}</p>
    </div>
  );
};

export default AlertMessage;
