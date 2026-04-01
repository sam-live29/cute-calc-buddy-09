import { useState } from "react";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const handleClick = (val: string) => {
    if (val >= "0" && val <= "9" || val === ".") {
      if (reset || display === "0" && val !== ".") {
        setDisplay(val === "." ? "0." : val);
        setReset(false);
      } else {
        if (val === "." && display.includes(".")) return;
        setDisplay(display + val);
      }
    } else if (val === "C") {
      setDisplay("0");
      setPrev(null);
      setOp(null);
    } else if (val === "±") {
      setDisplay(String(-parseFloat(display)));
    } else if (val === "%") {
      setDisplay(String(parseFloat(display) / 100));
    } else if (val === "=") {
      if (prev !== null && op) {
        setDisplay(String(calculate(prev, parseFloat(display), op)));
        setPrev(null);
        setOp(null);
        setReset(true);
      }
    } else {
      if (prev !== null && op && !reset) {
        const result = calculate(prev, parseFloat(display), op);
        setDisplay(String(result));
        setPrev(result);
      } else {
        setPrev(parseFloat(display));
      }
      setOp(val);
      setReset(true);
    }
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const isOperator = (val: string) => ["÷", "×", "−", "+"].includes(val);
  const isActive = (val: string) => op === val && reset;

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
        {/* Display */}
        <div className="px-6 pt-8 pb-4 text-right">
          <div className="text-muted-foreground text-sm h-6 truncate">
            {prev !== null && op ? `${prev} ${op}` : ""}
          </div>
          <div className="text-card-foreground text-5xl font-light tracking-tight truncate">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-3 grid gap-2">
          {buttons.map((row, i) => (
            <div key={i} className="grid gap-2" style={{ gridTemplateColumns: i === 4 ? "2fr 1fr 1fr" : "repeat(4, 1fr)" }}>
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleClick(btn)}
                  className={`
                    h-14 rounded-xl text-lg font-medium transition-all duration-150 active:scale-95
                    ${btn === "=" ? "bg-primary text-primary-foreground hover:opacity-90" : ""}
                    ${isOperator(btn) ? (isActive(btn) ? "bg-primary text-primary-foreground" : "bg-calc-operator text-calc-operator-foreground hover:opacity-90") : ""}
                    ${!isOperator(btn) && btn !== "=" ? "bg-calc-btn text-card-foreground hover:bg-calc-btn-hover" : ""}
                  `}
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
