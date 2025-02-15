import {
  AnnotationLayerParams,
  useAnnotationLayer,
} from "@/lib/pdf/layers/annotation";
import { useCanvasLayer } from "@/lib/pdf/layers/canvas";
import { useTextLayer } from "@/lib/pdf/layers/text";
import { usePDFPage } from "@/lib/pdf/page";
import clsx from "clsx";
import { HTMLProps } from "react";

type CanvasLayerProps = HTMLProps<HTMLCanvasElement> & {
  zoom?: number;
}

export const TextLayer = ({
  className,
  style,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const { textContainerRef } = useTextLayer();

  return (
    <div
      className={clsx("textLayer", className)}
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      ref={textContainerRef}
    />
  );
};

export const AnnotationLayer = ({
  renderForms = true,
  annotations,
  className,
  style,
  ...props
}: AnnotationLayerParams & HTMLProps<HTMLDivElement>) => {
  const { annotationLayerRef } = useAnnotationLayer({
    renderForms,
    annotations,
  });

  return (
    <div
      className={clsx("annotationLayer", className)}
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      ref={annotationLayerRef}
    />
  );
};

export const CanvasLayer = ({
  zoom = 1,
  style,
  ...props
}: CanvasLayerProps) => {
  const { canvasRef } = useCanvasLayer({ zoom });

  return (
    <canvas
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      {...props}
      ref={canvasRef}
    />
  );
};

export const CustomLayer = ({
  children,
}: {
  children: (pageNumber: number) => JSX.Element;
}) => {
  const { pageNumber } = usePDFPage();

  return children(pageNumber);
};
