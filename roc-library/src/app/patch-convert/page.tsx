import PatchGate from "./PatchGate";

// The Key check runs through /api/patch-key (see PatchGate), so this page has no server code and can be a static file.
export default function PatchConvertPage() {
  return <PatchGate />;
}
