import CostumeGate from "./CostumeGate";

// The Member check runs in the browser (see CostumeGate), so this page has no server code and can be a static file.
export default function CostumePage() {
  return <CostumeGate />;
}
