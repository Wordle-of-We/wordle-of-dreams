import { Suspense } from "react";
import UserLoginPage from "./UserLoginPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-10">
          Carregando…
        </div>
      }
    >
      <UserLoginPage />
    </Suspense>
  );
}
