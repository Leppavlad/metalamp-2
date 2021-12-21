const types = {
  guests: {
    categories: [
      { label: "Спальни", id: "room" },
      { label: "Кровати", id: "bed" },
      { label: "Ванные комнаты", id: "bathroom" },
    ],
  },
  rooms: {
    categories: [
      { label: "Взрослые", id: "adult" },
      { label: "Дети", id: "kid" },
      { label: "Младенцы", id: "infant" },
    ]
  }
}

export default function dropdown() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const tableHeight = calcTableHeight(dropdown);
    const dropdownType = dropdown.getAttribute("data-type");

    initToggleEvent(dropdown, tableHeight);
    initDropdownTable(dropdown);
    initDropdownControls(dropdown, dropdownType);
  })
}


function calcTableHeight(dropdown) {
  const activeClassname = "dropdown_collapsed";
  const table = dropdown.querySelector(".dropdown__table");

  if (dropdown.classList.contains(activeClassname)) {
    dropdown.classList.remove(activeClassname);
    const tableHeight = parseFloat(window.getComputedStyle(table).height);
    dropdown.classList.add(activeClassname);

    return tableHeight;
  } else {
    const tableHeight = parseFloat(window.getComputedStyle(table).height);
    return tableHeight;
  }
}


function initToggleEvent(dropdown, tableHeight) {
  const activeClassname = "dropdown_collapsed";
  const table = dropdown.querySelector(".dropdown__table");

  const input = dropdown.querySelector(".dropdown__input");
  input.addEventListener("click", () => {
    if (dropdown.classList.contains(activeClassname)) {
      table.style.height = tableHeight + "px";
      dropdown.classList.remove(activeClassname);
    } else {
      table.style.height = "";
      dropdown.classList.add(activeClassname);
    }
  })
}

function initDropdownTable(dropdown) {
  const categories = dropdown.querySelectorAll(".dropdown__table-data__category");
  categories.forEach((category) => {
    initDropdownCategory(category);
  })
}


function initDropdownCategory(category) {
  const subtrBtn = category.querySelector(".subtract-btn");
  const addBtn = category.querySelector(".add-btn");

  const valueElem = category.querySelector(".dropdown__table-data__controls__value");

  const disableSubtrBtn = () => {
    if (Number(valueElem.innerHTML) === 0) {
      subtrBtn.setAttribute("disabled", "true");
    }
  }
  disableSubtrBtn();

  subtrBtn.addEventListener("click", () => {
    if (Number(valueElem.innerHTML) >= 1) {
      valueElem.innerHTML = Number(valueElem.innerHTML) - 1;
      disableSubtrBtn();
    }
  });
  addBtn.addEventListener("click", () => {
    valueElem.innerHTML = Number(valueElem.innerHTML) + 1;
    subtrBtn.removeAttribute("disabled");
  })
}


function initDropdownControls(dropdown, dropdownType) {
  const clearBtn = dropdown.querySelector(".dropdown__table__clear-button");
  const submitBtn = dropdown.querySelector(".dropdown__table__submit-button");

  clearBtn.addEventListener("click", () => {
    const valueElems = dropdown.querySelectorAll(".dropdown__table-data__controls__value");
    valueElems.forEach((elem) => {
      elem.innerHTML = 0;
    })
  })

  submitBtn.addEventListener("click", () => {
    const categories = dropdown.querySelectorAll(".dropdown__table-data__category");

    const output = [];
    categories.forEach((category) => {
      const label = category.querySelector(".dropdown__table-data__category__text").innerHTML;
      const value = Number(category.querySelector(".dropdown__table-data__controls__value").innerHTML);
      output.push([value, label]);
    })

    console.log(output);

    const input = dropdown.querySelector(".dropdown__input input")
    switch (dropdownType) {
      case "guests": {
        const outputSum = output.reduce((sum, item) => sum + item[0], 0);
        if (/1$/.test(outputSum)) {
          input.value = `${outputSum} гость`;
        } else if ((/[2-4]$/.test(outputSum))) {
          input.value = `${outputSum} гостя`;
        } else if ((/(0|[5-9])$/.test(outputSum))) {
          input.value = `${outputSum} гостей`;
        }
        break;
      }
      case "rooms": {
        const outputStr = output
          .filter((item) => item[0] > 0)
          .map((item) => item.join(" "))
          .join(", ");
        input.value = outputStr;
        break;
      }
    }
  })
}