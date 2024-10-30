import { DistanceCalculator } from "../src/domain/service/DistanceCalculator";
import { Coord } from "../src/domain/vo/Coord";

test("Deve calcular a distância entre dois pontos", () => {
  const from = new Coord(-23.5505, -46.6333);
  const to = new Coord(-23.4605, -46.5333);
  expect(DistanceCalculator.calculate(from, to)).toBe(14);
})
