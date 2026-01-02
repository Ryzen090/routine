import React from "react";
import { motivationalQuotes } from "@/contexts/data";
import { Card, CardContent } from "@/components/ui/card";

export function Quotes() {
  const [currentQuote, setCurrentQuote] = React.useState(motivationalQuotes[0]);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  const handleNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      handleNewQuote();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  return (
    <Card className="shadow-sm border-none transition-all duration-300 ease-in-out">
      <CardContent className="p-4 lg:p-6">
        <div
          className={`transition-all duration-300 ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <blockquote className="text-base text-center lg:text-lg font-medium text-gray-800 italic leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
