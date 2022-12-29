export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function secondsToStr(seconds: number) {
  function numberEnding(number: number) {
    return number > 1 ? "s" : "";
  }

  const years = Math.floor(seconds / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }

  const days = Math.floor((seconds %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }

  const hours = Math.floor((seconds %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }

  const minutes = Math.floor((seconds %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }

  const temp = seconds % 60;
  if (temp) {
    return temp + " second" + numberEnding(temp);
  }

  return "less than a second";
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function isDiscountPeriod() {
  const today = new Date();
  const discountStart = new Date("2022-01-01");
  const discountEnd = new Date("2023-01-15");

  return today >= discountStart && today <= discountEnd;
}
