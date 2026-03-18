type Fruit = "apple" | "banana";

// Missing "banana" case with no default — should trigger switch-exhaustiveness-check
export function getFruitColor(fruit: Fruit): string {
  switch (fruit) {
    case "apple":
      return "red";
  }
  return "unknown";
}
