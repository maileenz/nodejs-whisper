#! /usr/bin/env node
"use strict";
// npx nodejs-whisper download
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
exports.default = downloadModel;
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const readline_sync_1 = __importDefault(require("readline-sync"));
const constants_1 = require("./constants");
const fs_1 = __importDefault(require("fs"));
const askForModel = () => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield readline_sync_1.default.question(`\n[Nodejs-whisper] Enter model name (e.g. 'tiny.en') or 'cancel' to exit\n(ENTER for tiny.en): `);
    if (answer === 'cancel') {
        console.log('[Nodejs-whisper] Exiting model downloader.\n');
        process.exit(0);
    }
    // User presses enter
    else if (answer === '') {
        console.log('[Nodejs-whisper] Going with', constants_1.DEFAULT_MODEL);
        return constants_1.DEFAULT_MODEL;
    }
    else if (!constants_1.MODELS_LIST.includes(answer)) {
        console.log('\n[Nodejs-whisper] FAIL: Name not found. Check your spelling OR quit wizard and use custom model.\n');
        return yield askForModel();
    }
    return answer;
});
const askIfUserWantToUseCuda = () => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield readline_sync_1.default.question(`\n[Nodejs-whisper] Do you want to use CUDA for compilation? (y/n)\n(ENTER for n): `);
    if (answer === 'y') {
        console.log('[Nodejs-whisper] Using CUDA for compilation.');
        return true;
    }
    else {
        console.log('[Nodejs-whisper] Not using CUDA for compilation.');
        return false;
    }
});
function downloadModel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            shelljs_1.default.cd(path_1.default.join(__dirname, '..', './whisper.cpp/models'));
            let anyModelExist = [];
            constants_1.MODELS.forEach(model => {
                if (!fs_1.default.existsSync(path_1.default.join(__dirname, '..', `./whisper.cpp/models/${model}`))) {
                }
                else {
                    anyModelExist.push(model);
                }
            });
            if (anyModelExist.length > 0) {
                return;
                // console.log('Models already exist. Skipping download.')
            }
            else {
                console.log('[Nodejs-whisper] Models do not exist. Please Select a model to download.\n');
            }
            console.log(`
			| Model          | Disk   | RAM      |
			|----------------|--------|----------|
			| tiny           |  75 MB | ~390 MB  |
			| tiny.en        |  75 MB | ~390 MB  |
			| tiny-q5_1      |  30 MB | ~390 MB  |
			| tiny.en-q5_1   |  30 MB | ~390 MB  |
			| base           | 142 MB | ~500 MB  |
			| base.en        | 142 MB | ~500 MB  |
			| base-q5_1      | 	57 MB | ~500 MB  |
			| base.en-q5_1   | 	57 MB | ~500 MB  |
			| small          | 466 MB | ~1.0 GB  |
			| small.en       | 466 MB | ~1.0 GB  |
			| small.en-tdrz  | 466 MB | ~1.0 GB  |
			| small-q5_1     | 185 MB | ~1.0 GB  |
			| small.en-q5_1  | 185 MB | ~1.0 GB  |
			| medium         | 1.5 GB | ~2.6 GB  |
			| medium.en      | 1.5 GB | ~2.6 GB  |
			| medium-q5_0    | 530 MB | ~2.6 GB  |
			| medium.en-q5_0 | 530 MB | ~2.6 GB  |
			| large-v1       | 2.9 GB | ~4.7 GB  |
			| large-v2       | 2.9 GB | ~4.7 GB  |
			| large-v2-q5_0  |   1 GB | ~4.7 GB  |
			| large-v3       | 2.9 GB | ~4.7 GB  |
			| large-v3-q5_0  |   1 GB | ~4.7 GB  |
		`);
            if (!shelljs_1.default.which('./download-ggml-model.sh')) {
                throw '[Nodejs-whisper] Error: Downloader not found.\n';
            }
            const modelName = yield askForModel();
            let scriptPath = './download-ggml-model.sh';
            if (process.platform === 'win32')
                scriptPath = 'download-ggml-model.cmd';
            shelljs_1.default.chmod('+x', scriptPath);
            shelljs_1.default.exec(`${scriptPath} ${modelName}`);
            console.log('[Nodejs-whisper] Attempting to compile model...\n');
            shelljs_1.default.cd('../');
            shelljs_1.default.exec('make clean');
            const withCuda = yield askIfUserWantToUseCuda();
            if (withCuda) {
                shelljs_1.default.exec('WHISPER_CUDA=1 make -j');
            }
            else {
                shelljs_1.default.exec('make -j');
            }
            process.exit(0);
        }
        catch (error) {
            console.log('[Nodejs-whisper] Error Caught in downloadModel\n');
            console.log(error);
            return error;
        }
    });
}
// run on npx nodejs-whisper download
downloadModel();
//# sourceMappingURL=downloadModel.js.map