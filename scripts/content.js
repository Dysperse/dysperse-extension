let session;

/**
 * Get session data
 */
chrome.runtime.sendMessage({ action: "getSessionData" }, (response) => {
  session = response;
  renderPopup();
});

const useApi = async (endpoint, params) => {
  const property =
    session.properties.find((p) => p.selected) || session.properties[0];

  const addedParams = {
    sessionId: session.current.token,
    property: property.propertyId,
    accessToken: property.accessToken,
    userIdentifier: session.user.identifier,

    ...params,
  };
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "useApi", endpoint, params: addedParams },
      (response) => {
        if (response) {
          resolve(response);
        } else {
          reject(false);
        }
      }
    );
  });
};

function toast(message) {
  const toast = document.createElement("div");
  toast.className = "dysperse-toast";
  toast.innerHTML = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

const icons = {
  createTask: `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="48"><path d="M480-80q-85 0-158-30.5T195-195q-54-54-84.5-127T80-480q0-84 30.5-157T195-764q54-54 127-85t158-31q75 0 140 24t117 66l-43 43q-44-35-98-54t-116-19q-145 0-242.5 97.5T140-480q0 145 97.5 242.5T480-140q37 0 71.5-7t66.5-21l45 46q-41 20-87 31t-96 11Zm290-90v-120H650v-60h120v-120h60v120h120v60H830v120h-60ZM421-298 256-464l45-45 120 120 414-414 46 45-460 460Z"/></svg>`,
  close: `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="48"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>`,
};

document.head.innerHTML += `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Space+Grotesk:wght@600&display=swap" rel="stylesheet">
`;

/**
 * Container where button and popup will be rendered
 */
const container = document.createElement("div");
container.id = "dysperse-container";

const button = document.createElement("div");
button.id = "dysperse-button";
button.innerHTML = icons.createTask;
container.appendChild(button);

const popup = document.createElement("div");
popup.id = "dysperse-popup";

const handleOpen = () => {
  popup.classList.add("dysperse-popup-open");
  document.getElementById("dysperse-title-input").focus();
};

const handleClose = () => popup.classList.remove("dysperse-popup-open");

popup.addEventListener("click", handleClose);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") handleClose();
});

document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "d") {
    e.preventDefault();
    handleOpen();
  }
});

function renderPopup() {
  popup.innerHTML = `
<div id="dysperse-popup-container">
    <div id="dysperse-popup-title">
        <div class="dysperse-font-heading">Create Task</div>
    </div>
    <div id="dysperse-popup-content"></div>
    <div id="dysperse-popup-footer"></div>
</div>
`;

  const popupContainer = popup.querySelector("#dysperse-popup-container");
  popupContainer.addEventListener("click", (e) => e.stopPropagation());

  const popupContent = popup.querySelector("#dysperse-popup-content");
  const popupFooter = popup.querySelector("#dysperse-popup-footer");

  const titleInput = document.createElement("input");
  titleInput.className = "dysperse-popup-input";
  titleInput.id = "dysperse-title-input";
  titleInput.placeholder = "Task name";
  titleInput.autofocus = true;

  titleInput.addEventListener("keypress", (e) => {
    const value = e.target.value;
    console.log(value);
    if (value.length == 1) {
      e.target.value = value.toUpperCase();
    }
  });

  const descriptionInput = document.createElement("textarea");
  descriptionInput.className = "dysperse-popup-input";
  descriptionInput.placeholder = "Task name";

  const d = new Date();
  const dateInput = document.createElement("input");
  dateInput.className = "dysperse-popup-input";
  dateInput.placeholder = "Date";
  dateInput.type = "datetime-local";

  dateInput.value = `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}T${(
    d.getHours() + 1
  )
    .toString()
    .padStart(2, "0")}:${(d.getMinutes() + 1).toString().padStart(2, "0")}`;

  const submitButton = document.createElement("div");
  submitButton.className = "dysperse-popup-button";
  submitButton.innerHTML = "Create Task";
  submitButton.tabIndex = "0";

  const handleSubmit = async () => {
    const data = {
      due: dateInput.value,
      title: titleInput.value,
      columnId: "-1",
      description: descriptionInput.value,
      pinned: false,
    };

    try {
      submitButton.innerHTML = "Creating...";
      submitButton.disabled = true;
      const res = await useApi("property/boards/column/task/create", data);
      console.log(res);
      titleInput.value = "";
      descriptionInput.value = "";
      submitButton.innerHTML = "Create Task";
      submitButton.disabled = false;
      toast("Created task!");
      handleClose();
    } catch {
      toast("Yikes! Something went wrong. Please try again later");
    }
  };

  submitButton.addEventListener("click", handleSubmit);

  popupContent.appendChild(titleInput);
  popupContent.appendChild(dateInput);
  popupContent.appendChild(descriptionInput);
  popupFooter.appendChild(submitButton);
}

container.appendChild(popup);

button.addEventListener("click", handleOpen);

const closeButton = document.createElement("div");
closeButton.id = "dysperse-close-button";
closeButton.innerHTML = icons.close;
container.appendChild(closeButton);

closeButton.addEventListener("click", () => {
  container.remove();
});

document.body.appendChild(container);
