import { MotionValue, useTransform } from "framer-motion";

/**
 * Clamp every offset to [0, 1] and force monotonic non-decreasing order.
 * Framer Motion / WAAPI throws if offsets go outside [0,1] or decrease.
 */
export const clampOffsets = (offsets: number[]): number[] => {
  const out: number[] = [];
  let prev = 0;
  for (let i = 0; i < offsets.length; i++) {
    const v = Math.min(1, Math.max(0, offsets[i]));
    const next = i === 0 ? v : Math.max(prev, v);
    out.push(next);
    prev = next;
  }
  return out;
};

/**
 * Safe wrapper around useTransform that clamps the input range.
 * Use exactly like useTransform — same arg shape.
 */
export const useSafeTransform = <T,>(
  value: MotionValue<number>,
  inputRange: number[],
  outputRange: T[],
  options?: { clamp?: boolean; ease?: ((v: number) => number) | ((v: number) => number)[] }
) => {
  return useTransform(value, clampOffsets(inputRange), outputRange as never, options as never);
};
