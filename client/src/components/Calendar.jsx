import React, { useState, useEffect } from "react";
import "./Calendar.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState(document.querySelector(".calendar"));

  const renderCalendar = () => {
    const initCalendar = () => {
      setCalendar((prevCalendar) => {
        const firstDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const lastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        const monthDays = document.querySelector(".days");
        const lastMonthLastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        ).getDate();
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;
        const days = [];
        monthDays.innerHTML = "";
        for (let x = firstDayIndex; x > 0; x--) {
          days.push(`<div class="prev-date">${lastMonthLastDay - x + 1}</div>`);
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
          if (
            i === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth()
          ) {
            days.push(`<div class="today">${i}</div>`);
          } else {
            days.push(`<div>${i}</div>`);
          }
        }
        for (let j = 1; j <= nextDays; j++) {
          days.push(`<div class="next-date">${j}</div>`);
        }
        monthDays.innerHTML = days.join("");
        return prevCalendar;
      });
    };
    initCalendar();
  };

  useEffect(() => {
    renderCalendar();
  }, [currentDate]);

  return (
    <div className="calendar-container">
      <div className="left">
        <div className="calendar">
          <h1>Appointments</h1>
          <div className="calendar-content">
            <div className="month">
              <i className="fas fa-angle-left prev"></i>
              <div className="date">
                <p>december 2015</p>
              </div>
              <i className="fas fa-angle-right next"></i>
            </div>
            <div className="weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
          </div>
          <div className="days"></div>
          <div className="goto-today">
            <div className="goto">
              <input type="text" placeholder="mm/yyyy" className="date-input" />
              <button className="goto-btn">Go</button>
            </div>
            <button className="today-btn">Today</button>
          </div>
        </div>
      </div>
      {/* <div className="right">
        <div className="today-date">
          <div className="event-day">wed</div>
          <div className="event-date">12th december 2022</div>
        </div>
        <div className="events"></div>
        <div className="add-event-wrapper">
          <div className="add-event-header">
            <div className="title">Add Event</div>
            <i className="fas fa-times close"></i>
          </div>
          <div className="add-event-body">
            <div className="add-event-input">
              <input
                type="text"
                placeholder="Event Name"
                className="event-name"
              />
            </div>
            <div className="add-event-time">
              <div className="add-event-input">
                <input
                  type="time"
                  placeholder="Event Time From"
                  className="event-time-from"
                />
              </div>
              <div className="add-event-input">
                <input
                  type="time"
                  placeholder="Event Time To"
                  className="event-time-to"
                />
              </div>
            </div>
          </div>
          <div className="add-event-footer">
            <button className="add-event-btn">Add Event</button>
          </div>
        </div>
      </div> */}
      <button className="add-event">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default Calendar;
