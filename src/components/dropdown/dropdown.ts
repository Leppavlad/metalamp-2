export default class Dropdown {
  dropdown: Element;

  dropdownType: string;
  dropdownId: string;

  input: HTMLInputElement;

  categories: NodeListOf<Element>;

  table: HTMLElement;
  tableHeight: number;
  tableHeightWithControls: number;

  tableControls: HTMLElement;

  clearBtn: HTMLElement;
  submitBtn: HTMLElement;

  static each(selector: string) {
    const dropdowns = document.querySelectorAll(selector);
    dropdowns.forEach((elem) => {
      new Dropdown(elem).init();
    })
  }

  constructor(elem: Element) {
    this.dropdown = elem;

    this.dropdownType = this.dropdown.getAttribute("data-type");
    this.dropdownId = this.dropdown.getAttribute("data-id");

    this.input = this.dropdown.querySelector(".dropdown__input input");

    this.categories = this.dropdown.querySelectorAll(".dropdown__table-data__category");

    this.table = this.dropdown.querySelector(".dropdown__table");
    this.tableControls = this.table.querySelector(".dropdown__table-controls");

    this.clearBtn = this.dropdown.querySelector(".dropdown__table__clear-button");
    this.submitBtn = this.dropdown.querySelector(".dropdown__table__submit-button")
  }

  // dropdown activity controls
  private dropdownIsCollapsed() {
    return this.dropdown.classList.contains("dropdown_collapsed");
  }
  private dropdownExpand() {
    this.dropdown.classList.remove("dropdown_collapsed");
  }
  private dropdownCollapse() {
    this.dropdown.classList.add("dropdown_collapsed");
  }

  // clear-btn activity controls
  private showClearBtn() {
    this.clearBtn.style.visibility = "visible";
    this.clearBtn.removeAttribute("disabled");
  }
  private hideClearBtn() {
    this.clearBtn.style.visibility = "hidden";
    this.clearBtn.setAttribute("disabled", "true");
  }
  private clearBtnIsHidden() {
    return this.clearBtn.style.visibility === "hidden" && this.clearBtn.getAttribute("disabled") === "true";
  }

  private hideClearBtnOnZeroData() {
    const data = this.collectData();
    if (data.every((item) => item[0] === 0)) {
      this.hideClearBtn();
    } else {
      this.showClearBtn();
    }
  }

  // submit-btn activity controls
  private showSubmitBtn() {
    this.submitBtn.style.visibility = "visible";
    this.submitBtn.removeAttribute("disabled");
  }
  private hideSubmitBtn() {
    this.submitBtn.style.visibility = "hidden";
    this.submitBtn.setAttribute("disabled", "true");
  }
  private submitBtnIsHidden() {
    return this.submitBtn.style.visibility === "hidden" && this.submitBtn.getAttribute("disabled") === "true";
  }

  private hideSubmitBtnOnStorageEquality() {
    const storageData = this.loadDropdownFromStorage();

    if (storageData) {
      const collectedData = JSON.stringify(this.collectData());

      if (storageData === collectedData) {
        this.hideSubmitBtn();
      } else {
        this.showSubmitBtn();
      }
    } else {
      if (this.collectData().every((item) => item[0] === 0)) {
        this.hideSubmitBtn();
      } else {
        this.showSubmitBtn();
      }
    }
  }

  // table height controls
  private parseHeight(elem: Element) {
    return parseFloat(window.getComputedStyle(elem).height);
  }

  private setTableHeight(height: number) {
    this.table.style.height = height + "px";
  }

  private calcTableHeight() {
    if (this.dropdownIsCollapsed()) {
      this.dropdownExpand();
      this.tableHeightWithControls = this.parseHeight(this.table);
      this.tableHeight = this.tableHeightWithControls - 35;
      this.dropdownCollapse();
    } else {
      this.tableHeightWithControls = this.parseHeight(this.table);
      this.tableHeight = this.tableHeightWithControls - 35;
    }
  }

  private adjustTableHeightDueToControls() {
    if (this.submitBtnIsHidden() && this.clearBtnIsHidden()) {
      this.setTableHeight(this.tableHeight);
    } else {
      this.setTableHeight(this.tableHeightWithControls);
    }
  }
  // ............

  // init modules
  private initToggleEvent() {
    const input = this.dropdown.querySelector(".dropdown__input");
    input.addEventListener("click", () => {
      if (this.dropdownIsCollapsed()) {
        if (this.clearBtnIsHidden() && this.submitBtnIsHidden()) {
          this.setTableHeight(this.tableHeight);
        } else {
          this.setTableHeight(this.tableHeightWithControls);
        }
        this.dropdownExpand();
      } else {
        this.table.style.height = "";
        this.dropdownCollapse();
      }
    })
  }

  // subtr-add buttons
  private initDropdownTable() {
    this.categories.forEach((category) => {
      this.initDropdownCategory(category);
    })
  }
  private initDropdownCategory(category) {
    const valueElem = category.querySelector(".dropdown__table-data__controls__value");

    category.addEventListener("click", ({ target }) => {
      if (target.classList.contains("subtract-btn")) {
        if (Number(valueElem.innerHTML) >= 1) {
          valueElem.innerHTML = Number(valueElem.innerHTML) - 1;

          this.hideClearBtnOnZeroData();
          this.hideSubmitBtnOnStorageEquality();
          this.adjustTableHeightDueToControls();
          this.disableSubtrBtnIfZero(category);
        }
      } else if (target.classList.contains("add-btn")) {
        valueElem.innerHTML = Number(valueElem.innerHTML) + 1;

        this.hideClearBtnOnZeroData();
        this.hideSubmitBtnOnStorageEquality();
        this.adjustTableHeightDueToControls();
        this.disableSubtrBtnIfZero(category);
      }
    })
    this.disableSubtrBtnIfZero(category);
  }

  private disableSubtrBtnIfZero(category: Element) {
    const subtrBtn = category.querySelector(".subtract-btn");
    const outputElem = category.querySelector(".dropdown__table-data__controls__value");

    if (Number(outputElem.innerHTML) === 0) {
      subtrBtn.setAttribute("disabled", "true");
    } else {
      subtrBtn.removeAttribute("disabled");
    }
  }

  // submit-clear buttons
  private initDropdownControls() {
    const clearBtn = this.dropdown.querySelector(".dropdown__table__clear-button");
    const submitBtn = this.dropdown.querySelector(".dropdown__table__submit-button");

    const clearBtnListener = () => {
      const valueElems = this.dropdown.querySelectorAll(".dropdown__table-data__controls__value");
      valueElems.forEach((elem) => {
        elem.innerHTML = "0";
      })

      this.table.querySelectorAll(".subtract-btn").forEach((btn) => {
        btn.setAttribute("disabled", "true");
      })

      this.hideClearBtn();
      this.hideSubmitBtnOnStorageEquality();
      this.adjustTableHeightDueToControls();
    }

    const submitBtnListener = () => {
      const data = this.collectData();
      this.updateInput(data);

      if (data.every((item) => item[0] === 0)) {
        this.removeDropdownStorageData();
      }

      this.hideSubmitBtn();
      this.adjustTableHeightDueToControls();
    }

    clearBtn.addEventListener("click", clearBtnListener);
    submitBtn.addEventListener("click", submitBtnListener);
  }

  // storage
  private loadDropdownFromStorage(): string {
    return localStorage.getItem(this.dropdownId);
  }
  private saveDropdownToStorage(arr: [number, string][]) {
    localStorage.setItem(this.dropdownId, JSON.stringify(arr));
  }
  private removeDropdownStorageData() {
    localStorage.removeItem(this.dropdownId);
  };

  // collect table data
  private collectData() {
    const data: [number, string][] = [];

    this.categories.forEach((category) => {
      const label = category.querySelector(".dropdown__table-data__category__text").innerHTML;
      const value = Number(category.querySelector(".dropdown__table-data__controls__value").innerHTML);
      data.push([value, label]);
    })

    return data;
  }

  // update table data
  private updateFromStorage() {
    const data = JSON.parse(this.loadDropdownFromStorage());
    if (data) {
      this.updateInput(data);
      this.updateCategoryValues(data);
    }
  }

  private updateInput(data: [number, string][]) {
    switch (this.dropdownType) {
      case "guests": {
        const outputSum = String(data.reduce((sum, item) => sum + item[0], 0));
        if (outputSum === '0') {
          this.input.value = "";
        } else if (/1$/.test(outputSum)) {
          this.input.value = `${outputSum} гость`;
        } else if ((/[2-4]$/.test(outputSum))) {
          this.input.value = `${outputSum} гостя`;
        } else if ((/(0|[5-9])$/.test(outputSum))) {
          this.input.value = `${outputSum} гостей`;
        }
        break;
      }
      case "rooms": {
        const outputStr = data
          .filter((item) => item[0] > 0)
          .map((item) => item.join(" "))
          .join(", ");
        this.input.value = outputStr;
        break;
      }
    }
    this.saveDropdownToStorage(data);
  }

  updateCategoryValues(data: [number, string][]) {
    for (let i = 0; i < this.categories.length; i++) {
      const outputField = this.categories[i].querySelector(".dropdown__table-data__controls__value");
      outputField.innerHTML = String(data[i][0]);

      this.disableSubtrBtnIfZero(this.categories[i]);
    }
  }
  // .............

  init() {
    this.calcTableHeight();

    this.initToggleEvent();
    this.initDropdownTable();
    this.initDropdownControls();

    this.updateFromStorage();

    this.hideClearBtnOnZeroData();
    this.hideSubmitBtnOnStorageEquality();
    this.adjustTableHeightDueToControls();
  }
}