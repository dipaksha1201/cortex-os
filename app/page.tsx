"use client"

import { useComponentContext } from "@/src/components/global/ComponentContext"

export default function SyntheticV0PageForDeployment() {
  const { currentComponent } = useComponentContext();
  return currentComponent;
}