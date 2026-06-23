import { CONFIG } from './config.js';
import { encryptData, decryptData, getCryptoKey, fetchWithBackoff, base64ToArrayBuffer } from './utils.js';
import { changeLanguage, openDBModal, closeDBModal, openAdminModal, closeAdminModal, closeExcelModal, showConfirm, closeConfirm, confirmOk, showMsg, closeMsg, clearHighlights, requestFullScreenMode, showDocInfo, closeDocInfo } from './ui.js';
import { startSingleProcess, startBatchProcess, proceedFromStep1, goHome, nextStep, navigateStep, prevStep, editInfo, handleModeChange, autoSuggestDocs, prepareGenerate, saveFormData, loadFormData, handleInputEvents, handleChangeEvents } from './form.js';
import { createSingleDoc, generateSelectedPDFs, uploadSpecificTemplate, updateTemplateStatusUI, renderChecklist, checkFinalSuccess } from './pdf.js';
import { downloadExcelTemplate, processExcelBatch } from './excel.js';
import { runIDOCR, previewFiles, removePreviewFile, clearPreviewFiles, runAIVerification } from './ai.js';
import { saveToEmployeeDB, renderDBList, loadEmployeeData, deleteEmployee } from './firebase.js';

// HTML의 onclick 등에서 함수를 사용할 수 있도록 window 객체에 모두 매핑합니다.
window.apiKey = CONFIG.apiKey;
window.isBatchMode = false;
window.currentLang = 'kr';
window.uploadedImagesBase64 = [];

window.encryptData = encryptData;
window.decryptData = decryptData;
window.getCryptoKey = getCryptoKey;
window.fetchWithBackoff = fetchWithBackoff;
window.base64ToArrayBuffer = base64ToArrayBuffer;

window.changeLanguage = changeLanguage;
window.openDBModal = openDBModal;
window.closeDBModal = closeDBModal;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.closeExcelModal = closeExcelModal;
window.showConfirm = showConfirm;
window.closeConfirm = closeConfirm;
window.confirmOk = confirmOk;
window.showMsg = showMsg;
window.closeMsg = closeMsg;
window.clearHighlights = clearHighlights;
window.requestFullScreenMode = requestFullScreenMode;
window.showDocInfo = showDocInfo;
window.closeDocInfo = closeDocInfo;

window.startSingleProcess = startSingleProcess;
window.startBatchProcess = startBatchProcess;
window.proceedFromStep1 = proceedFromStep1;
window.goHome = goHome;
window.nextStep = nextStep;
window.navigateStep = navigateStep;
window.prevStep = prevStep;
window.editInfo = editInfo;
window.handleModeChange = handleModeChange;
window.autoSuggestDocs = autoSuggestDocs;
window.prepareGenerate = prepareGenerate;
window.saveFormData = saveFormData;
window.loadFormData = loadFormData;

window.createSingleDoc = createSingleDoc;
window.generateSelectedPDFs = generateSelectedPDFs;
window.uploadSpecificTemplate = uploadSpecificTemplate;
window.updateTemplateStatusUI = updateTemplateStatusUI;
window.renderChecklist = renderChecklist;
window.checkFinalSuccess = checkFinalSuccess;

window.downloadExcelTemplate = downloadExcelTemplate;
window.processExcelBatch = processExcelBatch;

window.runIDOCR = runIDOCR;
window.previewFiles = previewFiles;
window.removePreviewFile = removePreviewFile;
window.clearPreviewFiles = clearPreviewFiles;
window.runAIVerification = runAIVerification;

window.saveToEmployeeDB = saveToEmployeeDB;
window.renderDBList = renderDBList;
window.loadEmployeeData = loadEmployeeData;
window.deleteEmployee = deleteEmployee;

// DOM 로드 시 초기화 보장
function initApp() {
    if (window.flatpickr) {
        flatpickr(".datepicker-input", { locale: "ko", dateFormat: "Y-m-d", allowInput: true, disableMobile: "true" });
    }
    loadFormData();
    updateTemplateStatusUI();
    handleModeChange();
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

document.addEventListener('input', handleInputEvents);
document.addEventListener('change', handleChangeEvents);
