import { i18nDict } from './config.js';
import { requestFullScreenMode, showConfirm } from './ui.js';

export function startSingleProcess() { 
    requestFullScreenMode(); 
    window.isBatchMode = false; 
    document.getElementById('btn-next-step1').innerHTML = i18nDict[window.currentLang]['btn_next_step']; 
    nextStep(1); 
}

export function startBatchProcess() { 
    requestFullScreenMode(); 
    window.isBatchMode = true; 
    document.getElementById('btn-next-step1').innerHTML = i18nDict[window.currentLang]['btn_to_excel']; 
    nextStep(1); 
}

export function proceedFromStep1() { 
    if (window.isBatchMode) {
        nextStep('excel'); 
    } else {
        nextStep(2); 
    }
}

export function goHome() { 
    showConfirm('홈 화면 이동', '현재 작성 중인 내용은 자동 임시저장됩니다.\n첫 화면으로 돌아가시겠습니까?', () => { 
        nextStep(0); 
    }); 
}

export function nextStep(step) {
    document.querySelectorAll('.step-container').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    
    const progContainer = document.getElementById('progress-container');
    if (step === 0) { 
        progContainer.classList.add('hidden'); 
    } else { 
        progContainer.classList.remove('hidden'); 
        
        const stepNum = step === 'excel' ? 2 : parseInt(step);
        
        for (let i = 1; i <= 7; i++) {
            const btn = document.getElementById(`stepper-btn-${i}`);
            if (!btn) continue;
            const circle = btn.querySelector('.step-circle');
            
            circle.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 border-white shadow-sm step-circle';
            
            if (i < stepNum) {
                circle.classList.add('bg-blue-100', 'text-blue-600', 'ring-1', 'ring-blue-300');
            } else if (i === stepNum) {
                circle.classList.add('bg-blue-600', 'text-white', 'ring-2', 'ring-blue-600', 'scale-110');
            } else {
                circle.classList.add('bg-slate-100', 'text-slate-400', 'ring-1', 'ring-slate-200');
            }
        }
        
        const line = document.getElementById('stepper-progress-line');
        if (window.isBatchMode) {
            if (line) line.style.width = stepNum === 1 ? '0%' : '100%';
            for (let i = 3; i <= 7; i++) {
                const btn = document.getElementById(`stepper-btn-${i}`);
                if(btn) btn.classList.add('hidden');
            }
        } else {
            if (line) line.style.width = `${((stepNum - 1) / 6) * 100}%`;
            for (let i = 3; i <= 7; i++) {
                const btn = document.getElementById(`stepper-btn-${i}`);
                if(btn) btn.classList.remove('hidden');
            }
        }
    }
    window.scrollTo(0,0);
}

export function navigateStep(targetStep) {
    if (window.isBatchMode && targetStep > 2) return;
    if (window.isBatchMode && targetStep === 2) {
        nextStep('excel');
    } else {
        nextStep(targetStep);
    }
}

export function prevStep(step) { 
    nextStep(step); 
}

export function editInfo() {
    const firstError = document.querySelector('.error-highlight');
    if (firstError) {
        const stepContainer = firstError.closest('.step-container');
        if (stepContainer && stepContainer.id) {
            const stepNum = parseInt(stepContainer.id.replace('step-', ''), 10);
            if (!isNaN(stepNum)) {
                nextStep(stepNum);
                setTimeout(() => {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
                return;
            }
        }
    }
    nextStep(2);
}

export function handleModeChange() {
    const visa = document.querySelector('input[name="visaType"]:checked')?.value;
    const req = document.querySelector('input[name="reqType"]:checked')?.value;
    const submitter = document.querySelector('input[name="submitter"]:checked')?.value || 'self';
    
    document.querySelectorAll('input[name="reqType"]').forEach(el => {
        const lbl = el.closest('label');
        lbl.className = 'flex items-center p-4 border rounded-xl cursor-pointer transition border-slate-200 bg-white h-full relative pr-12';
        lbl.querySelector('span:first-of-type, div>span').className = 'font-bold text-slate-700 block';
    });
    
    const activeReq = document.querySelector('input[name="reqType"]:checked');
    if (activeReq) {
        const activeLbl = activeReq.closest('label');
        activeLbl.className = 'flex items-center p-4 border rounded-xl cursor-pointer transition border-blue-400 bg-blue-50 ring-1 ring-blue-400 shadow-sm h-full relative pr-12';
        activeLbl.querySelector('span:first-of-type, div>span').className = 'font-bold text-blue-800 block';
    }

    ['wrap_new_workplace', 'wrap_reentry_period', 'wrap_refund_acc', 'wrap_dorm', 'wrap_family_proxy', 'wrap_spouse', 'wrap_parents', 'wrap_guar_period'].forEach(id => {
        const dom = document.getElementById(id); 
        if(dom) dom.classList.add('hidden');
    });

    if (req === 'chk_change_work' || req === 'chk_change_status') { 
        const dom = document.getElementById('wrap_new_workplace'); 
        if(dom) dom.classList.remove('hidden'); 
    }
    if (req === 'chk_reentry') { 
        const dom = document.getElementById('wrap_reentry_period'); 
        if(dom) dom.classList.remove('hidden'); 
    }
    if (req === 'chk_alien_reg' || req === 'chk_reissue') { 
        const dom = document.getElementById('wrap_refund_acc'); 
        if(dom) dom.classList.remove('hidden'); 
    }
    if (req === 'chk_extension' || req === 'chk_change_work' || req === 'chk_alien_reg' || req === 'chk_change_residence') { 
        const dom = document.getElementById('wrap_dorm'); 
        if(dom) dom.classList.remove('hidden'); 
    }
    if (visa === 'E-7' && (req === 'chk_extension' || req === 'chk_change_status')) {
        const dom = document.getElementById('wrap_guar_period');
        if(dom) dom.classList.remove('hidden');
    }
    
    if (submitter === 'spouse') { 
        if(document.getElementById('wrap_family_proxy')) document.getElementById('wrap_family_proxy').classList.remove('hidden'); 
        if(document.getElementById('wrap_spouse')) document.getElementById('wrap_spouse').classList.remove('hidden'); 
    } else if (submitter === 'parents') { 
        if(document.getElementById('wrap_family_proxy')) document.getElementById('wrap_family_proxy').classList.remove('hidden'); 
        if(document.getElementById('wrap_parents')) document.getElementById('wrap_parents').classList.remove('hidden'); 
    }
    
    autoSuggestDocs();
}

export function autoSuggestDocs() {
    const visa = document.querySelector('input[name="visaType"]:checked')?.value;
    const req = document.querySelector('input[name="reqType"]:checked')?.value;
    
    document.getElementById('gen_main').checked = true; 
    document.getElementById('gen_residence').checked = false; 
    document.getElementById('gen_guarantee').checked = false;
    
    if (['chk_extension', 'chk_change_work', 'chk_alien_reg'].includes(req)) {
        document.getElementById('gen_residence').checked = true; 
    }
    if (visa === 'E-7' && ['chk_extension', 'chk_change_status'].includes(req)) {
        document.getElementById('gen_guarantee').checked = true; 
    }
}

export function prepareGenerate() { 
    autoSuggestDocs(); 
    nextStep(6); 
}

export function saveFormData() {
    const data = {};
    document.querySelectorAll('input, select').forEach(el => {
        if (el.type === 'file') return;
        if (el.classList.contains('final-checklist-item')) return; 
        
        if (el.type === 'radio' || el.type === 'checkbox') { 
            if (el.name) {
                data[`${el.name}_${el.value}`] = el.checked; 
            } else if (el.id) {
                data[el.id] = el.checked; 
            }
        } else { 
            if (el.id) data[el.id] = el.value; 
        }
    });
    try { 
        localStorage.setItem('visaAutoSave', JSON.stringify(data)); 
    } catch(e) {}
}

export function loadFormData() {
    try {
        const saved = localStorage.getItem('visaAutoSave');
        if (saved) {
            const data = JSON.parse(saved);
            document.querySelectorAll('input, select').forEach(el => {
                if (el.type === 'file') return;
                if (el.classList.contains('final-checklist-item')) return;
                
                if (el.type === 'radio' || el.type === 'checkbox') { 
                    let key = el.name ? `${el.name}_${el.value}` : el.id; 
                    if (data[key] !== undefined) el.checked = data[key]; 
                } else { 
                    if (el.id && data[el.id] !== undefined) el.value = data[el.id]; 
                }
            });
        }
    } catch(e) {}
}

let autoSaveTimer;
export function handleInputEvents(e) {
    const target = e.target;
    
    if (target.type !== 'file') { 
        clearTimeout(autoSaveTimer); 
        autoSaveTimer = setTimeout(saveFormData, 500); 
    }
    
    if (target.classList.contains('date-format')) {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val.length < 5) {
            target.value = val; 
        } else if (val.length < 7) {
            target.value = val.replace(/(\d{4})(\d+)/, '$1-$2'); 
        } else {
            target.value = val.replace(/(\d{4})(\d{2})(\d{1,2}).*/, '$1-$2-$3');
        }
        return;
    }
    
    if (target.classList.contains('money-format')) {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val) {
            target.value = Number(val).toLocaleString('en-US'); 
        } else {
            target.value = '';
        }
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
        if (val.length < 7) {
            target.value = val; 
        } else {
            target.value = val.replace(/(\d{6})(\d{1,7}).*/, '$1-$2');
        }
    }
    
    if (target.id.includes('regno')) {
        let val = target.value.replace(/[^0-9]/g, '');
        if (val.length < 4) {
            target.value = val; 
        } else if (val.length < 6) {
            target.value = val.replace(/(\d{3})(\d+)/, '$1-$2'); 
        } else {
            target.value = val.replace(/(\d{3})(\d{2})(\d{1,5}).*/, '$1-$2-$3');
        }
    }
    
    if (target.classList.contains('error-highlight')) { 
        target.classList.remove('error-highlight'); 
    }
}

export function handleChangeEvents(e) {
    if (e.target.type !== 'file') {
        saveFormData(); 
    }
}
