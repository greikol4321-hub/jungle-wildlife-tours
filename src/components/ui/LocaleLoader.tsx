"use client";

import { useEffect, useState } from "react";

export function LocaleLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(document.body.hasAttribute("data-locale-loading"));
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-locale-loading"] });
    check();
    return () => observer.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="loading-screen">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="loading-dot" />
        ))}
      </div>
    </div>
  );
}
