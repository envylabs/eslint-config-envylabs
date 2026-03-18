type Fruit = "apple" | "banana";

// All union cases handled — should not trigger switch-exhaustiveness-check
export function getFruitColor(fruit: Fruit): string {
  switch (fruit) {
    case "apple":
      return "red";
    case "banana":
      return "yellow";
    default:
      return "unknown";
  }
}
