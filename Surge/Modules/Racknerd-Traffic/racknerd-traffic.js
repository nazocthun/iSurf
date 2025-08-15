let args = getArgs();
let url = `https://nerdvm.racknerd.com/api/client/command.php?key=${args.apikey}&hash=${args.hash}&action=info&bw=true`;
$httpClient.get(url, function (error, response, data) {
  let rawData = extractBwValues(data);
  let content;
  if (rawData && rawData.length > 0) {
    const total = rawData[0];
    const used = rawData[1];
    const free = rawData[2];
    const percentage = rawData[3];
    content = [`流量: ${bytesToSize(used)} (${percentage}%) / ${bytesToSize(total)}`];
  } else {
    content = [`请检查APIkey与API Hash是否正确`];
  }
  $done({
    title: `${args.title}`,
    content: content.join("\n"),
    icon: args.icon || "xserve",
    "icon-color": args.color || "#FF3C83",
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

function extractBwValues(xmlString) {
  const match = xmlString.match(/<bw>(.*?)<\/bw>/);
  if (match && match[1]) {
    const valuesString = match[1].trim();
    const valuesArray = valuesString.split(',');
    return valuesArray;
  } else {
    return [];
  }
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}