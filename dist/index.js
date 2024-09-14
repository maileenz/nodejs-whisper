"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodewhisper = nodewhisper;
const whisper_1 = require("./whisper");
const fs_1 = __importDefault(require("fs"));
const WhisperHelper_1 = require("./WhisperHelper");
const utils_1 = require("./utils");
const autoDownloadModel_1 = __importDefault(require("./autoDownloadModel"));
function nodewhisper(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { verbose = false, removeWavFileAfterTranscription = false } = options;
            if (options.autoDownloadModelName) {
                if (verbose)
                    console.log(`[Nodejs-whisper] Checking and downloading model if needed: ${options.autoDownloadModelName}`);
                console.log('autoDownloadModelName', options.autoDownloadModelName);
                console.log('options', options);
                yield (0, autoDownloadModel_1.default)(options.autoDownloadModelName, verbose, options.withCuda);
            }
            if (verbose)
                console.log(`[Nodejs-whisper] Checking file existence: ${filePath}`);
            (0, utils_1.checkIfFileExists)(filePath);
            if (verbose)
                console.log(`[Nodejs-whisper] Converting file to WAV format: ${filePath}`);
            const outputFilePath = yield (0, utils_1.convertToWavType)(filePath, verbose);
            if (verbose)
                console.log(`[Nodejs-whisper] Constructing command for file: ${outputFilePath}`);
            const command = (0, WhisperHelper_1.constructCommand)(outputFilePath, options);
            if (verbose)
                console.log(`[Nodejs-whisper] Executing command: ${command}`);
            const transcript = yield (0, whisper_1.executeCppCommand)(command, verbose, options.withCuda);
            if (!transcript) {
                throw new Error('Transcription failed or produced no output.');
            }
            if (removeWavFileAfterTranscription && fs_1.default.existsSync(outputFilePath)) {
                if (verbose)
                    console.log(`[Nodejs-whisper] Removing temporary WAV file: ${outputFilePath}`);
                fs_1.default.unlinkSync(outputFilePath);
            }
            return transcript;
        }
        catch (error) {
            console.error(`[Nodejs-whisper] Error during processing: ${error.message}`);
            throw new Error(`Operation failed: ${error.message}`);
        }
    });
}
//# sourceMappingURL=index.js.map