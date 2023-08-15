import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscriptions,
} from "@/lib/stripe";
import Link from "next/link";

const page = async () => {
  const customer = await createCustomerIfNull();
  const hasSub = await hasSubscriptions();
  const checkoutLink = await createCheckoutLink(String(customer));
  return (
    <main>
      {hasSub ? (
        <div className="text-base bg-emerald-400 text-white px-4 py-2 rounded-md">
          You have a subscription !
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
