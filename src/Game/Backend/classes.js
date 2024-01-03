export class Segment {
  constructor(x, y, angle, length) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
  }

  follow(x, y) {
    const targetX = x;
    const targetY = y;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    // console.log("Arctan: " + Math.atan(dy / dx));
    // console.log("Arctan2: " + Math.atan2(dy, dx));

    this.angle = Math.atan2(dy, dx);

    this.x = targetX - Math.cos(this.angle) * this.length;
    this.y = targetY - Math.sin(this.angle) * this.length;
  }

  draw(p5) {
    p5.push();
    p5.translate(this.x, this.y);
    p5.rotate(this.angle);
    p5.line(0, 0, this.length, 0);
    p5.pop();
  }
}
export class Player {
  constructor(
    skin,
    size,
    speed,
    strength,
    health,
    stamina,
    segmentCount = 500,
    segmentLength = 0.5
  ) {
    this.skin = skin;
    this.size = size;
    this.speed = speed;
    this.strength = strength;
    this.health = health;
    this.stamina = stamina;
    this.staminaRegenRate = 0.05;
    this.segmentCount = segmentCount;
    this.segmentLength = segmentLength;
    this.posX = window.innerWidth / 2 - size.width / 2;
    this.posY = window.innerHeight / 2 - size.height / 2;
    this.originSegment;
    this.segments = [];
    this.moveRadius = 5;
  }

  activate(input, p5) {
    this.move(input, p5);
    this.draw(p5);
    this.abilityControl(p5);
    this.healthControl(p5);
  }

  draw(p5) {
    // p5.image(this.skin.img, this.posX, this.posY, this.size.width, this.size.height);
    p5.fill(this.skin.body);
    // p5.noFill();
    p5.strokeWeight(this.skin.outline.width);
    p5.stroke(this.skin.outline.color);
    p5.rect(this.posX, this.posY, this.size.width, this.size.height);
  }

  drawAbility(p5) {
    // TODO?: Write a followMechanic for every Segment and not only for originSegment?
    p5.strokeWeight(3);
    p5.stroke(this.skin.laser.r, this.skin.laser.g, this.skin.laser.b);
    let pos = this.calculateTarget(p5);
    this.originSegment.follow(pos.x, pos.y);
    this.originSegment.draw(p5);
    let next = this.originSegment;
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].follow(next.x, next.y);
      this.segments[i].draw(p5);
      next = this.segments[i];
    }
  }

  calculateTarget(p5) {
    let x = p5.mouseX;
    let y = p5.mouseY;
    let origin = p5.createVector(
      this.posX + this.size.width / 2,
      this.posY + this.size.width / 2
    );
    let target = p5.createVector(x, y);
    let dir = target.sub(origin);
    let length = dir.mag();
    if (length > this.moveRadius) {
      dir.normalize();
      dir.mult(this.moveRadius);
      x = origin.x + dir.x;
      y = origin.y + dir.y;
    }

    return { x, y };
  }

  healthControl(p5) {
    // Draw health bar
    p5.fill("red");
    p5.stroke("black");
    p5.strokeWeight(2);
    p5.rect(p5.width - this.health * 2, 20, this.health * 2, 20);
  }

  abilityControl(p5) {
    if (p5.mouseIsPressed && this.stamina > 0) {
      this.drawAbility(p5);
      this.stamina -= 0.1;
    } else if (this.stamina < 100 && !p5.mouseIsPressed)
      this.stamina += this.staminaRegenRate;

    // Draw stamina bar
    p5.fill("blue");
    p5.stroke("black");
    p5.strokeWeight(2);
    p5.rect(p5.width - this.stamina * 2, 50, this.stamina * 2, 20);
  }

  createAbility(p5) {
    this.originSegment = new Segment(0, 0, 0, this.segmentLength);
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push(new Segment(0, 0, 0, this.segmentLength));
    }
    for (let i = 0; i < this.segments.length; i++) {
      this.moveRadius += this.segments[i].length;
    }
  }

  move(input, p5) {
    if (input.includes("w") || input.includes("W")) {
      this.posY -= this.speed;
      if (this.posY - this.skin.outline.width / 2 < 0)
        this.posY = this.skin.outline.width / 2;
    }
    if (input.includes("s") || input.includes("S")) {
      this.posY += this.speed;
      if (
        this.posY >
        p5.height - this.size.height - this.skin.outline.width / 2
      )
        this.posY = p5.height - this.size.height - this.skin.outline.width / 2;
    }
    if (input.includes("a") || input.includes("A")) {
      this.posX -= this.speed;
      if (this.posX - this.skin.outline.width / 2 < 0)
        this.posX = this.skin.outline.width / 2;
    }
    if (input.includes("d") || input.includes("D")) {
      this.posX += this.speed;
      if (this.posX > p5.width - this.size.width - this.skin.outline.width / 2)
        this.posX = p5.width - this.size.width - this.skin.outline.width / 2;
    }
  }

  // Getters
  getSkin() {
    return this.skin;
  }
  getSize() {
    return this.size;
  }
  getSpeed() {
    return this.speed;
  }
  getStrength() {
    return this.strength;
  }
  getHealth() {
    return this.health;
  }
  getStamina() {
    return this.stamina;
  }
  getPos() {
    return {
      x: this.posX + this.size.width / 2,
      y: this.posY + this.size.height / 2,
    };
  }

  // Setters
  setSkin(skin) {
    this.skin = skin;
  }
  translateSize(size) {
    this.size = size;
  }
  setSpeed(speed) {
    this.speed = speed;
  }
  setStrength(strength) {
    this.strength = strength;
  }
  setHealth(health) {
    this.health = health;
  }
  setStamina(stamina) {
    this.stamina = stamina;
  }
  translatePos(x, y) {
    this.posX = x;
    this.posY = y;
  }
}
