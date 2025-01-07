import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

import { useDPR, useViewport } from "@/lib/viewport";

import { usePDFPage } from "../page";
import { AnnotationMode } from "pdfjs-dist";

export const useCanvasLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pdfPageProxy } = usePDFPage();
  const dpr = useDPR();
  const { zoom: bouncyZoom } = useViewport();
  const zoom = useDebounce(bouncyZoom, 100);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const viewport = pdfPageProxy.getViewport({ scale: 1 });

    const canvas = canvasRef.current;

    const scale = dpr * zoom;

    canvas.height = viewport.height * scale;
    canvas.width = viewport.width * scale;

    canvas.style.height = `${viewport.height}px`;
    canvas.style.width = `${viewport.width}px`;

    const canvasContext = canvas.getContext("2d")!;
    canvasContext.scale(scale, scale);

    const renderingTask = pdfPageProxy.render({
      // @TODO
      // - Could pass this through at the Context level (Root) as prop
      annotationMode: AnnotationMode.DISABLE,
      canvasContext: canvasContext,
      viewport,
    });

    renderingTask.promise.catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === "RenderingCancelledException") {
        return;
      }

      throw error;
    });

    return () => {
      void renderingTask.cancel();
    };
  }, [pdfPageProxy, canvasRef.current, dpr, zoom]);

  return {
    canvasRef,
  };
};
