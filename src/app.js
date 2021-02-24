import Sketch from "./js/sketch.js";

new Sketch({
  dom: document.getElementById("container"),
  timeEls: document.querySelectorAll(".time__wrapper"),
  dateEl: document.getElementById("date"),
  listColors: ["#93063d", "#f79292", "#ffa520", "#a70f17", "#ffc31e", "#00ffc7", "#ed008f", "#031c91", "#282557"],
  listDateColors: ["#ffa520", "#93063d", "#a70f17", "#f79292", "#282557", "#031c91", "#ffc31e", "#ed008f", "#00ffc7"],
});
