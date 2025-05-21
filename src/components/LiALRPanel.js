// component_compiler/src/LiALRPanel.jsx
var componentName = "LabRecorder Panel";
var acceptedDataTypes = [["ddURL*", "ddStatus*"]];
var componentInformation = "control panel from url + status collection";
var componentExplanation = /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("p", null, "This is a DynDash Component that takes in a Source that holds an URL Collection and a Source that holds Status Collections from a LSL Data API's LabRecorder endpoints. It generates a neat little Control Panel that can adjust the LabRecorder settings of such an API's LabRecorder Endpoints."), /* @__PURE__ */ React.createElement("p", null, "Since this is a DynDash Component that is custom-tailored to a specific API endpoint, the URL and Status Collections need to include a very specific set of keys."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row bg-gray-600 text-white p-2 rounded-md overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "w-[50%]" }, /* @__PURE__ */ React.createElement("p", null, "URL Collection:"), /* @__PURE__ */ React.createElement("ul", { className: "text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Connect LabRecorder")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Set LabRecorder")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Start LabRecorder")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "Stop LabRecorder")))), /* @__PURE__ */ React.createElement("div", { className: "w-[50%]" }, /* @__PURE__ */ React.createElement("p", null, "Status Collection:"), /* @__PURE__ */ React.createElement("ul", { className: "text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "LabRecorder Connected")), /* @__PURE__ */ React.createElement("li", { className: "space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "LabRecorder Preset"))))), /* @__PURE__ */ React.createElement("p", null, 'All Buttons of the Panel also dispatch any events passed under the "dispatch" key of the response Object received for their request.'), /* @__PURE__ */ React.createElement("p", null, 'To prevent this from happening, create a "suppressEvents" key in the Slot Settings and set it to true.'), /* @__PURE__ */ React.createElement("p", { className: "bg-gray-800 text-white p-2 rounded-md font-mono text-sm overflow-auto" }, "{", /* @__PURE__ */ React.createElement("br", null), "\xA0\xA0\xA0\xA0suppressEvents: true,", /* @__PURE__ */ React.createElement("br", null), "}"), /* @__PURE__ */ React.createElement("p", null, "It is possible to hide the title and explanations by adding the following keys to the exclude array:"), /* @__PURE__ */ React.createElement("div", { className: "space-x-1 text-sm flex flex-row bg-gray-600 text-white p-2 rounded-md overflow-auto" }, /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "title"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "general/info"), /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900/50 px-2 rounded-lg" }, "recording/info")));
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
  for (let sourceName in data) {
    for (let propertyName in data[sourceName]) {
      if (propertyName.includes("ddURL")) {
        source_with_url = sourceName;
      }
      if (propertyName.includes("ddStatus")) {
        source_with_status = sourceName;
      }
    }
  }
  let createButton = (urlKey) => {
    let urls = data[source_with_url]["ddURL"];
    let { url, method, headers, body } = urls[urlKey];
    let exclusion = slotSettings?.exclude?.includes(
      `${source_with_url}/${urlKey}`
    );
    if (exclusion) return null;
    let requestObject = {
      method: method || "POST",
      headers: headers || { "Content-Type": "application/json" }
    };
    if (requestObject.method === "POST" && body) {
      requestObject.body = JSON.stringify(body);
    }
    let buttonColor = slotSettings?.colors?.[`${source_with_url}/${urlKey}`] || "rgb(83, 120, 255)";
    let buttonOnClick = async (e) => {
      e.stopPropagation();
      if (["Set LabRecorder", "Start LabRecorder"].includes(urlKey)) {
        let basePanel2 = e?.target?.closest(".lrBasePanel");
        let newBody = {};
        const fields2 = [
          "task",
          "run",
          "participant",
          "session",
          "acquisition",
          "modality"
        ];
        for (let field of fields2) {
          let input = basePanel2?.querySelector(`#${field}`);
          let value = input?.value;
          let newValue = value.replaceAll("\\", "_").replaceAll("/", "_").replaceAll("|", "_").replaceAll("<", "_").replaceAll(">", "_").replaceAll(":", "_").replaceAll(`"`, "_").replaceAll("?", "_").replaceAll("*", "_").replaceAll(".", "_").replaceAll(" ", "_");
          if (field === "run") {
            newValue = parseInt(newValue) || 1;
          }
          if (value) {
            newBody[field] = newValue;
          }
        }
        requestObject.body = JSON.stringify(newBody);
      }
      try {
        const response = await fetch(url, requestObject);
        if (!response.ok) {
          console.log(
            `Button Component for ${source_with_url} (${urlKey}) received an error response!`
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
          `Button Component for ${source_with_url} (${urlKey}) failed to get a response!`
        );
      }
    };
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-white flex-grow-1 min-w-fit m-1 px-4 py-2 rounded-md hover:bg-blue-500 transition duration-300 shadow-md hover:shadow-blue-500/50 hover:ring-2 hover:ring-blue-300",
        key: `${uuid}-${source_with_url}/${urlKey}`,
        style: { backgroundColor: buttonColor },
        onClick: buttonOnClick
      },
      urlKey
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
  let backgroundColor = slotSettings?.colors?.["general/background"] || "rgb(71, 72, 81)";
  let textColor = slotSettings?.colors?.["general/text"] || "rgb(255, 255, 255)";
  let className = `rounded-lg border border-gray-600 flex flex-col flex-grow-1 w-full h-full max-w-full max-h-full justify-center items-center`;
  let titleShow = !slotSettings?.exclude?.includes(`title`);
  let generalInfoShow = !slotSettings?.exclude?.includes(`general/info`);
  let recordingInfoShow = !slotSettings?.exclude?.includes(`recording/info`);
  let connectLR = createButton("Connect LabRecorder");
  let lrStatus = createStatus("LabRecorder Connected");
  let lrPreset = data[source_with_status]["ddStatus"]["LabRecorder Preset"];
  let connectionPanel = /* @__PURE__ */ React.createElement("div", { className: "p-2 my-3 text-left text-lg space-x-2 bg-gray-300/10 rounded-lg w-[90%]" }, /* @__PURE__ */ React.createElement("p", null, "Connection:"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row text-sm w-full justify-center items-center overflow-auto" }, connectLR, lrStatus));
  if (!connectLR && !lrStatus) {
    connectionPanel = null;
  }
  let setLR = createButton("Set LabRecorder");
  let startLR = createButton("Start LabRecorder");
  let stopLR = createButton("Stop LabRecorder");
  let fields = lrPreset || {
    task: "MemoryGuided",
    run: "2",
    participant: "P003",
    session: "Session1",
    acquisition: "Acq1",
    modality: "eeg"
  };
  let basePanel = /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "p-2 my-3 text-left text-lg space-x-2 bg-gray-300/10 rounded-lg w-[90%] lrBasePanel",
      onClick: (e) => e.stopPropagation()
    },
    /* @__PURE__ */ React.createElement("p", null, "Recording Settings:"),
    recordingInfoShow && /* @__PURE__ */ React.createElement("p", { className: "text-left text-xs" }, "The LabRecorder itself has a couple of Recording Settings that can be set through this interface:"),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col text-black w-full justify-center items-center overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-4 p-4" }, Object.entries(fields).map(([key, placeholder]) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key,
        className: "flex flex-col text-sm w-[30%]"
      },
      /* @__PURE__ */ React.createElement(
        "label",
        {
          className: "mb-1 capitalize",
          style: { color: textColor }
        },
        key,
        ":"
      ),
      /* @__PURE__ */ React.createElement(
        "input",
        {
          id: key,
          type: key === "run" ? "number" : "text",
          placeholder,
          defaultValue: placeholder,
          className: "p-2 rounded bg-gray-500 text-white"
        }
      )
    )))),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-row text-sm w-full justify-center items-center overflow-auto" }, setLR, startLR, stopLR)
  );
  if (!setLR && !startLR && !stopLR) {
    basePanel = null;
  }
  return /* @__PURE__ */ React.createElement("div", { className: "select-none bg-gray-700 rounded-lg border-gray-700 w-full h-full flex flex-col items-center" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: { backgroundColor, color: textColor }
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-[90%]" }, titleShow && /* @__PURE__ */ React.createElement("h2", { className: "text-2xl p-2 my-3 bg-gray-300/10 rounded-lg" }, "LabRecorder Control Panel"), generalInfoShow && /* @__PURE__ */ React.createElement("p", { className: "text-left text-xs" }, "This is a Control Panel for the LabRecorder API endpoints of the LSL Data API Application. It can be used instead of adding a ddURL Component and a ddStatus Component separately, but it only accepts the ddURL and ddStatus Sources specifically provided by the LSL Data API to control its connection to the LabRecorder.")),
    connectionPanel,
    basePanel
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
          "LabRecorder Connected",
          "LabRecorder Preset"
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
          "Connect LabRecorder",
          "Set LabRecorder",
          "Start LabRecorder",
          "Stop LabRecorder"
        ];
        for (let neededKey of neededKeys) {
          if (!Object.keys(data[sourceName][propertyName]).includes(
            neededKey
          )) {
            compatibility = false;
            break;
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
var LiALRPanel_default = bundle;
export {
  LiALRPanel_default as default
};
