import { cn } from "@/lib/utils";
import { NO_DATA_IMAGE, NOTIFICATION_ICON, USERS_ICON2 } from "@/lib/images";
import { useAlerts } from "@/hooks/alerts/useAlerts";
import Loader from "@/components/common/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import useSearch from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const getColorByLevel = (level) => {
  switch (level.toLowerCase()) {
    case "high":
      return "bg-[#DFF6DD] border-[#B6E5B6]";
    //   return "bg-[#FFE5E5] border-[#FFB3B3]"; // Red for high
    case "medium":
      return "bg-[#FEF3DC] border-[#FCE1A6]";
    case "low":
      return "bg-[#E5F0FF] border-[#A2C3FF]";
    default:
      return "bg-[#DFF6DD] border-[#B6E5B6]";
  }
};

const getTimeSlot = (dateString) => {
  const date = dayjs(dateString);
  const hour = date.hour();
  const startHour = hour;
  const endHour = hour + 1;

  const formatHour = (h) => {
    if (h === 0) return "12:00 AM";
    if (h === 12) return "12:00 PM";
    if (h < 12) return `${h}:00 AM`;
    return `${h - 12}:00 PM`;
  };

  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
};

const getRelativeDate = (dateString) => {
  const date = dayjs(dateString);

  if (date.isToday()) {
    return "Today";
  } else if (date.isYesterday()) {
    return "Yesterday";
  } else {
    const daysAgo = dayjs().diff(date, "day");
    if (daysAgo <= 30) {
      return `${daysAgo} days ago`;
    } else {
      return date.format("MMM D, YYYY");
    }
  }
};

const getPriorityOrder = (level) => {
  switch (level.toLowerCase()) {
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
    default:
      return 4;
  }
};

const groupAlertsByDateAndSlot = (alerts) => {
  const grouped = {};

  alerts.forEach((alert) => {
    const date = dayjs(alert.alertCreatedDateTime);
    const dateKey = date.format("YYYY-MM-DD");
    const hour = date.hour();
    const slotKey = `${dateKey}-${hour}`;

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        relativeDate: getRelativeDate(alert.alertCreatedDateTime),
        slots: {},
        sortDate: date,
      };
    }

    if (!grouped[dateKey].slots[hour]) {
      grouped[dateKey].slots[hour] = {
        timeSlot: getTimeSlot(alert.alertCreatedDateTime),
        hour: hour,
        items: [],
      };
    }

    grouped[dateKey].slots[hour].items.push({
      text: alert.alert,
      level: alert.alertLevel,
      type: alert.category,
      color: getColorByLevel(alert.alertLevel),
      created_at: alert.alertCreatedDateTime,
      alertId: alert.alertId,
      department: alert.department,
      source: alert.source,
      actioned: alert.alertActioned,
      priority: getPriorityOrder(alert.alertLevel),
    });
  });

  return Object.values(grouped)
    .sort((a, b) => b.sortDate.diff(a.sortDate))
    .map((dayGroup) => {
      const sortedSlots = Object.values(dayGroup.slots)
        .sort((a, b) => a.hour - b.hour)
        .map((slot) => {
          slot.items.sort((a, b) => a.priority - b.priority);
          return slot;
        });

      return {
        ...dayGroup,
        slots: sortedSlots,
      };
    });
};

const arrangeAlertsByPriority = (items) => {
  const high = items.filter((item) => item.level.toLowerCase() === "high");
  const medium = items.filter((item) => item.level.toLowerCase() === "medium");
  const low = items.filter((item) => item.level.toLowerCase() === "low");

  const arranged = [];
  const maxLength = Math.max(high.length, medium.length, low.length);

  for (let i = 0; i < maxLength; i++) {
    const row = [];
    if (high[i]) row.push(high[i]);
    if (medium[i]) row.push(medium[i]);
    if (low[i]) row.push(low[i]);
    if (row.length > 0) arranged.push(row);
  }

  return arranged;
};

function AlertCard({ level, type, text, color, department, source, actioned }) {
  return (
    <div className={cn("rounded-xl p-4 px-5 space-y-6 w-full", color)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold bg-white text-[#3B4753] px-2 py-0.5 rounded-sm border border-black/10">
            {level}
          </span>
          <span className="text-sm font-semibold bg-white text-[#3B4753] px-2 py-0.5 rounded-sm border border-black/10">
            {type}
          </span>
        </div>
        <p className="text-base text-primary leading-snug">{text}</p>
        {/* <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{department}</span>
          {actioned === "Yes" && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Actioned
            </span>
          )}
        </div> */}
      </div>
      <div>
        <img src={USERS_ICON2} alt="" />
      </div>
    </div>
  );
}

export default function AlertsTimeline() {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);
  const { alerts, isLoading } = useAlerts({ search: debouncedSearch });

  const transformedAlerts = alerts ? groupAlertsByDateAndSlot(alerts) : [];

  return (
    <div className="pb-6 h-[calc(100vh-190px)] px-4 md:px-0 flex-1  !pl-5 overflow-auto">
      {isLoading ? (
        <Loader />
      ) : transformedAlerts.length > 0 ? (
        <div className="relative border-l-[2px] border-main pl-10 lg:pl-12 space-y-8">
          {transformedAlerts.map((dayGroup, dayIndex) => (
            <div key={dayIndex} className="space-y-6">
              <div className="relative first:pt-2">
                <div className="absolute -left-[60px] lg:-left-[70px] top-0">
                  <div className="flex items-center justify-center">
                    <img src={NOTIFICATION_ICON} alt="notification" />
                  </div>
                </div>
                <div className="text-primary text-lg font-semibold mb-4">
                  {dayGroup.relativeDate}
                </div>
              </div>

              {dayGroup.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="space-y-4 ml-4">
                  <div className="text-primary text-sm font-medium">
                    {slot.timeSlot}
                  </div>

                  <div className="space-y-6">
                    {arrangeAlertsByPriority(slot.items).map(
                      (row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
                        >
                          {row.map((item) => (
                            <AlertCard key={item.alertId} {...item} />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 h-full">
          <div className="flex justify-center">
            <img src={NO_DATA_IMAGE} alt="" />
          </div>
          <p className="text-lg text-center text-secondary/60">
            No Data Available
          </p>
        </div>
      )}
    </div>
  );
}
