let formData = [];
function renderForm() {
  const formBuilder = document.getElementById("form-builder");
  formBuilder.innerHTML = "";

  if (formData.length) {
    formData.forEach((element, index) => {
      const div = document.createElement("div");
      div.classList.add("form-element");
      div.setAttribute("draggable", true);
      div.dataset.index = index;

      switch (element.type) {
        case "input":
          div.innerHTML = `
                <div class="form-label">
                  <label contenteditable="true" onblur="updateLabel(${index}, this.textContent)">${element.label}</label>
                  <i class="material-icons delete-btn" onclick="deleteElement(${index})">delete</i>
                </div>
                <input type="text" placeholder="${element.placeholder}" onblur="updatePlaceholder(${index}, this.value)" value="${element.placeholder}" />
              `;
          break;

        case "select":
          div.innerHTML = `
                <div class="form-label">
                  <label contenteditable="true" onblur="updateLabel(${index}, this.textContent)">${
            element.label
          }</label>
                  <i class="material-icons delete-btn" onclick="deleteElement(${index})">delete</i>
                </div>
                <select>
                  ${element.options.map((option) => `<option>${option}</option>`).join("")}
                </select>
                <div class="options-container">
                  ${element.options
                    .map(
                      (option, optionIndex) => `
                    <div class="option-item">
                      <span contenteditable="true" onblur="updateOption(${index}, ${optionIndex}, this.textContent)">${option}</span>
                      <i class="material-icons delete-btn" onclick="deleteOption(${index}, ${optionIndex})">delete</i>
                    </div>
                  `
                    )
                    .join("")}
                    <div class='add-option-container'>
                <input type="text" id="new-option-${index}" placeholder="Add new option" />
                <button onclick="addOption(${index})">Add</button>
                </div>
                </div>
                
              `;
          break;

        case "textarea":
          div.innerHTML = `
                <div class="form-label">
                  <label contenteditable="true" onblur="updateLabel(${index}, this.textContent)">${element.label}</label>
                  <i class="material-icons delete-btn" onclick="deleteElement(${index})">delete</i>
                </div>
                <textarea placeholder="${element.placeholder}" onblur="updatePlaceholder(${index}, this.value)">${element.placeholder}</textarea>
              `;
          break;
      }
      formBuilder.appendChild(div);
    });
  } else {
    formBuilder.innerHTML = `<h3 style="text-align:center">No Form Elements Added</h3>`;
  }

  enableDragAndDrop();
}

function enableDragAndDrop() {
  const formElements = document.querySelectorAll(".form-element");

  formElements.forEach((element, index) => {
    element.addEventListener("dragstart", (e) => {
      draggedElementIndex = index;
      e.dataTransfer.effectAllowed = "move";
    });

    element.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop
      e.dataTransfer.dropEffect = "move";
    });

    element.addEventListener("drop", (e) => {
      e.preventDefault();
      const targetIndex = index;

      // 1. Remove the dragged element from its original position
      const [draggedElement] = formData.splice(draggedElementIndex, 1);

      // 2. Insert the dragged element at the target index
      formData.splice(targetIndex, 0, draggedElement);

      // 3. Re-render the form to reflect the new order
      renderForm();
    });
  });
}

function updateLabel(index, newLabel) {
  formData[index].label = newLabel;
}

function updatePlaceholder(index, newPlaceholder) {
  formData[index].placeholder = newPlaceholder;
}

function addOption(index) {
  const newOptionInput = document.getElementById(`new-option-${index}`);
  const newOptionValue = newOptionInput.value.trim();

  if (newOptionValue) {
    formData[index].options.push(newOptionValue);
    newOptionInput.value = "";
    renderForm();
  }
}

function deleteOption(formIndex, optionIndex) {
  formData[formIndex].options.splice(optionIndex, 1);
  renderForm();
}

function updateOption(formIndex, optionIndex, newOptionText) {
  formData[formIndex].options[optionIndex] = newOptionText;
  renderForm();
}

function deleteElement(index) {
  formData.splice(index, 1);
  renderForm();
}

document.getElementById("add-input").addEventListener("click", () => {
  formData.push({
    id: generateId(),
    type: "input",
    label: "New Input Label",
    placeholder: "New Input Placeholder",
  });
  renderForm();
});

document.getElementById("add-select").addEventListener("click", () => {
  formData.push({
    id: generateId(),
    type: "select",
    label: "New Select Label",
    options: ["Option 1", "Option 2"],
  });
  renderForm();
});

document.getElementById("add-textarea").addEventListener("click", () => {
  formData.push({
    id: generateId(),
    type: "textarea",
    label: "New Textarea Label",
    placeholder: "New Textarea Placeholder",
  });
  renderForm();
});

document.getElementById("save-form").addEventListener("click", () => {
  console.log(formData);
  formData = [];
  renderForm();
});

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

renderForm();
