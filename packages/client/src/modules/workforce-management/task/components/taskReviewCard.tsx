import React from "react";
import { BiTimeFive } from "@react-icons/all-files/bi/BiTimeFive";
import { FiCheck } from "@react-icons/all-files/fi/FiCheck";
import ToolTip from "../../../../components/ToolTip";
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function displayStatus(status: string) {
  switch (status) {
    case "completed":
      return (
        <div className="task-card-time text-greenColor">
          <span className="mr-1 text-sm">
            <FiCheck />
          </span>
          Completed
        </div>
      );
    case "delay":
      return (
        <div className="task-card-time task-delay">
          <span className="mr-1 text-sm">
            <BiTimeFive />
          </span>
          Delay
        </div>
      );
    default:
      null;
  }
}
const taskReviewCard = ({ taskName, projectName, priority, status }) => {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{taskName}</h4>
      </div>
      <div className="task-card-mid">
        <div className="task-card-project">{projectName}</div>
        {displayStatus(status)}
        {/* <div className="task-card-time">
<span className="mr-1 text-sm">
  <BiTimeFive />
</span>
2 days left
</div> */}
      </div>
      <div className="task-card-footer">
        <p
          className={
            priority === "high"
              ? "text-priority1Color"
              : priority === "low"
              ? "text-priority3Color"
              : "text-priority2Color"
          }
        >
          {capitalizeFirstLetter(priority)}
        </p>
        <div className="user-img-group">
          <ToolTip message={"Arjun C M"} data-bs-placement={"bottom"}>
            <img
              src="/imgs/user/user1.png"
              className="user-img-sm"
              alt="user"
            />
          </ToolTip>
        </div>
      </div>
    </div>
  );
};
export default taskReviewCard;
