import { fetchWithBackoff } from './utils.js';
import { showMsg, clearHighlights } from './ui.js';
import { i18nDict } from './config.js';

export async function runIDOCR(inputEl) {
    if (inputEl.files.length === 0) return;
    const file = inputEl.files[0];
    const loadingUI = document.getElementById('ocr-loading');
    
    loadingUI.classList.remove('hidden'); 
    loadingUI.classList.add('flex');
    
    try {
        const reader = new FileReader();
        const base64Data = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        const prompt = `당신은 출입국 신분증 판독 AI입니다. 업로드된 신분증(여권 또는 외국인등록증) 이미지를 분석하여 텍스트를 추출하고, 반드시 아래 JSON 양식에 맞춰 반환하세요.
        - 이름은 성(Surname)과 명(Given Name)으로 분리할 것.
        - 날짜 형식은 반드시 YYYY-MM-DD 포맷을 유지할 것.
        - 여권 하단의 MRZ 코드(P<...)가 보이면 최우선으로 참고하여 정확도를 높일 것.
        { "i_surname": "성", "i_givenname": "명", "i_dob": "YYYY-MM-DD", "i_gender": "M 또는 F", "i_nation": "국적(영문)", "i_arc": "외국인등록번호(없으면 빈칸)", "i_passport": "여권번호", "i_pass_issue": "YYYY-MM-DD", "i_pass_exp": "YYYY-MM-DD" }`;

        const payload = {
            contents: [
                { 
                    role: "user", 
                    parts: [
                        { text: prompt }, 
                        { inlineData: { mimeType: file.type, data: base64Data } }
                    ] 
                }
            ],
            generationConfig: { responseMimeType: "application/json" }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${window.apiKey}`;
        
        const result = await fetchWithBackoff(apiUrl, payload);
        
        if (result.error) throw new Error(result.error.message);
        
        const data = JSON.parse(result.candidates[0].content.parts[0].text);
        
        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);
            if (el && data[key]) {
                if (el.tagName === 'SELECT') { 
                    el.value = data[key]; 
                } else { 
                    el.value = data[key]; 
                }
            }
        });
        
        if(window.saveFormData) window.saveFormData(); 
        clearHighlights();
        showMsg('OCR 자동입력 성공', '신분증에서 정보를 성공적으로 추출했습니다.\n틀린 곳이 없는지 눈으로 한 번 더 확인해주세요.', 'success');
        
    } catch(e) {
        showMsg('OCR 실패', '이미지 판독 중 오류가 발생했습니다.\n수동으로 입력해주세요.', 'error');
    } finally {
        loadingUI.classList.add('hidden'); 
        loadingUI.classList.remove('flex'); 
        inputEl.value = '';
    }
}

export function previewFiles(inputEl) {
    if (!inputEl || !inputEl.files) return;
    const files = inputEl.files;
    const container = document.getElementById('file-preview-container');
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = e.target.result;
            const fileIndex = window.uploadedImagesBase64.length;
            
            window.uploadedImagesBase64.push({ mimeType: file.type, data: fileData.split(',')[1] });
            
            const wrapper = document.createElement('div');
            wrapper.className = 'relative h-16 w-16 flex-shrink-0 group';
            wrapper.id = `preview-file-${fileIndex}`;
            
            let innerHTML = '';
            if (file.type.startsWith('image/')) {
                innerHTML = `<img src="${fileData}" class="h-16 w-16 object-cover rounded-xl shadow-sm border border-white/20">`;
            } else if (file.type === 'application/pdf') {
                innerHTML = `<div class="h-16 w-16 flex flex-col items-center justify-center bg-white/10 rounded-xl shadow-sm border border-white/20 text-center backdrop-blur-sm"><i class="fa-solid fa-file-pdf text-2xl mb-1 text-red-300"></i><span class="text-[9px] font-bold text-white">PDF</span></div>`;
            } else {
                innerHTML = `<div class="h-16 w-16 flex flex-col items-center justify-center bg-white/10 rounded-xl shadow-sm border border-white/20 text-center overflow-hidden px-1 backdrop-blur-sm"><i class="fa-solid fa-file text-xl mb-1 text-indigo-300"></i><span class="text-[8px] font-bold text-white break-all line-clamp-1">${file.name}</span></div>`;
            }
            
            innerHTML += `<button onclick="window.removePreviewFile(${fileIndex})" class="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-rose-600"><i class="fa-solid fa-xmark"></i></button>`;
            
            wrapper.innerHTML = innerHTML;
            container.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
    });
    
    inputEl.value = '';
}

export function removePreviewFile(index) {
    window.uploadedImagesBase64[index] = null;
    const el = document.getElementById(`preview-file-${index}`);
    if (el) el.remove();
}

export function clearPreviewFiles() {
    window.uploadedImagesBase64 = [];
    document.getElementById('file-preview-container').innerHTML = '';
}

export async function runAIVerification() {
    const validDocs = window.uploadedImagesBase64.filter(doc => doc !== null);
    if (validDocs.length === 0) {
        return showMsg('안내', '검증할 증빙 서류를 업로드(또는 촬영) 해주세요.', 'info');
    }
    
    const btn = document.getElementById('btn-run-ai'); 
    const resultBox = document.getElementById('ai-result-box');
    
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> ${i18nDict[window.currentLang]['ai_loading']}`; 
    btn.disabled = true; 
    resultBox.classList.add('hidden');
    
    clearHighlights();

    const getVal = (id) => document.getElementById(id)?.value || '';
    const getUpperVal = (id) => getVal(id).toUpperCase();
    
    const formData = {
        "외국인 인적사항": {
            "i_surname": getUpperVal('i_surname'), 
            "i_givenname": getUpperVal('i_givenname'),
            "i_dob": getVal('i_dob'), 
            "i_nation": getUpperVal('i_nation'), 
            "i_arc": getVal('i_arc'), 
            "i_passport": getUpperVal('i_passport'),
            "i_address_kr": getVal('i_address_kr'), 
            "i_income": getVal('i_income') ? getVal('i_income') + "만원" : "", 
            "i_job": getVal('i_job')
        },
        "근무처(고용주) 정보": {
            "i_cname": getVal('i_cname'), 
            "i_cregno": getVal('i_cregno'), 
            "i_rep_name": getVal('i_rep_name'),
            "i_rep_id": getVal('i_rep_id'), 
            "i_cphone": getVal('i_cphone'), 
            "i_caddr": getVal('i_caddr')
        },
        "신원보증 기간": getVal('i_guar_start') + " ~ " + getVal('i_guar_end')
    };

    const langNameMap = { 'kr': '한국어', 'en': 'English', 'vn': 'Tiếng Việt' };
    const aiLang = langNameMap[window.currentLang] || '한국어';

    try {
        const prompt = `당신은 대한민국 법무부 출입국·외국인정책본부의 최고 수준 비자 서류 심사관(Vision AI)입니다.
업로드된 증빙 서류들을 정밀 판독하여 아래 [신청서 데이터]와 일치하는지, [제출된 서류 상호 간] 모순이 없는지 교차 검증하세요.

[특명 1: 휴대폰 카메라 촬영본 및 다중 문서 종합 분석 지침]
- 사용자가 휴대폰 카메라로 여러 번에 걸쳐 나누어 찍어 올린 낱장 사진들이 혼재되어 있을 수 있습니다.
- 어떤 사진이 여권인지, 등록증인지, 근로계약서인지, 사업자등록증명인지 스스로 분류하고 문맥을 이어 붙여 종합적으로 판단하십시오.
- 조명 반사, 빛 번짐, 손가락 그림자, 문서의 일부 잘림, 구김, 낮은 해상도 등으로 인해 글씨가 흐리거나 왜곡되었더라도 절대 포기하지 마십시오. 주변 글자의 문맥과 [신청서 데이터]를 바탕으로 픽셀 단위로 추론하여 최대한 정확하게 대조하십시오.
- 오독이 강하게 의심되는 부분은 [신청서 데이터]의 내용이 맞을 가능성을 염두에 두고 논리적으로 유추하십시오.

[특명 2: 정밀 교차 검증 필수 5대 항목]
1. 인적사항 대조 (신청서 vs 여권 vs 외국인등록증 vs 근로계약서 등): 영문 성명(철자 하나하나 확인), 생년월일, 여권번호, 외국인등록번호, 국적이 100% 일치하는가?
2. 근무처 정보 대조 (신청서 vs 사업자등록증 vs 근로계약서 등): 회사명, 사업자번호, 대표자명, 주소가 일치하는가? (변경 이력 등으로 인한 표기 차이가 논리적으로 설명되는지 고려할 것)
3. 소득/직업 대조: 신청서 '연소득금액'이 증빙 서류(근로계약서 급여, 소득금액증명) 내용과 모순되지 않는가?
4. 체류지/주소 대조: 신청서 주소와 신분증 뒷면, 임대차계약서, 기숙사 제공 확인서 상의 주소가 일치하는가?
5. 서류 간 자체 모순 (Document vs Document): 제출된 서류들 간의 정보가 서로 충돌하지 않는가? (예: 여권 상 영문명과 근로계약서 상 영문명 불일치 여부)

[특명 3: 언어 설정 (CRITICAL)]
JSON 응답 내의 'category', 'description', 'recommendation' 값은 반드시 현재 사용자가 시스템에서 선택한 언어인 [ ${aiLang} ]로 번역하여 작성하십시오.

[신청서 데이터]
${JSON.stringify(formData, null, 2)}

[특명 4: 에러 반환 규칙]
오류 발견 시, 반드시 JSON 내의 'fieldId' 키에 에러가 발생한 항목의 영문 Key 이름(예: i_surname, i_cname, i_income 등)을 정확히 매핑해서 적어주십시오. 이것이 있어야 사용자의 화면에 해당 입력칸을 붉은색으로 강조해줄 수 있습니다. 오류가 전혀 없으면 status에 "PASS"를 넣으세요.`;

        const parts = [{ text: prompt }];
        validDocs.forEach(doc => {
            parts.push({ inlineData: { mimeType: doc.mimeType, data: doc.data } });
        });
        
        const payload = {
            contents: [{ role: "user", parts: parts }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT", 
                    properties: { 
                        "status": { type: "STRING" }, 
                        "issues": { 
                            type: "ARRAY", 
                            items: { 
                                type: "OBJECT", 
                                properties: { 
                                    "fieldId": { type: "STRING" }, 
                                    "category": { type: "STRING" }, 
                                    "description": { type: "STRING" }, 
                                    "recommendation": { type: "STRING" } 
                                } 
                            } 
                        } 
                    }
                }
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${window.apiKey}`;
        
        const result = await fetchWithBackoff(apiUrl, payload);
        if (result.error) throw new Error(result.error.message);
        
        const aiData = JSON.parse(result.candidates[0].content.parts[0].text);
        resultBox.classList.remove('hidden');

        if (aiData.status === 'PASS' || !aiData.issues?.length) {
            resultBox.className = 'bg-white text-emerald-800 border-2 border-emerald-400 rounded-2xl p-5 mb-6 text-sm shadow-lg shadow-emerald-500/20';
            resultBox.innerHTML = `<div class="font-extrabold text-base mb-2 flex items-center"><i class="fa-solid fa-circle-check text-2xl mr-2 text-emerald-500"></i> ${i18nDict[window.currentLang]['ai_pass_title']}</div><p class="text-emerald-600 font-medium">${i18nDict[window.currentLang]['ai_pass_desc']}</p>`;
        } else {
            resultBox.className = 'bg-white text-rose-900 border-2 border-rose-400 rounded-2xl p-5 mb-6 text-sm shadow-lg shadow-rose-500/20';
            let html = `<div class="font-extrabold text-base mb-3 flex items-center text-rose-600"><i class="fa-solid fa-triangle-exclamation text-2xl mr-2"></i> ${i18nDict[window.currentLang]['ai_fail_title']} (${aiData.issues.length}건)</div><div class="space-y-3">`;
            aiData.issues.forEach(iss => { 
                html += `
                <div class="bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <span class="inline-block px-2 py-1 bg-rose-200 text-rose-800 text-[10px] font-bold rounded-md mb-1">${iss.category}</span>
                    <div class="font-bold text-sm text-slate-800 mb-1">${iss.description}</div>
                    <div class="text-xs text-rose-600">${iss.recommendation}</div>
                </div>`; 
                
                if (iss.fieldId) { 
                    const targetEl = document.getElementById(iss.fieldId); 
                    if (targetEl) targetEl.classList.add('error-highlight'); 
                }
            });
            resultBox.innerHTML = html + `</div>`;
            showMsg(i18nDict[window.currentLang]['ai_msg_fail_title'], i18nDict[window.currentLang]['ai_msg_fail_desc'], 'info');
        }
    } catch (e) { 
        showMsg(i18nDict[window.currentLang]['ai_msg_err_title'], i18nDict[window.currentLang]['ai_msg_err_desc'], 'error'); 
    } finally { 
        btn.innerHTML = `<i class="fa-solid fa-rotate-right mr-2"></i> <span id="btn_verify_text">${i18nDict[window.currentLang]['btn_ai_recheck']}</span>`; 
        btn.disabled = false; 
    }
}
