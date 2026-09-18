"use client";

import { useEffect } from "react";
import { mountToaster, unmountToaster } from "gooey-toast";

export function ToasterMount() {
  useEffect(() => {
    mountToaster({
      position: "top-right",
      options: {
        duration: 4000,
        roundness: 20,
      },
    });

    return () => {
      unmountToaster();
    };
  }, []);

  return null;
}
