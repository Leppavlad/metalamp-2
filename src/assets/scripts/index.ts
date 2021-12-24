import Dropdown from "../../components/dropdown/Dropdown";
import maskedTextfield from "../../components/masked-textfield/masked-textfield";
import RangeSlider from "../../components/range-slider/Range-slider";

Dropdown.each(".dropdown");
maskedTextfield();

new RangeSlider({
  selector: "[data-range='someCosts']",
  output: {
    minSelector: ".from",
    maxSelector: ".to"
  },
  limits: { min: 0, max: 15000 },
  filter: { min: 5000, max: 10000 },
});
