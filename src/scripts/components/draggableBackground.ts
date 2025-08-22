class DraggableBackground {
  static instances: DraggableBackground[] = [];

  container: HTMLElement;
  background: HTMLElement | null;
  isDragging = false;
  startY = 0;
  currentY = 0;
  targetY = 0;
  maxScroll = 0;
  animationFrame = requestAnimationFrame(() => {});
  resizeObserver = new ResizeObserver(() => this.updateDimensions());

  constructor(container: HTMLElement) {
    this.container = container;
    this.background = container.querySelector("[data-draggable-element]") as HTMLElement | null;

    if (!this.background) return;

    this.resizeObserver.observe(this.container);

    this.updateDimensions();
    this.render = this.render.bind(this);
    this.animationFrame = requestAnimationFrame(this.render);

    this.initEvents();
    DraggableBackground.instances.push(this);
  }

  initEvents() {
    // Maus-Events
    this.container.addEventListener("mousedown", (e) => this.startDragging(e as MouseEvent));
    window.addEventListener("mousemove", (e) => this.drag(e as MouseEvent));
    window.addEventListener("mouseup", () => this.stopDragging());

    // Touch-Events
    this.container.addEventListener("touchstart", (e) => this.startDragging(e as TouchEvent));
    window.addEventListener("touchmove", (e) => this.drag(e as TouchEvent));
    window.addEventListener("touchend", () => this.stopDragging());

    // Verhindere Standard-Drag-Verhalten
    this.container.addEventListener("dragstart", (e) => e.preventDefault());
  }

  startDragging(e: MouseEvent | TouchEvent) {
    if (!this.background) return;
    this.isDragging = true;
    this.startY = this.getY(e);
    this.currentY = this.getTransformY();

    this.background.style.transition = "none";
  }

  drag(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const currentY = this.getY(e);
    const deltaY = (currentY - this.startY) * 1.25;
    this.targetY = Math.min(0, Math.max(this.maxScroll, this.currentY + deltaY));
  }

  stopDragging() {
    if (!this.isDragging) return;
    this.isDragging = false;
  }

  render() {
    // Smooth interpolation zwischen aktueller und Zielposition
    this.currentY = this.lerp(this.currentY, this.targetY, 0.1);

    // Runde auf 2 Dezimalstellen für bessere Performance
    this.currentY = Math.round(this.currentY * 100) / 100;

    if (this.background) {
      this.background.style.transform = `translateY(${this.currentY}px)`;
    }

    this.animationFrame = requestAnimationFrame(this.render);
  }

  lerp(start: number, end: number, factor: number): number {
    return (1 - factor) * start + factor * end;
  }

  // Cleanup Methode hinzufügen
  destroy() {
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();

    // Event Listener entfernen
    this.container.removeEventListener("mousedown", this.startDragging);
    window.removeEventListener("mousemove", this.drag);
    window.removeEventListener("mouseup", this.stopDragging);
    this.container.removeEventListener("touchstart", this.startDragging);
    window.removeEventListener("touchmove", this.drag);
    window.removeEventListener("touchend", this.stopDragging);
  }

  getY(e: MouseEvent | TouchEvent): number {
    return e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  }

  getTransformY(): number {
    const transform = this.background?.style.transform;
    const match = transform?.match(/translateY\(([-\d.]+)px\)/);
    return match ? parseFloat(match[1]) : 0;
  }

  updateDimensions() {
    if (!this.background) return;

    // Berechne die tatsächliche Bildhöhe basierend auf der Container-Breite
    const containerWidth = this.container.clientWidth;
    const originalWidth = parseInt(this.background?.dataset.imageWidth || "0");
    const originalHeight = parseInt(this.background?.dataset.imageHeight || "0");
    const aspectRatio = originalWidth / originalHeight;

    // Neue Bildhöhe basierend auf der Container-Breite und dem Seitenverhältnis
    const actualImageHeight = containerWidth / aspectRatio;

    const containerHeight = this.container.clientHeight;
    this.maxScroll = -(actualImageHeight - containerHeight);

    // Aktualisiere die Höhe des Hintergrundbildes
    this.background.style.height = `${actualImageHeight}px`;

    // Stelle sicher, dass die aktuelle Position innerhalb der neuen Grenzen liegt
    this.targetY = Math.min(0, Math.max(this.maxScroll, this.targetY));
    this.currentY = this.targetY;
  }

  // Statische Cleanup-Methode
  static cleanupAll() {
    DraggableBackground.instances.forEach((instance) => instance.destroy());
    DraggableBackground.instances = [];
  }
}

export default DraggableBackground;
