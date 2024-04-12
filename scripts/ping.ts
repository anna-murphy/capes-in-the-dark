const LOCATIONS = {
  cf: "https://us-central1-capes-in-the-dark.cloudfunctions.net/",
  capes: "https://capes-in-the-dark.web.app/",
  local: "localhost:5001/capes-in-the-dark/us-central1/",
} as const;

const ENDPOINTS = {
  ping: "ping",
  citwm: "capes-in-the-west-march/rss.xml",
} as const;

type LocationKeys = keyof typeof LOCATIONS;
type Locations = (typeof LOCATIONS)[keyof typeof LOCATIONS];
type EndpointKeys = keyof typeof ENDPOINTS;
type Endpoints = (typeof ENDPOINTS)[keyof typeof ENDPOINTS];
type Url = `${Locations}${Endpoints}`;

function help(): void {
  if (process.argv.includes("-h") || process.argv.includes("help")) {
    console.log(
      "Fetch an API endpoint. Specify locations and endpoints via args",
    );
    console.log(
      `\tLocations: [${Object.keys(LOCATIONS).join(", ")}] (default: ${"cf"})`,
    );
    console.log(
      `\tEndpoints: [${Object.keys(ENDPOINTS).join(", ")}] (default: ${"ping"})`,
    );
    process.exit();
  }
}

function validateLocation(): LocationKeys {
  const validLocations = Object.keys(LOCATIONS);
  for (const arg of process.argv.map((arg) => arg.toLowerCase())) {
    if (validLocations.includes(arg)) return arg as LocationKeys;
  }
  console.log("No valid location argument found - defaulting to cf");
  return "cf" as LocationKeys;
}

function validateEndpoint(): EndpointKeys {
  const validEndpoints = Object.keys(ENDPOINTS);
  for (const arg of process.argv.map((arg) => arg.toLowerCase())) {
    if (validEndpoints.includes(arg)) return arg as EndpointKeys;
  }
  console.log("No valid endpoint argument found - defaulting to ping");
  return "ping" as EndpointKeys;
}

async function doFetch(url: Url): Promise<void> {
  console.log(`Fetch: ${url}`);
  const resp = await fetch(url);
  console.log(`Status: ${resp.status}`);
  const text = await resp.text();
  console.log(text);
}

function main(): void {
  help();
  void doFetch(
    `${LOCATIONS[validateLocation()]}${ENDPOINTS[validateEndpoint()]}`,
  );
}

main();
