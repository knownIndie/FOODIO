"use client";

import { useRouter } from "next/navigation";
import type { signupEndpoint } from "../auth/signup-form";
import { Button } from "../ui/button";

export function DeliveryRegistrationButton({ endpoint }: signupEndpoint) {
  const router = useRouter();
  const handleClick = async () => {
    const response = await fetch(endpoint, { method: "POST" });
    if (!response.ok) {
      return;
    }
    router.replace("/");
  };

  return (
    <Button onClick={handleClick}>
      Apply for FoodIO Delivery Partner Account
    </Button>
  );
}
