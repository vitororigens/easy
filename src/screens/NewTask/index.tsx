import React from "react";
import { NewLaunch } from "../NewLaunch";
import { useRoute } from "@react-navigation/native";

export function NewTask() {
  const route = useRoute();
  const { selectedItemId, initialActiveButton } = route.params as {
    selectedItemId?: string;
    initialActiveButton?: string;
  };

  return <NewLaunch />;
}
