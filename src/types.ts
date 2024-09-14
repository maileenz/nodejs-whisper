import type { MODEL_OBJECT } from './constants'

export type Model = keyof typeof MODEL_OBJECT

export interface IShellOptions {
	silent: boolean
	async: boolean
}
export interface IOptions {
	modelName: Model
	verbose?: boolean
	removeWavFileAfterTranscription?: boolean
	withCuda?: boolean
	autoDownloadModelName?: Model
	whisperOptions?: WhisperOptions
}

export interface WhisperOptions {
	threads?: number
	processors?: number
	outputText?: boolean
	outputVtt?: boolean
	outputSrt?: boolean
	outputCsv?: boolean
	language?: string
	translateToEnglish?: boolean
	timestamps_length?: number
	wordTimestamps?: boolean
	splitOnWord?: boolean
	outputWords?: boolean
	diarize?: boolean
	tinydiarize?: boolean
	wordThreshold?: number
	entropyThreshold?: number
	probabilityThreshold?: number
	outputFileName?: string
	noFallback?: boolean
	noTimestamps?: boolean
	detectLanguage?: boolean
	specialTokens?: boolean
	colors?: boolean
	progress?: boolean
	logScore?: boolean
	disableGPU?: boolean
	beamSize?: number
	debug?: boolean
	maxContent?: number
	bestOf?: number
}
