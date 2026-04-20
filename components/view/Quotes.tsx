import React from "react";
import { motivationalQuotes } from "@/data";
import { Card, CardContent } from "@/components/ui/card";

export function Quotes() {
  const [currentQuote, setCurrentQuote] = React.useState(motivationalQuotes[0]);

  const getRandomQuote = () => {
    const filteredQuotes = motivationalQuotes.filter(
      (quote) => quote.text !== currentQuote.text,
    );
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex] || motivationalQuotes[0];
  };

  React.useEffect(() => {
    const interval = setInterval(() => {}, 20000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    setCurrentQuote(getRandomQuote());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="border-none bg-white">
      <CardContent className="p-4">
        <blockquote className="text-sm text-center text-gray-800 italic">
          {currentQuote.text}
        </blockquote>
      </CardContent>
    </Card>
  );
}
