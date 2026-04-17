import { useState } from "react";
import { format } from "date-fns/format";
function generateDates() {
  const list = [];
  const today = new Date();
  const dateCount = today.getDate();
  list.push({
    label: format(today, "dd MMMM"),
    value: today.toISOString()
  });
  for (let i = 1; i < 10; i++) {
    today.setDate(dateCount + i);
    list.push({
      label: format(today, "dd MMMM"),
      value: today.toISOString()
    });
  }
  return list;
}
export default function useDeliveryDate() {
  const [dates] = useState(generateDates);
  return {
    dates
  };
}