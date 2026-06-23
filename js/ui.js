import { i18nDict, docMatrix, reqNames } from './config.js';

export let confirmAction = null;

export function changeLanguage(lang) {
    window.currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nDict[lang] && i18nDict[lang][key]) {
            el.innerHTML = i18nDict[lang][key];
        }
    });
    
    if (window.isBatchMode) {
        document.getElementById('btn-next-step1').innerHTML = i18nDict[lang]['btn_to_excel'];
    } else {
        document.getElementById('btn-next-step1').innerHTML = i18nDict[lang]['btn_next_step'];
    }
    
    const aiBtn = document.getElementById('btn_verify_text');
    if (aiBtn) {
        aiBtn.innerHTML = i18nDict[lang]['btn_verify'];
    }

    document.querySelectorAll('.doc-name-label').forEach(el => {
        const newName = el.getAttribute(`data-${lang}`);
        if (newName) el.innerHTML = newName;
    });

    document.querySelectorAll('.badge-auto').forEach(el => el.innerHTML = i18nDict[lang]['badge_auto']);
    document.querySelectorAll('.badge-company').forEach(el => el.innerHTML = i18nDict[lang]['badge_company']);
    document.querySelectorAll('.badge-personal').forEach(el => el.innerHTML = i18nDict[lang]['badge_personal']);
}

export function openDBModal() { 
    document.getElementById('db-modal').classList.add('active'); 
    if(window.renderDBList) window.renderDBList(); 
}

export function closeDBModal() { 
    document.getElementById('db-modal').classList.remove('active'); 
}

export function openAdminModal() { 
    document.getElementById('admin-modal').classList.add('active'); 
    if(window.updateTemplateStatusUI) window.updateTemplateStatusUI(); 
}

export function closeAdminModal() { 
    document.getElementById('admin-modal').classList.remove('active'); 
}

export function closeExcelModal() {
    document.getElementById('excel-modal').classList.remove('active');
}

export function showConfirm(title, desc, actionFn) { 
    document.getElementById('confirm-title').innerText = title; 
    document.getElementById('confirm-desc').innerText = desc; 
    confirmAction = actionFn; 
    document.getElementById('confirm-modal').classList.add('active'); 
}

export function closeConfirm() { 
    document.getElementById('confirm-modal').classList.remove('active'); 
    confirmAction = null; 
}

export function confirmOk() {
    if (confirmAction) confirmAction();
    closeConfirm();
}

export function showMsg(title, desc, type='info') {
    const iconWrap = document.getElementById('msg-icon');
    if (type === 'info') {
        iconWrap.innerHTML = '<div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500"><i class="fa-solid fa-circle-info text-3xl"></i></div>';
    } else if (type === 'error') {
        iconWrap.innerHTML = '<div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500"><i class="fa-solid fa-triangle-exclamation text-3xl"></i></div>';
    } else if (type === 'success') {
        iconWrap.innerHTML = '<div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500"><i class="fa-solid fa-circle-check text-3xl"></i></div>';
    }
    
    document.getElementById('msg-title').innerText = title; 
    document.getElementById('msg-desc').innerHTML = desc; 
    document.getElementById('msg-modal').classList.add('active');
}

export function closeMsg() { 
    document.getElementById('msg-modal').classList.remove('active'); 
}

export function clearHighlights() {
    document.querySelectorAll('.error-highlight').forEach(el => {
        el.classList.remove('error-highlight');
    });
}

export function requestFullScreenMode() {
    try {
        const doc = window.document;
        const docEl = doc.documentElement;
        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            if (requestFullScreen) {
                const fsPromise = requestFullScreen.call(docEl);
                if (fsPromise !== undefined) {
                    fsPromise.catch(err => {
                        console.warn("전체화면 모드를 지원하지 않거나 권한이 차단되었습니다:", err);
                    });
                }
            }
        }
    } catch(e) {
        console.log("Fullscreen API not supported or blocked", e);
    }
}

export function showDocInfo(e, reqType) {
    e.preventDefault();
    e.stopPropagation(); 
    
    const visa = document.querySelector('input[name="visaType"]:checked').value;
    const docList = docMatrix[visa]?.[reqType] || docMatrix[visa]?.['default'];
    
    let html = `<div class="mb-6 text-sm md:text-base font-extrabold text-white bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-900 flex justify-center items-center text-center break-keep">
        <span><span class="text-yellow-400 mr-1.5">[${visa}]</span> ${reqNames[reqType]} 필수 서류</span>
    </div>`;
    
    html += `<div class="space-y-3">`;
    docList.forEach(doc => {
        let badge = '';
        let borderClass = '';
        
        const badgeBaseClass = "text-[11px] md:text-xs px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap shadow-sm inline-block";
        
        if (doc.type === 'auto') {
            badge = `<span class="badge-auto bg-blue-100 text-blue-700 border border-blue-200 ${badgeBaseClass}">${i18nDict[window.currentLang]['badge_auto']}</span>`;
            borderClass = 'border-blue-200 bg-blue-50/50';
        } else if (doc.type === 'company') {
            badge = `<span class="badge-company bg-emerald-100 text-emerald-700 border border-emerald-200 ${badgeBaseClass}">${i18nDict[window.currentLang]['badge_company']}</span>`;
            borderClass = 'border-emerald-200 bg-emerald-50/30';
        } else {
            badge = `<span class="badge-personal bg-amber-100 text-amber-700 border border-amber-200 ${badgeBaseClass}">${i18nDict[window.currentLang]['badge_personal']}</span>`;
            borderClass = 'border-amber-200 bg-amber-50/30';
        }
        
        html += `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border ${borderClass}">
            <div class="text-sm md:text-base font-bold text-slate-700 leading-snug break-keep flex-1 doc-name-label" 
                  data-kr="${doc.name.kr}" data-en="${doc.name.en}" data-vn="${doc.name.vn}">
                ${doc.name[window.currentLang] || doc.name.kr}
            </div>
            <div class="shrink-0 text-left sm:text-right">${badge}</div>
        </div>`;
    });
    html += `</div>`;
    
    document.getElementById('doc-info-content').innerHTML = html;
    document.getElementById('doc-info-modal').classList.add('active');
}

export function closeDocInfo() {
    document.getElementById('doc-info-modal').classList.remove('active');
}
