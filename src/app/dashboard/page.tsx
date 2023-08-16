import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscriptions,
  stripe,
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

  const top10RecentLogs = await prisma?.log?.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
  });

  let curr_usage = 0;

  if(hasSub){
    const subscriptions = await stripe?.subscriptions?.list({
        customer: String(user?.stripe_customer_id),
      });
      const invoice = await stripe?.invoices?.retrieveUpcoming({
        subscription: subscriptions?.data?.at(0)?.id
      })
      curr_usage = invoice?.amount_due;
  }
  return (
    <main>
      {hasSub ? (
        <div className="flex flex-col gap-4">
          <div className="text-base bg-emerald-400 text-white px-4 py-2 rounded-md">
            You have a subscription !
          </div>
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">Current Usage</p>
            <p className="text-sm font-mono text-zinc-800 px-6 py-4">
              ${curr_usage/100}
            </p>
          </div>
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">Api Key</p>
            <p className="text-sm font-mono text-zinc-800 px-6 py-4">
            <Link href={`/api/endpoint?api_key=${user?.api_key}`} rel="noopener noreferrer" target="_blank" className="hover:opacity-50 hover:underline">
              {user?.api_key}
            </Link>
            </p>
          </div>
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">Logs</p>
            {top10RecentLogs?.map((item, index) => (
              <div className="flex items-center gap-4" key={index}>
                <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                  {item?.method}
                </p>
                <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                  {item?.status}
                </p>
                <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                  {item?.created?.toDateString()}
                </p>
              </div>
            ))}
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
