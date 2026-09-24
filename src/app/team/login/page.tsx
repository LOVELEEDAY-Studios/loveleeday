import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "@/lib/team-auth";
import { LoginForm } from "@/components/team/LoginForm";

export const metadata = { title: "Sign in" };

export default async function TeamLogin() {
  if (await readSession((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/team");
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-2 text-[13px] font-[650] tracking-[0.12em]">
          <span
            aria-hidden="true"
            className="inline-block h-5 w-5 bg-current"
            style={{ WebkitMask: "url(/site/assets/mark-mask.png) center/contain no-repeat", mask: "url(/site/assets/mark-mask.png) center/contain no-repeat" }}
          />
          LOVELEEDAY
          <span className="ml-1 rounded-full bg-[#1d1d1f] px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-white">TEAM</span>
        </div>
        <h1 className="mt-10 text-[34px] font-medium leading-[1.1] tracking-[-0.04em]">
          Sign in to the team portal.
          <br />
          <span className="text-[#8c8e95]">Bids, client portals, activity.</span>
        </h1>
        <LoginForm />
        <p className="mt-8 text-[12px] leading-[1.6] text-[#8c8e95]">
          For the LOVELEEDAY team only. We email a one-time code to your work address; there is no password to lose.
        </p>
      </div>
    </main>
  );
}
