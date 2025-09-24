"use client";

export async function downloadElementAsPng(element: HTMLElement, filename: string, background = "#0b1220") {
  const svg = element.querySelector("svg");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const viewBox = (svg as SVGSVGElement).viewBox?.baseVal;
  const width = viewBox && viewBox.width ? viewBox.width : rect.width || 1;
  const height = viewBox && viewBox.height ? viewBox.height : rect.height || 1;
  const scale = window.devicePixelRatio || 1;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>${svgString}`], {
    type: "image/svg+xml;charset=utf-8"
  });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}
