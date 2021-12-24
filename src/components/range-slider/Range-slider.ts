import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

interface RangeSliderConstructor {
  selector: string,
  output: {
    minSelector: string,
    maxSelector: string,
  },
  limits: {
    min: number,
    max: number,
  },
  filter?: {
    min: number,
    max: number
  }
}

export default class RangeSlider {
  component: Element;

  rangeSlider;

  constructor({ selector, output, limits, filter = limits }: RangeSliderConstructor) {
    this.component = document.querySelector(selector);
    const sliderElement = this.component.querySelector(".noUi-slider")

    this.rangeSlider = noUiSlider.create(sliderElement, {
      start: [
        filter.min, filter.max
      ],
      step: 10,
      connect: true,
      range: {
        'min': limits.min,
        "max": limits.max
      }
    })

    this.initOutputUpdates(output);
  }

  private initOutputUpdates({ minSelector, maxSelector }) {
    const outputMin = this.component.querySelector(minSelector);
    const outputMax = this.component.querySelector(maxSelector);

    this.rangeSlider.on("update", () => {
      const [min, max] = this.rangeSlider.get().map((item) => parseInt(item));

      switch (this.component.getAttribute("data-currency")) {
        case "rub": {
          outputMin.textContent = new Intl.NumberFormat('ru-RU').format(min) + "₽";
          outputMax.textContent = new Intl.NumberFormat('ru-RU').format(max) + "₽";
          break;
        };
        case "usd": {
          outputMin.textContent = "$" + min;
          outputMax.textContent = "$" + max;
          break;
        }
      }

    });
  }
}