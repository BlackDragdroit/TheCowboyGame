import { Player } from "../Backend/classes.js";
let player;
let input = [];
let backgroundIMG;

new p5(function (p5) {
  p5.preload = () => {
    backgroundIMG = p5.loadImage("../../Assets/Backgrounds/Background3.jpg");
  };

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    player = new Player(
      {
        body: "black",
        outline: { color: "yellow", width: 2 },
        laser: { r: 255, g: 255, b: 255 },
      },
      { width: 25, height: 25 },
      5,
      2,
      200,
      100
    );
    player.createAbility();
    setupListeners();
  };

  p5.draw = () => {
    p5.background(backgroundIMG);
    player.activate(input, p5);
  };

  function setupListeners() {
    document.addEventListener("keydown", (e) => {
      if (!input.includes(e.key)) input.push(e.key);
    });
    document.addEventListener("keyup", (e) => {
      if (input.includes(e.key)) input.splice(input.indexOf(e.key), 1);
    });
  }
});
