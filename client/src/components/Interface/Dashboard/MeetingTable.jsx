import React, { useState } from "react";
import "./MeetingTable.css";

const MeetingTable = ({ meetings }) => {
  const [showAllMeetings, setShowAllMeetings] = useState(false);

  return (
    <div className="meeting-table">
      <h1>Upcoming Meetings</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          {meetings
            .slice(0, showAllMeetings ? meetings.length : 5)
            .map((meeting) => (
              <tr key={meeting.id}>
                <td>{meeting.title}</td>
                <td>{meeting.date}</td>
                <td>{meeting.time}</td>
                <td>{meeting.location}</td>
                <td>
                  <ul className="participants">
                    {meeting.participants.map((participant) => (
                      <i className="bi bi-person" key={participant.id}></i>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {meetings.length > 5 && (
        <a
          className="scroll-indicator"
          onClick={() => setShowAllMeetings(!showAllMeetings)}
        >
          {showAllMeetings
            ? "- Less meetings"
            : `+ ${meetings.length - 5} more meetings`}
        </a>
      )}
    </div>
  );
};

export default MeetingTable;
