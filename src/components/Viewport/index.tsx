import { Primitive } from "../Primitive";
import { type HTMLProps, type ReactNode, useRef } from "react";
import { useViewportContainer, useViewportContext, ViewportContext } from "@/lib/viewport";

export const ViewportProvider = ({ children }: { children: ReactNode }) => {
  const viewportContext = useViewportContext({});
  return (
    <ViewportContext.Provider value={viewportContext}>
      {children}
    </ViewportContext.Provider>
  )
}

export const Viewport = ({ children, ...props }: HTMLProps<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementWrapperRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useViewportContainer({
    elementRef: elementRef,
    elementWrapperRef: elementWrapperRef,
    containerRef: containerRef,
  });

  return (
    <Primitive.div
      ref={containerRef}
      {...props}
      style={{
        display: "flex",
        justifyContent: "center",
        ...props.style,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        ref={elementWrapperRef}
        style={{
          width: "max-content",
        }}
      >
        <div
          ref={elementRef}
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            transformOrigin: "0 0",
            width: "max-content",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </div>
    </Primitive.div>
  );
};
