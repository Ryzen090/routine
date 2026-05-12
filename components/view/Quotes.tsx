import React from "react";
import { motivationalQuotes } from "@/data";
import { Card, CardContent } from "@/components/ui/card";

export function Quotes() {
  const [displayedText, setDisplayedText] = React.useState("");
  const [currentQuote, setCurrentQuote] = React.useState(motivationalQuotes[0]);

  const quoteRef = React.useRef(currentQuote);
  quoteRef.current = currentQuote;

  const getRandomQuote = React.useCallback(() => {
    const filteredQuotes = motivationalQuotes.filter(
      (q) => q.text !== currentQuote.text,
    );
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex] || motivationalQuotes[0];
  }, [currentQuote]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 20000);

    return () => clearInterval(interval);
  }, [getRandomQuote]);

  React.useEffect(() => {
    let isMounted = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const runAnimation = async () => {
      while (isMounted) {
        const text = quoteRef.current.text;

        for (let i = 0; i <= text.length; i++) {
          if (!isMounted) return;
          setDisplayedText(text.slice(0, i));
          await sleep(200);
        }

        await sleep(5000);

        for (let i = text.length; i >= 0; i--) {
          if (!isMounted) return;
          setDisplayedText(text.slice(0, i));
          await sleep(15);
        }

        const next = getRandomQuote();
        setCurrentQuote(next);
        quoteRef.current = next;

        await sleep(400);
      }
    };

    runAnimation();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="relative overflow-hidden border-0 transition-all duration-500">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>

      <CardContent className="relative p-4 flex flex-col items-center justify-center text-center">
        <blockquote className="text-xl  font-semibold text-gray-800 leading-relaxed max-w-2xl uppercase">
          {displayedText}
          <span className="animate-pulse ml-1"></span>
        </blockquote>
      </CardContent>
    </Card>
  );
}
