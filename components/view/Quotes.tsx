import React from "react";
import { motivationalQuotes } from "@/data";
import { Card, CardContent } from "../ui/card";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Quotes() {
  const [displayed, setDisplayed] = React.useState("");

  const ref = React.useRef(motivationalQuotes[0]);

  React.useEffect(() => {
    let isMounted = true;

    const typeText = async (text: string) => {
      for (let i = 0; i <= text.length; i++) {
        if (!isMounted) return;

        setDisplayed(text.slice(0, i));
        await sleep(30);
      }
    };

    const clearText = async () => {
      setDisplayed("");
    };

    const run = async () => {
      while (isMounted) {
        const quote = ref.current.text;

        await clearText();
        await typeText(quote);

        await sleep(2000);

        const next =
          motivationalQuotes[
            Math.floor(Math.random() * motivationalQuotes.length)
          ];

        ref.current = next;
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="relative overflow-hidden border-0 transition-all duration-500 ">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>

      <CardContent className="relative p-4 flex flex-col items-center justify-center text-center">
        <blockquote className="text-xl  font-semibold text-gray-800 leading-relaxed max-w-2xl uppercase">
          {displayed}
          <span className="animate-pulse ml-1"></span>
        </blockquote>
      </CardContent>
    </Card>
  );
}
