// js/main.js
import { CONFIG, i18nDict, docMatrix, reqNames } from './config.js';
import { encryptData, decryptData, getCryptoKey, fetchWithBackoff, base64ToArrayBuffer } from './utils.js';
import { changeLanguage, openDBModal, closeDBModal, openAdminModal, closeAdminModal, closeExcelModal, showConfirm, closeConfirm, confirmOk, showMsg, closeMsg, clearHighlights, requestFullScreenMode, showDocInfo, closeDocInfo } from './ui.js';
import { startSingleProcess, startBatchProcess, proceedFromStep1, goHome, nextStep, navigateStep, prevStep, editInfo, handleModeChange, autoSuggestDocs, prepareGenerate, saveFormData, loadFormData } from './form.js';
import { createSingleDoc, generateSelectedPDFs, uploadSpecificTemplate, updateTemplateStatusUI, renderChecklist, checkFinalSuccess } from './pdf.js';
import { downloadExcelTemplate, processExcelBatch } from './excel.js';
import { runIDOCR, previewFiles, removePreviewFile, clearPreviewFiles, runAIVerification } from './ai.js';
import { saveToEmployeeDB, renderDBList, loadEmployeeData, deleteEmployee } from './firebase.js';

// 전역 변수 설정
window.apiKey = CONFIG.apiKey;
window.isBatchMode = false;
window.currentLang = 'kr';
window.uploadedImagesBase64 = [];

// ----------------------------------------------------
// 모듈 함수들을 HTML의 onclick 이벤트가 찾을 수 있도록 window에 등록
// ----------------------------------------------------
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


// ----------------------------------------------------
// DOM 로드 완료 후 앱 초기화 및 실시간 입력 이벤트 바인딩
// ----------------------------------------------------
function initApp() {
    if (window.flatpickr) {
        flatpickr(".datepicker-input", { locale: "ko", dateFormat: "Y-m-d", allowInput: true, disableMobile: "true" });
    }
    if (window.loadFormData) window.loadFormData();
    if (window.updateTemplateStatusUI) window.updateTemplateStatusUI();
    if (window.handleModeChange) window.handleModeChange();
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

let autoSaveTimer;
document.addEventListener('input', (e) => {
    const target = e.target;
    if (target.type !== 'file') { 
        clearTimeout(autoSaveTimer); 
        autoSaveTimer = setTimeout(window.saveFormData, 500); 
    }
    
    if (target.classList.contains('date-format')) {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val.length < 5) target.value = val; 
        else if (val.length < 7) target.value = val.replace(/(\d{4})(\d+)/, '$1-$2'); 
        else target.value = val.replace(/(\d{4})(\d{2})(\d{1,2}).*/, '$1-$2-$3');
        return;
    }
    
    if (target.classList.contains('money-format')) {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val) target.value = Number(val).toLocaleString('en-US'); 
        else target.value = '';
        return;
    }
    
    if (target.type === 'tel' && target.id !== 'i_home_phone') {
        let val = target.value.replace(/[^0-9]/g, ''); 
        let res = '';
        if (val.startsWith('02')) { 
            if (val.length < 3) res = val; 
            else if (val.length < 6) res = val.replace(/(\d{2})(\d+)/, '$1-$2'); 
            else if (val.length < 10) res = val.replace(/(\d{2})(\d{3})(\d+)/, '$1-$2-$3'); 
            else res = val.replace(/(\d{2})(\d{4})(\d{4}).*/, '$1-$2-$3');
        } else { 
            if (val.length < 4) res = val; 
            else if (val.length < 7) res = val.replace(/(\d{3})(\d+)/, '$1-$2'); 
            else if (val.length < 11) res = val.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3'); 
            else res = val.replace(/(\d{3})(\d{4})(\d{4}).*/, '$1-$2-$3'); 
        }
        target.value = res;
    }
    
    if (target.id === 'i_home_phone') {
        target.value = target.value.replace(/[^0-9+\- ]/g, ''); 
    }
    
    if (target.id === 'i_arc' || target.id === 'i_rep_id') {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val.length < 7) target.value = val; 
        else target.value = val.replace(/(\d{6})(\d{1,7}).*/, '$1-$2');
    }
    
    if (target.id.includes('regno')) {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val.length < 4) target.value = val; 
        else if (val.length < 6) target.value = val.replace(/(\d{3})(\d+)/, '$1-$2'); 
        else target.value = val.replace(/(\d{3})(\d{2})(\d{1,5}).*/, '$1-$2-$3');
    }
    
    if (target.classList.contains('error-highlight')) { 
        target.classList.remove('error-highlight'); 
    }
});

document.addEventListener('change', (e) => {
    if (e.target.type !== 'file' && window.saveFormData) {
        window.saveFormData(); 
    }
});
