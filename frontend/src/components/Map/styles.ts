import {
  DataDrivenPropertyValueSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";

export const exponentialBase = 1.3;

export const selectedFeatureOutline: DataDrivenPropertyValueSpecification<number> =
  [
    "interpolate",
    ["exponential", exponentialBase],
    ["zoom"],
    10,
    1,
    13,
    3,
    19,
    6,
  ];

export const transportationLineWidth = (
  multiplier: number = 2
): DataDrivenPropertyValueSpecification<number> => [
  "interpolate",
  ["exponential", exponentialBase],
  ["zoom"],
  10,
  1 * multiplier,
  16,
  4 * multiplier,
  21,
  7 * multiplier,
];

export const textLayout = (
  baseFontSize: number = 12
): SymbolLayerSpecification["layout"] => ({
  "text-field": "{name}",
  "text-size": [
    "interpolate",
    ["exponential", exponentialBase],
    ["zoom"],
    6,
    baseFontSize,
    16,
    baseFontSize * 1.75,
  ],
});
