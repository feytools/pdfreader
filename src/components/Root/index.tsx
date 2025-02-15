import {
  usePDFDocumentParams,
  usePDFDocumentContext,
  PDFDocumentContext,
} from "@/lib/pdf/document";
import {
  useCreatePDFLinkService,
  PDFLinkServiceContext,
} from "@/lib/pdf/links";
import { useViewportContext } from "@/lib/viewport";
import { forwardRef, HTMLProps, ReactNode } from "react";
import { Primitive } from "../Primitive";

export const Root = forwardRef(
  (
    {
      children,
      fileURL,
      loader,
      ...props
    }: HTMLProps<HTMLDivElement> &
      usePDFDocumentParams & {
        loader?: ReactNode;
      },
    ref,
  ) => {
    const { ready, context, pdfDocumentProxy } = usePDFDocumentContext({
      fileURL,
    });
    const viewportContext = useViewportContext({});
    const linkService = useCreatePDFLinkService(
      pdfDocumentProxy,
      viewportContext,
    );

    return (
      <Primitive.div ref={ref} {...props}>
        {ready ? (
          <PDFDocumentContext.Provider value={context}>
            <PDFLinkServiceContext.Provider value={linkService}>
              {children}
            </PDFLinkServiceContext.Provider>
          </PDFDocumentContext.Provider>
        ) : (
          loader || "Loading..."
        )}
      </Primitive.div>
    );
  },
);
