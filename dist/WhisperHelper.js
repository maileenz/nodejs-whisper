"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructCommand = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
const constructCommand = (filePath, args) => {
    var _a, _b;
    let errors = [];
    if (!args.modelName) {
        errors.push('[Nodejs-whisper] Error: Provide model name');
    }
    if (!constants_1.MODELS_LIST.includes(args.modelName)) {
        errors.push(`[Nodejs-whisper] Error: Enter a valid model name. Available models are: ${constants_1.MODELS_LIST.join(', ')}`);
    }
    const modelPath = path_1.default.join(__dirname, '..', 'whisper.cpp', 'models', constants_1.MODEL_OBJECT[args.modelName]);
    if (!fs_1.default.existsSync(modelPath)) {
        errors.push('[Nodejs-whisper] Error: Model file does not exist. Please ensure the model is downloaded and correctly placed.');
    }
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    const modelName = constants_1.MODEL_OBJECT[args.modelName];
    let command = `./main  ${constructOptionsFlags(args.whisperOptions)} -l ${((_a = args.whisperOptions) === null || _a === void 0 ? void 0 : _a.language) ? (_b = args.whisperOptions) === null || _b === void 0 ? void 0 : _b.language : 'auto'} -m ./models/${modelName}  -f ${filePath}`;
    return command;
};
exports.constructCommand = constructCommand;
const constructOptionsFlags = (opts) => {
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
    ].join('');
    return flags.trim();
};
//# sourceMappingURL=WhisperHelper.js.map