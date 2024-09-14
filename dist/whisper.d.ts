import type { IShellOptions } from './types';
export declare function whisperShell(command: string, options: IShellOptions, verbose: boolean): Promise<string>;
export declare function executeCppCommand(command: string, verbose: boolean, withCuda: boolean): Promise<string>;
