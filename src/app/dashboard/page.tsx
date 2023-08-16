import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscriptions,
} from "@/lib/stripe";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

const page = async () => {
  const session = await getServerSession(authOptions);
  const customer = await createCustomerIfNull();
  const hasSub = await hasSubscriptions();
  const checkoutLink = await createCheckoutLink(String(customer));
  const user = await prisma?.user?.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  return (
    <main>
      {hasSub ? (
        <div className="flex flex-col gap-4">
          <div className="text-base bg-emerald-400 text-white px-4 py-2 rounded-md">
            You have a subscription !
          </div>
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">Api Key</p>
            <p className="text-sm font-mono text-zinc-800 px-6 py-4">{user?.api_key}</p>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] grid place-items-center rounded-ld px-6 py-10 bg-slate-100">
          <Link
            href={String(checkoutLink)}
            className="font-medium text-base hover:underline">
            You have no subscription, checkout now !
          </Link>
        </div>
      )}
    </main>
  );
};

export default page;
