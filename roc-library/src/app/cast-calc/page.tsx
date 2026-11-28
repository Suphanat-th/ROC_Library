import CastGate from "./CastGate";

// The Member check runs in the browser (see CastGate), so this page has no server code and can be a static file.
export default function CastCalcPage() {
  return <CastGate />;
}
