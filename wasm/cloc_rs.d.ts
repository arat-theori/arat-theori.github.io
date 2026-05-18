/* tslint:disable */
/* eslint-disable */

/**
 * Count lines for a single file as cloc would.
 * Returns null if the language is unsupported (no filter sequence available).
 */
export function count_file(path: string, content: string): any;

/**
 * Count lines when language is already known (skip detection).
 */
export function count_with_language(language: string, content: string): any;

/**
 * Detect language from path (and optional content head for shebang).
 * Returns the cloc language name (e.g. "JavaScript", "Python").
 */
export function detect_language(path: string, head?: string | null): string | undefined;

/**
 * Detect language using content-based disambiguation (for `.ts` etc).
 */
export function detect_language_with_content(path: string, content: string): string | undefined;

/**
 * Returns true if the path is in an ignored build/vendor directory.
 */
export function is_ignored_path(path: string): boolean;

/**
 * Returns true if the file is known to be non-code (binary, archive, etc.).
 */
export function is_not_code(path: string): boolean;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly detect_language: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly is_ignored_path: (a: number, b: number) => number;
    readonly is_not_code: (a: number, b: number) => number;
    readonly count_file: (a: number, b: number, c: number, d: number) => number;
    readonly detect_language_with_content: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly count_with_language: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
