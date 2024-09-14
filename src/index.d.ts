export interface IOptions {
	modelName: string
	verbose?: boolean
	removeWavFileAfterTranscription?: boolean
	withCuda?: boolean
	autoDownloadModelName?: string
	whisperOptions?: WhisperOptions
}

export interface WhisperOptions {
	outputInText?: boolean
	outputInVtt?: boolean
	outputInSrt?: boolean
	outputInCsv?: boolean
	language?: string
	translateToEnglish?: boolean
	timestamps_length?: number
	wordTimestamps?: boolean
	splitOnWord?: boolean
}

export declare function nodewhisper(filePath: string, options: IOptions): Promise<string>
