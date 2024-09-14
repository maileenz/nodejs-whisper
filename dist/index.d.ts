import { WhisperOptions } from './types';
export interface IOptions {
    modelName: string;
    autoDownloadModelName?: string;
    whisperOptions?: WhisperOptions;
    withCuda?: boolean;
    verbose?: boolean;
    removeWavFileAfterTranscription?: boolean;
}
export declare function nodewhisper(filePath: string, options: IOptions): Promise<string>;
