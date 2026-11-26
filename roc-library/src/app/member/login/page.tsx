import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function MemberLoginPage() {
  // useSearchParams needs a Suspense boundary in a static export.
  return (
    <Suspense fallback={<div className="flex justify-center py-6"><span className="loading loading-spinner" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
