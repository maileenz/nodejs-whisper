import path from 'path'

import fs from 'fs'
import { MODELS, MODELS_LIST, MODEL_OBJECT } from './constants'
import { IOptions } from '.'
import { WhisperOptions } from './types'

export const constructCommand = (filePath: string, args: IOptions): string => {
	let errors: string[] = []

	if (!args.modelName) {
		errors.push('[Nodejs-whisper] Error: Provide model name')
	}

	if (!MODELS_LIST.includes(args.modelName)) {
		errors.push(`[Nodejs-whisper] Error: Enter a valid model name. Available models are: ${MODELS_LIST.join(', ')}`)
	}

	const modelPath = path.join(__dirname, '..', 'whisper.cpp', 'models', MODEL_OBJECT[args.modelName])
	if (!fs.existsSync(modelPath)) {
		errors.push(
			'[Nodejs-whisper] Error: Model file does not exist. Please ensure the model is downloaded and correctly placed.'
		)
	}

	if (errors.length > 0) {
		throw new Error(errors.join('\n'))
	}

	const modelName = MODEL_OBJECT[args.modelName as keyof typeof MODEL_OBJECT]
	let command = `./main  ${constructOptionsFlags(args.whisperOptions)} -l ${args.whisperOptions?.language ? args.whisperOptions?.language : 'auto'} -m ./models/${modelName}  -f ${filePath}`

	return command
}

const constructOptionsFlags = (opts: WhisperOptions): string => {
	let flags = [
		opts.outputText ? '-otxt ' : '',
		opts.outputVtt ? '-ovtt ' : '',
		opts.outputSrt ? '-osrt ' : '',
		opts.outputCsv ? '-ocsv ' : '',
		opts.translateToEnglish ? '-tr ' : '',
		opts.wordTimestamps ? '-ml 1 ' : '',
		opts.maxContent ? `-mc ${opts.maxContent}` : '',
		opts.timestamps_length ? `-ml ${opts.timestamps_length} ` : '',
		opts.splitOnWord ? '-sow ' : '',
		opts.outputWords ? '-owts ' : '',
		opts.diarize ? '-di ' : '',
		opts.tinydiarize ? '-tdrz ' : '',
		opts.wordThreshold ? `-wt ${opts.wordThreshold}` : '',
		opts.entropyThreshold ? `-et ${opts.entropyThreshold}` : '',
		opts.probabilityThreshold ? `-lpt ${opts.probabilityThreshold}` : '',
		opts.threads ? `-t ${opts.threads} ` : '',
		opts.processors ? `-p ${opts.processors} ` : '',
		opts.outputFileName ? `-of ${opts.outputFileName} ` : '',
		opts.bestOf ? `-bo ${opts.bestOf} ` : '',
		opts.noFallback ? '-nf ' : '',
		opts.noTimestamps ? '-nt ' : '',
		opts.logScore ? '-ls ' : '',
		opts.detectLanguage ? '-dl ' : '',
		opts.disableGPU ? '-ng ' : '',
		opts.specialTokens ? '-ps ' : '',
		opts.colors ? '-pc ' : '',
		opts.progress ? '-pp ' : '',
		opts.debug ? '-debug ' : '',
	].join('')

	return flags.trim()
}
