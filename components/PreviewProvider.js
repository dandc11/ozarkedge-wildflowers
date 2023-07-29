
import { LiveQueryProvider } from "@sanity/preview-kit";
import { useMemo } from "react";
import { getClient } from "../../sanity/lib/getClient";

export default function PreviewProvider({
  children,
  previewToken,
}) {
  const client = useMemo(() => getClient(previewToken), [previewToken]);
  // Only the client prop is required. For debugging, pass a logger={console} prop
  return <LiveQueryProvider client={client}>{children}</LiveQueryProvider>;
}