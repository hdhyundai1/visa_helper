import { CONFIG } from './config.js';
import { encryptData, decryptData, getCryptoKey, fetchWithBackoff, base64ToArrayBuffer } from './utils.js';
import { changeLanguage, openDBModal, closeDBModal, openAdminModal, closeAdminModal, closeExcelModal, showConfirm, closeConfirm, confirmOk, showMsg, closeMsg, clearHighlights, requestFullScreenMode, showDocInfo, closeDocInfo } from './ui.js';
import { startSingleProcess, startBatchProcess, proceedFromStep1, goHome, nextStep, navigateStep, prevStep, editInfo, handleModeChange, autoSuggestDocs, prepareGenerate, saveFormData, loadFormData, handleInputEvents, handleChangeEvents } from './form.js';
import { createSingleDoc, generateSelectedPDFs, uploadSpecificTemplate, updateTemplateStatusUI, renderChecklist, checkFinalSuccess } from './pdf.js';
import { downloadExcelTemplate, processExcelBatch } from './excel.js';
import { runIDOCR, previewFiles, removePreviewFile, clearPreviewFiles, runAIVerification } from './ai.js';
import { saveToEmployeeDB, renderDBList, loadEmployeeData, deleteEmployee } from './firebase.js';

// HTML 내부에 인라인(inline)으로 바인딩된 이벤트 속성(onclick, onchange 등)에서 
// 호출할 수 있도록 모듈의 기능들을 브라우저 전역 객체(window)에 매핑합니다.
window.apiKey = CONFIG.apiKey;
window.isBatchMode = false;
window.currentLang = 'kr';
window.uploadedImagesBase64 = [];

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

// DOM이 로드되었을 때 앱 초기 설정 진행 (안전한 로드 방식 적용)
function initApp() {
    // 고급 달력 선택기 라이브러리(Flatpickr) 활성화
    if (window.flatpickr) {
        flatpickr(".datepicker-input", {
            locale: "ko",              
            dateFormat: "Y-m-d",       
            allowInput: true,          
            disableMobile: "true"      
        });
    }
    
    // 이전에 입력 중이던 데이터 복원 및 UI 세팅
    loadFormData(); 
    updateTemplateStatusUI(); 
    handleModeChange(); 
}

// 모듈 스크립트 특성상 늦게 로드되어도 초기화가 무조건 실행되도록 보장
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

// 타이핑 중 자동 저장, 번호 하이픈 자동 삽입 등의 공통 입력 이벤트 리스너 바인딩
document.addEventListener('input', handleInputEvents);
document.addEventListener('change', handleChangeEvents);
