/**
 * Shared utilities and types for the XRPL Dev Portal
 *
 * This module provides common utility functions, types, and helpers
 * used across components and patterns in the shared directory.
 */

// Helper functions
export {
  isEmpty,
  getTextFromChildren,
  getCardKey,
  isEnvironment,
  hasChildren,
} from "./helpers";
export type { Environment } from "./helpers";

// Shared types
export type { DesignContrainedButtonProps } from "./types";
