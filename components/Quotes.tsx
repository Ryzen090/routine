import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const motivationalQuotes = [
  {
    text: "Remember who you are.",
  },
  {
    text: "If you want to be strong, learn to fight alone.",
  },
  {
    text: "You don’t have to be great to start, but you have to start to be great.",
  },
  {
    text: "The first steps are always the hardest.",
  },
];

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
    <Card
      className="
        bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100
        border border-indigo-200 shadow-sm
        transition-all duration-300 ease-in-out
      "
    >
      <CardContent className="p-4 lg:p-6 pb-0 lg:pb-0">
        <div
          className={`transition-all duration-300 ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <blockquote className="text-base text-center lg:text-lg font-medium text-gray-800 italic leading-relaxed mb-3 pl-4">
            "{currentQuote.text}"
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
