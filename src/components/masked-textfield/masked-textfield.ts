const masks = {
  "dd-mm-yyyy": {
    regexOnStep: [
      /^$/,
      /^[0-3]$/,
      /^(([0-2]\d)|(3[01]))$/,
      /^(([0-2]\d)|(3[01]))-$/, // stop
      /^(([0-2]\d)|(3[01]))-[01]$/,
      /^(([0-2]\d)|(3[01]))-(0\d|1[0-2])$/,
      /^(([0-2]\d)|(3[01]))-(0\d|1[0-2])-$/, // stop
      /^(([0-2]\d)|(3[01]))-(0\d|1[0-2])-[12]$/,
      /^(([0-2]\d)|(3[01]))-(0\d|1[0-2])-(19|20)$/,
      /^(([0-2]\d)|(3[01]))-(0\d|1[0-2])-(19[4-9]|20[0-2])$/,
      /^(([0-2]\d)|(3[01]))-(0\d|1[0-2])-(19[4-9]\d|20[0-2]\d)$/,
    ],
    stops: {
      2: "-",
      5: "-",
    }
  },
}

export default function maskedTextfield() {
  let prevValue = "";

  const fields = document.querySelectorAll(".masked-textfield");
  const fieldOnInput = function (event) {
    const { target, inputType } = event;

    const dataMask = target.parentElement.getAttribute("data-mask");
    const mask = masks[dataMask];

    const valueLength = target.value.length;

    if (valueLength < mask.regexOnStep.length) {
      if (!mask.regexOnStep[valueLength].test(target.value)) {
        target.value = prevValue;
      } else if (Object.keys(mask.stops).includes(String(valueLength))) {
        if (inputType !== "deleteContentBackward") {
          target.value += mask.stops[valueLength];
        }
      }
    } else {
      target.value = prevValue;
    }
  }

  fields.forEach(item => {
    const mask = item.getAttribute("data-mask");
    item.addEventListener("keydown", (event) => {
      prevValue = (event.target as HTMLInputElement).value;
    });
    item.addEventListener("dragend", (event) => {
      prevValue = (event.target as HTMLInputElement).value;
    })
    item.addEventListener("input", fieldOnInput);
  })
}
