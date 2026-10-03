type Fruit = "apple" | "banana";

// Missing "banana" case with no default in an ES module TypeScript file --
// should trigger switch-exhaustiveness-check just like the .ts fixture
export function getFruitColor(fruit: Fruit): string {
  switch (fruit) {
    case "apple":
      return "red";
  }
  return "unknown";
}
