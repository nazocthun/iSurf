// forked from https://raw.githubusercontent.com/412999826/surge-panel/refs/heads/main/VPS-info.js
let args = getArgs();
let url = `https://api.64clouds.com/v1/getLiveServiceInfo?veid=${args.veid}&api_key=${args.apikey}`;
$httpClient.get(url, function (error, response, data) {
  let jsonData = JSON.parse(data);
  let used = jsonData.data_counter;
  let total = jsonData.plan_monthly_data;
  let resetday = jsonData.data_next_reset;
  let percent = total ? ((used / total) * 100).toFixed(2) : "0.00";
  let content = [`Traffic: ${bytesToSize(used)}  (${percent}%) / ${bytesToSize(total)}`];
  content.push(`Reset in ${formatTime(resetday)}, ${getResetDaysLeft(resetday)} days left.`);

  $done({
    title: `${args.title}`,
    content: content.join("\n"),
    icon: args.icon || "xserve",
    "icon-color": args.color || "#ebc142",
  });
});

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function formatTime(time) {
  if (time < 1000000000000) time *= 1000;

  let dateObj = new Date(time);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function getResetDaysLeft(reset) {
  if (!reset) return;

  let now = new Date().getTime();
  let resetTime;
  if (/^[\d.]+$/.test(reset)) {
    resetTime = parseInt(reset) * 1000;
  } else {
    resetTime = new Date(reset).getTime();
  }

  let daysLeft = Math.ceil((resetTime - now) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : null;
}