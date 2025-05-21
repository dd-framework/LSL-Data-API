// component_compiler/src/LiAAPIPanel.jsx
var componentName = "LiA API Panel";
var acceptedDataTypes = [["ddURL*", "ddURL*", "ddStatus*"]];
var componentInformation = "control panel from url + status collection";
var componentExplanation = /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("p", null, "This is a DynDash Component that takes in two Sources that hold an URL Collection and a Source that holds Status Collections from a LSL Data API. It generates a neat little Control Panel that can adjust the settings of such an API."), /* @__PURE__ */ React.createElement("p", null, "Since this is a DynDash Component that is custom-tailored to a specific API, the URL and Status Collections need to include a very specific set of keys."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row bg-gray-600 text-white p-2 rounded-md overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "w-[33%]" }, /* @__PURE__ */ React.createElement("p", null, "Status Collection:"), /* @__PURE__ */ React.createElement("ul", { className: "text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Sending Interval")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Pulling Timeout")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Anomaly Threshold")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Anomaly Window")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Serving")))), /* @__PURE__ */ React.createElement("div", { className: "w-[33%]" }, /* @__PURE__ */ React.createElement("p", null, "One of the URL Collections:"), /* @__PURE__ */ React.createElement("ul", { className: "text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Scan for Devices")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Purge Devices")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Threshold -"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Threshold +")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Window -"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Window +")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Sending -"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Sending +")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Pulling -"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Pulling +")))), /* @__PURE__ */ React.createElement("div", { className: "w-[33%]" }, /* @__PURE__ */ React.createElement("p", null, "The other URL Collection:"), /* @__PURE__ */ React.createElement("ul", { className: "text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Load Dummy"))))), /* @__PURE__ */ React.createElement("p", null, "As a general rule-of-thumb, this Component requires the Sources with the display names", " ", /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "LSL Data API Actions"), ", ", /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "LSL Data API Status"), ", and ", /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "LSL Data API Recording Loaders")), /* @__PURE__ */ React.createElement("p", null, 'All Buttons of the Panel also dispatch any events passed under the "dispatch" key of the response Object received for their request.'), /* @__PURE__ */ React.createElement("p", null, 'To prevent this from happening, create a "suppressEvents" key in the Slot Settings and set it to true.'), /* @__PURE__ */ React.createElement("p", { className: "bg-gray-800 text-white p-2 rounded-md font-mono text-sm overflow-auto" }, "{", /* @__PURE__ */ React.createElement("br", null), "\xA0\xA0\xA0\xA0suppressEvents: true,", /* @__PURE__ */ React.createElement("br", null), "}"), /* @__PURE__ */ React.createElement("p", null, "It is possible to hide the title and explanations by adding the following keys to the exclude array:"), /* @__PURE__ */ React.createElement("div", { className: "space-x-1 text-sm flex flex-row bg-gray-600 text-white p-2 rounded-md overflow-auto" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "title"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "general/info"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "serving/info"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "lsl/info"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "anomaly/info")));
var componentIcon = /* @__PURE__ */ React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "size-6"
  },
  /* @__PURE__ */ React.createElement(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
    }
  )
);
var renderComponent = (uuid, data, slotSettings) => {
  let source_with_url = void 0;
  let source_with_status = void 0;
  let source_with_loading = void 0;
  for (let sourceName in data) {
    for (let propertyName in data[sourceName]) {
      if (propertyName.includes("ddURL")) {
        let urlKeys = Object.keys(data[sourceName][propertyName]);
        if (urlKeys?.includes("Scan for Devices")) {
          source_with_url = sourceName;
        } else if (urlKeys?.includes("Load Dummy")) {
          source_with_loading = sourceName;
        }
      }
      if (propertyName.includes("ddStatus")) {
        source_with_status = sourceName;
      }
    }
  }
  let createButton = (urlKey) => {
    let relevantSource = source_with_url;
    let displayKey = urlKey;
    if (urlKey === "Load") {
      urlKey = "Load Dummy";
      displayKey = "Load";
      relevantSource = source_with_loading;
    }
    let urls = data[relevantSource]["ddURL"];
    let { url, method, headers, body } = urls[urlKey];
    let exclusion = slotSettings?.exclude?.includes(
      `${relevantSource}/${urlKey}`
    );
    if (exclusion) return null;
    let requestObject = {
      method: method || "POST",
      headers: headers || { "Content-Type": "application/json" }
    };
    if (requestObject.method === "POST" && body) {
      requestObject.body = JSON.stringify(body);
    }
    let buttonColor = slotSettings?.colors?.[`${relevantSource}/${urlKey}`] || "rgb(83, 120, 255)";
    let buttonOnClick = async (e) => {
      e.stopPropagation();
      let fetchURL = url;
      if (urlKey === "Load Dummy") {
        let dropdown = e?.target?.closest("span")?.querySelector("select");
        if (!dropdown) return;
        let newKey = dropdown?.value;
        let { method: method2, headers: headers2, body: body2 } = urls[newKey];
        fetchURL = urls[newKey]?.url;
        requestObject = {
          method: method2 || "POST",
          headers: headers2 || { "Content-Type": "application/json" }
        };
        if (requestObject.method === "POST" && body2) {
          requestObject.body = JSON.stringify(body2);
        }
      }
      console.log(fetchURL, requestObject);
      try {
        const response = await fetch(fetchURL, requestObject);
        if (!response.ok) {
          console.log(
            `Button Component for ${relevantSource} (${displayKey}) received an error response!`
          );
        }
        let responseObject = await response.json();
        if (responseObject?.dispatch && !slotSettings?.suppressEvents) {
          for (let eventName of Object.keys(
            responseObject?.dispatch
          )) {
            let eventBody = responseObject?.dispatch[eventName];
            let newEvent = new CustomEvent(
              `${eventName}`,
              eventBody
            );
            document.dispatchEvent(newEvent);
          }
        }
        console.log(responseObject);
      } catch {
        console.log(
          `Button Component for ${relevantSource} (${displayKey}) failed to get a response!`
        );
      }
    };
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-white flex-grow-1 min-w-fit m-1 px-4 py-2 rounded-md hover:bg-blue-500 transition duration-300 shadow-md hover:shadow-blue-500/50 hover:ring-2 hover:ring-blue-300",
        key: `${uuid}-${relevantSource}/${urlKey}`,
        style: { backgroundColor: buttonColor },
        onClick: buttonOnClick
      },
      displayKey
    );
  };
  let createStatus = (statusKey) => {
    let status = data[source_with_status]["ddStatus"];
    let value = status[statusKey];
    let exclusion = slotSettings?.exclude?.includes(
      `${source_with_status}/${statusKey}`
    );
    if (exclusion) return null;
    let statusColor = slotSettings?.colors?.[`${source_with_status}/${statusKey}`] || "rgb(83, 120, 255)";
    let displayValue = "";
    let statusOpacity = "opacity-100";
    let booleanValue = typeof value === "boolean";
    if (booleanValue) {
      statusOpacity = value ? "opacity-100" : "opacity-35";
    } else {
      displayValue = `: ${JSON.stringify(value)}`;
    }
    return /* @__PURE__ */ React.createElement(
      "p",
      {
        className: `text-white ${statusOpacity} flex-grow-1 min-w-fit m-1 px-4 py-2 rounded-full hover:bg-blue-500 transition duration-300 shadow-md`,
        key: `${uuid}-${source_with_status}/${statusKey}`,
        style: { backgroundColor: statusColor }
      },
      statusKey,
      displayValue
    );
  };
  let createDropdown = (list) => {
    let dropdownColor = slotSettings?.colors?.[`${source_with_loading}/Load Dummy`] || "rgb(83, 120, 255)";
    return /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "\n			  w-9 h-9\n			  rounded\n			  appearance-none text-transparent\n			  cursor-pointer focus:outline-none\n			  bg-[url('data:image/svg+xml,%3Csvg%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M19%209l-7%207-7-7%22%3E%3C/path%3E%3C/svg%3E')]\n			  bg-no-repeat bg-center\n			",
        style: { backgroundColor: dropdownColor }
      },
      Object.keys(list).map((key) => {
        if (key === "Load Dummy") {
          return null;
        }
        return /* @__PURE__ */ React.createElement("option", { key, value: key, className: "text-black" }, key);
      })
    );
  };
  let backgroundColor = slotSettings?.colors?.["general/background"] || "rgb(71, 72, 81)";
  let textColor = slotSettings?.colors?.["general/text"] || "rgb(255, 255, 255)";
  let className = `rounded-lg border border-gray-600 flex flex-col flex-grow-1 w-full h-full max-w-full max-h-full justify-center items-center`;
  let titleShow = !slotSettings?.exclude?.includes(`title`);
  let generalInfoShow = !slotSettings?.exclude?.includes(`general/info`);
  let servingInfoShow = !slotSettings?.exclude?.includes(`serving/info`);
  let lslInfoShow = !slotSettings?.exclude?.includes(`lsl/info`);
  let anomalyInfoShow = !slotSettings?.exclude?.includes(`anomaly/info`);
  let scanButton = createButton("Scan for Devices");
  let purgeButton = createButton("Purge Devices");
  let serveMode = createStatus("Serving");
  let isServing = data[source_with_status]["ddStatus"]["Serving"];
  let hasLoaders = Object.keys(data[source_with_loading]?.["ddURL"] || {})?.length > 1;
  let loadList = hasLoaders ? createDropdown(data[source_with_loading]?.["ddURL"]) : null;
  let loadButton = createButton("Load");
  let scanSettings = servingInfoShow ? /* @__PURE__ */ React.createElement("div", { className: "p-2 my-3 bg-gray-300/10 rounded-lg w-[90%] text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "w-full flex justify-center items-center" }, /* @__PURE__ */ React.createElement("span", { className: "w-[35%] " }, scanButton), /* @__PURE__ */ React.createElement("span", { className: "text-xs w-[65%]" }, "(Discover LSL Streams and switch to Live Serving)")), /* @__PURE__ */ React.createElement("div", { className: "w-full flex justify-center items-center" }, /* @__PURE__ */ React.createElement("span", { className: "w-[35%] " }, purgeButton), /* @__PURE__ */ React.createElement("span", { className: "text-xs w-[65%]" }, "(Purge all Devices from Memory and stop Serving)")), hasLoaders && /* @__PURE__ */ React.createElement("div", { className: "w-full flex justify-center items-center" }, /* @__PURE__ */ React.createElement("span", { className: "w-[35%] " }, loadList, loadButton), /* @__PURE__ */ React.createElement("span", { className: "text-xs w-[65%]" }, "(Purge all Devices ..., load and serve Selection)")), isServing && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center w-full" }, serveMode)) : /* @__PURE__ */ React.createElement("div", { className: "p-2 my-3 space-x-2 bg-gray-300/10 rounded-lg w-[90%] text-sm flex justify-center items-center" }, scanButton, purgeButton, hasLoaders && /* @__PURE__ */ React.createElement("span", null, loadList, loadButton), isServing && serveMode);
  if (!scanButton && !purgeButton && !isServing) {
    scanSettings = null;
  }
  let sendingMinus = createButton("Sending -");
  let sendingStatus = createStatus("Sending Interval");
  let sendingPlus = createButton("Sending +");
  let pullingMinus = createButton("Pulling -");
  let pullingStatus = createStatus("Pulling Timeout");
  let pullingPlus = createButton("Pulling +");
  let lslStreamSettings = /* @__PURE__ */ React.createElement("div", { className: "p-2 my-3 text-left text-lg space-x-2 bg-gray-300/10 rounded-lg w-[90%]" }, /* @__PURE__ */ React.createElement("p", null, "LSL Stream Settings:"), lslInfoShow && /* @__PURE__ */ React.createElement("p", { className: "text-left text-xs" }, "Sending dictates how often new batches of incoming data are sent, and the timeout represents the amount of time the API will wait in case the LSL stream does not provide any new values."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row text-sm w-full justify-center items-center" }, sendingMinus, sendingStatus, sendingPlus), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row text-sm w-full justify-center items-center" }, pullingMinus, pullingStatus, pullingPlus));
  if (!sendingMinus && !sendingStatus && !sendingPlus && !pullingMinus && !pullingStatus && !pullingPlus) {
    lslStreamSettings = null;
  }
  let thresholdMinus = createButton("Threshold -");
  let thresholdStatus = createStatus("Anomaly Threshold");
  let thresholdPlus = createButton("Threshold +");
  let windowMinus = createButton("Window -");
  let windowStatus = createStatus("Anomaly Window");
  let windowPlus = createButton("Window +");
  let anomalySettings = /* @__PURE__ */ React.createElement("div", { className: "p-2 my-3 text-left text-lg space-x-2 bg-gray-300/10 rounded-lg w-[90%]" }, /* @__PURE__ */ React.createElement("p", null, "Anomaly Detection Settings:"), anomalyInfoShow && /* @__PURE__ */ React.createElement("p", { className: "text-left text-xs" }, "The Threshold represents the sensitivity of the detection and the Window dictates how many points the anomaly detection uses as context."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row text-sm w-full justify-center items-center" }, thresholdMinus, thresholdStatus, thresholdPlus), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row text-sm w-full justify-center items-center" }, windowMinus, windowStatus, windowPlus));
  if (!thresholdMinus && !thresholdStatus && !thresholdPlus && !windowMinus && !windowStatus && !windowPlus) {
    anomalySettings = null;
  }
  return /* @__PURE__ */ React.createElement("div", { className: "select-none bg-gray-700 rounded-lg border-gray-700 w-full h-full flex flex-col items-center" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: { backgroundColor, color: textColor }
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-[90%]" }, titleShow && /* @__PURE__ */ React.createElement("h2", { className: "text-2xl p-2 my-3 bg-gray-300/10 rounded-lg" }, "LSL Data API Control Panel"), generalInfoShow && /* @__PURE__ */ React.createElement("p", { className: "text-left text-xs" }, "This is a Control Panel for the API endpoints of the LSL Data API Application. It can be used instead of adding a ddURL Component and a ddStatus Component separately, but it only accepts the ddURL and ddStatus Sources specifically provided by the LSL Data API to control its base features.")),
    scanSettings,
    lslStreamSettings,
    anomalySettings
  ));
};
var dataValidator = (data) => {
  let returnArray = [];
  for (let sourceName in data) {
    let compatibleProperty = Object.keys(data[sourceName]).find((key) => {
      return key.includes("ddURL") || key.includes("ddStatus");
    });
    let property = void 0;
    if (compatibleProperty) {
      property = data[sourceName][compatibleProperty];
    }
    if (!property) {
      returnArray.push(sourceName);
      continue;
    }
    let correctDataArray = [];
    for (let propertyName in data[sourceName]) {
      if (!propertyName.includes("ddURL") && !propertyName.includes("ddStatus"))
        continue;
      let existence = data[sourceName][propertyName] && Object.keys(data[sourceName][propertyName])?.length !== 0;
      if (!existence) continue;
      let compatibility = data[sourceName]?.[propertyName] && typeof data[sourceName][propertyName] === "object";
      if (compatibility && propertyName.includes("ddStatus")) {
        let neededKeys = [
          "Sending Interval",
          "Pulling Timeout",
          "Anomaly Threshold",
          "Anomaly Window",
          "Serving"
        ];
        for (let neededKey of neededKeys) {
          if (!Object.keys(data[sourceName][propertyName]).includes(
            neededKey
          )) {
            compatibility = false;
            break;
          }
        }
      } else if (compatibility && propertyName.includes("ddURL")) {
        let neededKeys = [
          "Scan for Devices",
          "Purge Devices",
          "Threshold -",
          "Threshold +",
          "Window -",
          "Window +",
          "Sending -",
          "Sending +",
          "Pulling -",
          "Pulling +"
        ];
        for (let neededKey of neededKeys) {
          if (!Object.keys(data[sourceName][propertyName]).includes(
            neededKey
          )) {
            compatibility = false;
            break;
          }
        }
        if (!compatibility) {
          if (Object.keys(data[sourceName][propertyName]).includes(
            "Load Dummy"
          )) {
            compatibility = true;
          }
        }
      }
      let compatibilityString = compatibility ? "compatible" : "incompatible";
      correctDataArray.push(compatibilityString);
    }
    if (!correctDataArray.includes("compatible")) {
      returnArray.push(sourceName);
    }
  }
  return returnArray;
};
var bundle = {
  name: componentName,
  icon: componentIcon,
  information: componentInformation,
  explanation: componentExplanation,
  dataTypes: acceptedDataTypes,
  customSettingsPane: false,
  settingsMapper: false,
  generalSettings: ["background", "text"],
  dataValidator,
  renderFunction: renderComponent
};
var LiAAPIPanel_default = bundle;
export {
  LiAAPIPanel_default as default
};
