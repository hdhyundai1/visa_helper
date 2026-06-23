import { docMatrix, i18nDict } from './config.js';
import { showMsg, updateTemplateStatusUI as uiUpdateTemplate } from './ui.js';
import { base64ToArrayBuffer } from './utils.js';

const PDF_COORDS_MAIN = {
    chk_alien_reg: { type: 'check', x: 69, y: 696 }, 
    chk_reissue: { type: 'check', x: 67, y: 663 }, 
    chk_extension: { type: 'check', x: 68, y: 639 }, 
    chk_change_status: { type: 'check', x: 68, y: 616 },
    val_change_status: { type: 'text', x: 187, y: 611, w: 23, h: 9 }, 
    chk_grant_status: { type: 'check', x: 68, y: 580 }, 
    chk_extra_act: { type: 'check', x: 226, y: 697 }, 
    chk_change_work: { type: 'check', x: 228, y: 663 },
    chk_reentry: { type: 'check', x: 226, y: 639 }, 
    chk_change_residence: { type: 'check', x: 226, y: 616 },
    surname: { type: 'text', x: 128, y: 524, w: 137, h: 11 }, 
    givenname: { type: 'text', x: 269, y: 524, w: 159, h: 11 },
    dob_yyyy: { type: 'text', x: 147, y: 496, w: 80, h: 13 }, 
    dob_mm: { type: 'text', x: 228, y: 498, w: 38, h: 11 }, 
    dob_dd: { type: 'text', x: 268, y: 498, w: 39, h: 11 }, 
    gender_m: { type: 'check', x: 370, y: 516 }, 
    gender_f: { type: 'check', x: 369, y: 505 }, 
    nation: { type: 'text', x: 482, y: 476, w: 56, h: 46 },
    arc_1: { type: 'text', x: 187, y: 476, w: 19, h: 20 }, 
    arc_2: { type: 'text', x: 207, y: 476, w: 20, h: 20 }, 
    arc_3: { type: 'text', x: 228, y: 476, w: 19, h: 20 }, 
    arc_4: { type: 'text', x: 249, y: 476, w: 17, h: 20 }, 
    arc_5: { type: 'text', x: 269, y: 476, w: 19, h: 20 }, 
    arc_6: { type: 'text', x: 289, y: 476, w: 18, h: 20 }, 
    arc_7: { type: 'text', x: 308, y: 476, w: 17, h: 20 }, 
    arc_8: { type: 'text', x: 325, y: 476, w: 19, h: 20 }, 
    arc_9: { type: 'text', x: 343, y: 476, w: 16, h: 20 }, 
    arc_10: { type: 'text', x: 362, y: 476, w: 16, h: 20 }, 
    arc_11: { type: 'text', x: 378, y: 476, w: 17, h: 20 }, 
    arc_12: { type: 'text', x: 397, y: 476, w: 16, h: 20 }, 
    arc_13: { type: 'text', x: 414, y: 476, w: 16, h: 20 },
    passport: { type: 'text', x: 127, y: 454, w: 101, h: 21 }, 
    pass_issue: { type: 'text', x: 308, y: 454, w: 87, h: 21 }, 
    pass_exp: { type: 'text', x: 480, y: 455, w: 59, h: 21 },
    address_kr: { type: 'text', x: 127, y: 434, w: 412, h: 20 }, 
    phone: { type: 'text', x: 184, y: 419, w: 113, h: 13 }, 
    cellphone: { type: 'text', x: 417, y: 420, w: 121, h: 13 },
    address_home: { type: 'text', x: 185, y: 399, w: 231, h: 21 }, 
    home_phone: { type: 'text', x: 483, y: 398, w: 55, h: 21 },
    cname: { type: 'text', x: 208, y: 335, w: 53, h: 20 }, 
    cregno: { type: 'text', x: 355, y: 335, w: 59, h: 20 }, 
    cphone: { type: 'text', x: 482, y: 334, w: 57, h: 21 },
    new_cname: { type: 'text', x: 207, y: 313, w: 53, h: 21 }, 
    new_cregno: { type: 'text', x: 356, y: 313, w: 59, h: 20 }, 
    new_cphone: { type: 'text', x: 482, y: 313, w: 56, h: 21 },
    job: { type: 'text', x: 483, y: 299, w: 55, h: 15 }, 
    income: { type: 'text', x: 207, y: 299, w: 47, h: 14 }, 
    reentry_period: { type: 'text', x: 208, y: 287, w: 53, h: 13 }, 
    email: { type: 'text', x: 355, y: 286, w: 163, h: 13 }, 
    refund_acc: { type: 'text', x: 356, y: 266, w: 183, h: 19 },
    app_date: { type: 'text', x: 208, y: 252, w: 87, h: 13 }, 
    sign_main: { type: 'text', x: 436, y: 252, w: 101, h: 13 }, 
    sign_sub_1: { type: 'text', x: 99, y: 130, w: 64, h: 22 }, 
    sign_sub_2: { type: 'text', x: 274, y: 130, w: 57, h: 19 }, 
    sign_sub_3: { type: 'text', x: 449, y: 130, w: 40, h: 18 }
};

const PDF_COORDS_RESIDENCE = {
    f_nation: { type: 'text', x: 167, y: 683, w: 84, h: 45 }, 
    f_arc: { type: 'text', x: 388, y: 683, w: 142, h: 45 },
    f_name: { type: 'text', x: 168, y: 656, w: 194, h: 25 }, 
    f_phone: { type: 'text', x: 429, y: 654, w: 103, h: 26 }, 
    f_addr: { type: 'text', x: 168, y: 629, w: 362, h: 25 },
    p_nation: { type: 'text', x: 167, y: 554, w: 73, h: 38 }, 
    p_id: { type: 'text', x: 378, y: 554, w: 153, h: 39 }, 
    p_name: { type: 'text', x: 168, y: 525, w: 207, h: 25 }, 
    p_phone: { type: 'text', x: 429, y: 525, w: 99, h: 25 },
    rel_family: { type: 'check', x: 182, y: 503 }, 
    rel_employer: { type: 'check', x: 271, y: 502 }, 
    rel_other: { type: 'check', x: 366, y: 502 }, 
    rel_other_desc: { type: 'text', x: 428, y: 509, w: 96, h: 13 },
    own_self: { type: 'check', x: 181, y: 468 }, 
    own_rent: { type: 'check', x: 273, y: 470 }, 
    own_other: { type: 'check', x: 380, y: 469 }, 
    own_other_desc: { type: 'text', x: 440, y: 468, w: 83, h: 14 },
    type_private: { type: 'check', x: 181, y: 441 }, 
    type_dorm: { type: 'check', x: 325, y: 441 }, 
    type_hotel: { type: 'check', x: 182, y: 413 }, 
    type_other: { type: 'check', x: 326, y: 412 }, 
    type_other_desc: { type: 'text', x: 388, y: 406, w: 131, h: 17 },
    start_y: { type: 'text', x: 169, y: 374, w: 45, h: 19 }, 
    start_m: { type: 'text', x: 254, y: 374, w: 37, h: 18 }, 
    start_d: { type: 'text', x: 342, y: 373, w: 36, h: 21 },
    sign_y: { type: 'text', x: 150, y: 313, w: 61, h: 17 }, 
    sign_m: { type: 'text', x: 250, y: 314, w: 23, h: 16 }, 
    sign_d: { type: 'text', x: 316, y: 314, w: 21, h: 14 },
    p_sign_name: { type: 'text', x: 261, y: 290, w: 69, h: 17 }, 
    p_company: { type: 'text', x: 263, y: 275, w: 68, h: 15 }
};

const PDF_COORDS_GUARANTEE = {
    f_surname: { type: 'text', x: 131, y: 672, w: 127, h: 30 }, 
    f_givenname: { type: 'text', x: 274, y: 672, w: 134, h: 29 }, 
    f_hanja: { type: 'text', x: 434, y: 672, w: 97, h: 29 },
    f_dob: { type: 'text', x: 163, y: 640, w: 245, h: 29 }, 
    f_sex_m: { type: 'check', x: 465, y: 654 }, 
    f_sex_f: { type: 'check', x: 507, y: 654 },
    f_nation: { type: 'text', x: 149, y: 607, w: 258, h: 31 }, 
    f_pass: { type: 'text', x: 450, y: 607, w: 81, h: 31 },
    f_addr: { type: 'text', x: 181, y: 576, w: 226, h: 30 }, 
    f_phone: { type: 'text', x: 451, y: 577, w: 80, h: 28 }, 
    f_purpose: { type: 'text', x: 166, y: 546, w: 362, h: 27 },
    p_name: { type: 'text', x: 145, y: 474, w: 260, h: 27 }, 
    p_hanja: { type: 'text', x: 434, y: 473, w: 97, h: 28 }, 
    p_nation: { type: 'text', x: 147, y: 444, w: 258, h: 25 },
    p_sex_m: { type: 'check', x: 466, y: 457 }, 
    p_sex_f: { type: 'check', x: 508, y: 456 },
    p_dob: { type: 'text', x: 220, y: 413, w: 186, h: 29 }, 
    p_phone: { type: 'text', x: 450, y: 414, w: 79, h: 27 }, 
    p_addr: { type: 'text', x: 143, y: 381, w: 385, h: 30 },
    p_rel: { type: 'text', x: 199, y: 352, w: 330, h: 29 }, 
    p_company: { type: 'text', x: 153, y: 320, w: 253, h: 29 }, 
    p_job: { type: 'text', x: 436, y: 321, w: 93, h: 27 },
    p_caddr: { type: 'text', x: 178, y: 290, w: 228, h: 27 }, 
    p_note: { type: 'text', x: 437, y: 290, w: 93, h: 27 }, 
    p_period: { type: 'text', x: 338, y: 260, w: 189, h: 25 }, 
    sign_y: { type: 'text', x: 355, y: 96, w: 60, h: 13 }, 
    sign_m: { type: 'text', x: 429, y: 98, w: 34, h: 12 }, 
    sign_d: { type: 'text', x: 480, y: 97, w: 31, h: 13 }, 
    p_sign_name: { type: 'text', x: 356, y: 66, w: 124, h: 20 }
};

export async function createSingleDoc(docType, fontBuffer, valFn, PDFDocument, rgb) {
    const tplB64 = localStorage.getItem(`visaPdfTemplate_${docType}`);
    const pdfDoc = await PDFDocument.load(base64ToArrayBuffer(tplB64));
    
    pdfDoc.registerFontkit(window.fontkit); 
    const font = await pdfDoc.embedFont(fontBuffer); 
    const page = pdfDoc.getPages()[0]; 
    const inkColor = rgb(0.1, 0.2, 0.8);
    
    const coords = docType === 'main' ? PDF_COORDS_MAIN : (docType === 'residence' ? PDF_COORDS_RESIDENCE : PDF_COORDS_GUARANTEE);

    const drawBox = (coordKey, text) => {
        if (!text) return; 
        const pos = coords[coordKey]; 
        if (!pos) return;
        
        if (pos.type === 'check') { 
            page.drawText('V', { x: pos.x - 5, y: pos.y - 5, size: 12, font: font, color: inkColor }); 
            return; 
        }
        
        if (pos.type === 'text' && pos.w && pos.h) {
            let str = String(text).trim(); 
            let fontSize = 9; 
            let lines = []; 
            let lineHeight = 0;
            
            if (str.includes('\n')) {
                lines = str.split('\n'); 
                lineHeight = fontSize * 1.2;
                while (fontSize >= 6) { 
                    let tooWide = false; 
                    for (let l of lines) { 
                        if (font.widthOfTextAtSize(l, fontSize) > pos.w) {
                            tooWide = true; 
                        }
                    } 
                    if (!tooWide && (lines.length * lineHeight <= pos.h)) {
                        break; 
                    }
                    fontSize -= 0.5; 
                    lineHeight = fontSize * 1.2; 
                }
            } else {
                while (fontSize >= 6) {
                    lines = []; 
                    let tempLine = ''; 
                    lineHeight = fontSize * 1.2;
                    
                    for (let i = 0; i < str.length; i++) {
                        let char = str[i]; 
                        let testLine = tempLine + char;
                        
                        if (font.widthOfTextAtSize(testLine, fontSize) > pos.w - 2) { 
                            let breakFound = false;
                            for (let j = tempLine.length - 1; j > 0; j--) { 
                                if (tempLine[j] === '-' || tempLine[j] === ' ') { 
                                    lines.push(tempLine.substring(0, j)); 
                                    tempLine = (tempLine[j] === '-' ? '-' : '') + tempLine.substring(j + 1) + char; 
                                    breakFound = true; 
                                    break; 
                                } 
                            }
                            if (!breakFound) { 
                                if (tempLine !== '') { 
                                    lines.push(tempLine); 
                                    tempLine = char; 
                                } else { 
                                    lines.push(testLine); 
                                    tempLine = ''; 
                                } 
                            }
                        } else { 
                            tempLine = testLine; 
                        }
                    }
                    if (tempLine) lines.push(tempLine); 
                    if (lines.length * lineHeight <= pos.h + 2) break; 
                    
                    fontSize -= 0.5; 
                }
            }
            
            let startY = pos.y + (pos.h / 2) + ((lines.length * lineHeight) / 2) - fontSize + (fontSize * 0.2); 
            
            lines.forEach((line, idx) => {
                let textW = font.widthOfTextAtSize(line.trim(), fontSize); 
                let drawX = pos.x + (pos.w / 2) - (textW / 2); 
                if (drawX < pos.x) drawX = pos.x; 
                
                page.drawText(line.trim(), { 
                    x: drawX, 
                    y: startY - (idx * lineHeight), 
                    size: fontSize, 
                    font: font, 
                    color: inkColor 
                });
            });
        }
    };

    const getUpperVal = (id) => (valFn(id) || '').toUpperCase();
    const fullFName = getUpperVal('i_surname') + ' ' + getUpperVal('i_givenname');
    const today = new Date(); 
    const ty = String(today.getFullYear()); 
    const tm = String(today.getMonth() + 1); 
    const td = String(today.getDate());

    if (docType === 'main') {
        const reqType = valFn('reqType') || document.querySelector('input[name="reqType"]:checked')?.value;
        if (reqType) drawBox(reqType, 'check');
        
        drawBox('val_change_status', getUpperVal('val_change_status')); 
        drawBox('surname', getUpperVal('i_surname')); 
        drawBox('givenname', getUpperVal('i_givenname'));
        
        const dob = valFn('i_dob'); 
        if (dob) { 
            const p = dob.split('-'); 
            drawBox('dob_yyyy', p[0]); 
            drawBox('dob_mm', p[1]); 
            drawBox('dob_dd', p[2]); 
        }
        
        const gender = valFn('i_gender') || document.getElementById('i_gender')?.value; 
        if (gender === 'M') drawBox('gender_m', 'check'); 
        if (gender === 'F') drawBox('gender_f', 'check');
        
        drawBox('nation', getUpperVal('i_nation')); 
        
        const arcRaw = (valFn('i_arc') || '').replace(/-/g, ''); 
        for (let i = 0; i < arcRaw.length; i++) { 
            if (i < 13) drawBox(`arc_${i + 1}`, arcRaw[i]); 
        }
        
        drawBox('passport', getUpperVal('i_passport')); 
        drawBox('pass_issue', valFn('i_pass_issue')); 
        drawBox('pass_exp', valFn('i_pass_exp'));
        drawBox('address_kr', valFn('i_address_kr')); 
        drawBox('phone', valFn('i_phone')); 
        drawBox('cellphone', valFn('i_cellphone'));
        drawBox('address_home', getUpperVal('i_address_home')); 
        drawBox('home_phone', valFn('i_home_phone'));
        drawBox('cname', valFn('i_cname')); 
        drawBox('cregno', valFn('i_cregno')); 
        drawBox('cphone', valFn('i_cphone'));
        drawBox('new_cname', valFn('i_new_cname')); 
        drawBox('new_cregno', valFn('i_new_cregno')); 
        drawBox('new_cphone', valFn('i_new_cphone'));
        drawBox('job', valFn('i_job')); 
        drawBox('income', (valFn('i_income') || '').replace(/,/g, '')); 
        drawBox('reentry_period', valFn('i_reentry_period')); 
        drawBox('email', getUpperVal('i_email'));
        
        let refundStr = ''; 
        if (valFn('i_refund_bank') || valFn('i_refund_acc')) {
            refundStr = `${valFn('i_refund_bank')} / ${valFn('i_refund_acc')}`.replace(/^ \/ | \/ $/g, ''); 
        }
        drawBox('refund_acc', refundStr); 
        drawBox('app_date', `${ty}.${tm}.${td}`); 
        drawBox('sign_main', fullFName.replace('\n', ' ')); 
        
        const submitter = valFn('submitter') || document.querySelector('input[name="submitter"]:checked')?.value || 'self';
        if (submitter === 'self') {
            drawBox('sign_sub_1', fullFName); 
        } else if (submitter === 'spouse') {
            drawBox('sign_sub_2', getUpperVal('i_spouse').replace(' ', '\n')); 
        } else if (submitter === 'parents') {
            drawBox('sign_sub_3', getUpperVal('i_parents').replace(' ', '\n'));
        }

    } else if (docType === 'residence') {
        drawBox('f_nation', getUpperVal('i_nation')); 
        drawBox('f_name', fullFName); 
        drawBox('f_arc', valFn('i_arc')); 
        drawBox('f_phone', valFn('i_cellphone')); 
        drawBox('f_addr', valFn('i_address_kr'));
        drawBox('p_id', valFn('i_rep_id')); 
        drawBox('p_nation', '대한민국'); 
        drawBox('p_name', valFn('i_rep_name')); 
        drawBox('p_phone', valFn('i_cphone'));
        drawBox('rel_employer', 'check'); 
        
        const rOwn = valFn('r_own') || document.querySelector('input[name="r_own"]:checked')?.value; 
        if (rOwn) drawBox(rOwn, 'check');
        
        const rType = valFn('r_type') || document.querySelector('input[name="r_type"]:checked')?.value; 
        if (rType) drawBox(rType, 'check');
        
        const start = valFn('i_dorm_start'); 
        if (start) { 
            const p = start.split('-'); 
            drawBox('start_y', p[0]); 
            drawBox('start_m', p[1]); 
            drawBox('start_d', p[2]); 
        }
        
        drawBox('sign_y', ty); 
        drawBox('sign_m', tm); 
        drawBox('sign_d', td); 
        drawBox('p_sign_name', valFn('i_rep_name')); 
        drawBox('p_company', valFn('i_cname'));

    } else if (docType === 'guarantee') {
        drawBox('f_surname', getUpperVal('i_surname')); 
        drawBox('f_givenname', getUpperVal('i_givenname'));
        
        const gFSex = valFn('i_gender') || document.getElementById('i_gender')?.value; 
        if (gFSex === 'M') drawBox('f_sex_m', 'check'); 
        if (gFSex === 'F') drawBox('f_sex_f', 'check');
        
        drawBox('f_dob', valFn('i_dob')); 
        drawBox('f_nation', getUpperVal('i_nation')); 
        drawBox('f_pass', getUpperVal('i_passport'));
        drawBox('f_phone', valFn('i_cellphone')); 
        drawBox('f_addr', valFn('i_address_kr')); 
        drawBox('f_purpose', '취업');
        drawBox('p_name', valFn('i_rep_name')); 
        drawBox('p_nation', '대한민국');
        
        const gPSex = valFn('i_rep_gender') || document.getElementById('i_rep_gender')?.value; 
        if (gPSex === 'M') drawBox('p_sex_m', 'check'); 
        if (gPSex === 'F') drawBox('p_sex_f', 'check');
        
        drawBox('p_dob', valFn('i_rep_id')); 
        drawBox('p_phone', valFn('i_cphone')); 
        drawBox('p_addr', valFn('i_caddr'));
        drawBox('p_rel', '고용주'); 
        
        let gStart = valFn('i_guar_start') || '';
        let gEnd = valFn('i_guar_end') || '';
        let periodStr = (gStart && gEnd) ? `${gStart} ~ ${gEnd}` : '2년 (최장 4년)';
        drawBox('p_period', periodStr); 
        
        drawBox('p_company', valFn('i_cname')); 
        drawBox('p_job', '대표이사'); 
        drawBox('p_caddr', valFn('i_caddr')); 
        
        drawBox('sign_y', ty); 
        drawBox('sign_m', tm); 
        drawBox('sign_d', td); 
        drawBox('p_sign_name', valFn('i_rep_name'));
    }
    
    const pdfBytes = await pdfDoc.save(); 
    return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function generateSelectedPDFs() {
    const btn = document.getElementById('btn-generate-all');
    const zone = document.getElementById('download-zone');
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> 초고속 문서 생성 중...'; 
    btn.disabled = true; 
    zone.innerHTML = ''; 
    zone.classList.add('hidden');

    const getValUI = (id) => document.getElementById(id)?.value || '';
    const { PDFDocument, rgb } = window.PDFLib;
    
    try {
        const targets = [
            { id: 'gen_main', type: 'main', name: '통합신청서', color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
            { id: 'gen_residence', type: 'residence', name: '거주숙소제공확인서', color: 'bg-emerald-600', hoverColor: 'hover:bg-emerald-700' },
            { id: 'gen_guarantee', type: 'guarantee', name: '신원보증서', color: 'bg-indigo-600', hoverColor: 'hover:bg-indigo-700' }
        ];
        
        let isSelected = false;
        for (let t of targets) {
            if (document.getElementById(t.id).checked) {
                isSelected = true;
                if (!localStorage.getItem(`visaPdfTemplate_${t.type}`)) {
                    throw new Error(`[${t.name}] 빈 양식(PDF)이 없습니다.\n설정 메뉴에서 양식을 등록해주세요.`);
                }
            }
        }
        
        if (!isSelected) {
            throw new Error("선택된 문서가 없습니다.");
        }

        const fontUrl = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumgothic/NanumGothic-Regular.ttf';
        const fontBuffer = await (await fetch(fontUrl)).arrayBuffer();
        let successCount = 0; 
        let headerAdded = false;

        for (let t of targets) {
            if (document.getElementById(t.id).checked) {
                if (!headerAdded) { 
                    zone.innerHTML = `
                        <div class="w-full h-px bg-slate-200 my-2"></div>
                        <div class="inline-flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm mb-2 mx-auto">
                            <i class="fa-solid fa-check mr-2"></i>생성 완료! 버튼을 눌러 저장하세요
                        </div>`; 
                    headerAdded = true; 
                }
                
                const blob = await createSingleDoc(t.type, fontBuffer, getValUI, PDFDocument, rgb);
                const a = document.createElement('a'); 
                
                a.href = URL.createObjectURL(blob); 
                a.download = `${t.name}_${getValUI('i_surname').toUpperCase()}.pdf`;
                a.className = `block w-full ${t.color} ${t.hoverColor} text-white font-bold py-3.5 rounded-xl shadow-md text-center text-sm transition transform hover:-translate-y-0.5`;
                a.innerHTML = `<i class="fa-solid fa-download mr-2"></i> ${t.name} 다운로드`;
                
                zone.appendChild(a); 
                successCount++;
            }
        }
        
        zone.classList.remove('hidden');
        
        if(window.saveToEmployeeDB) {
            window.saveToEmployeeDB(); 
        }

    } catch(e) { 
        showMsg('생성 오류', e.message, 'error'); 
    } finally { 
        btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles mr-2 text-yellow-300"></i> ${i18nDict[window.currentLang]['btn_generate']}`; 
        btn.disabled = false; 
    }
}

export function uploadSpecificTemplate(docType, inputEl) {
    if (inputEl.files.length === 0) return;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            localStorage.setItem(`visaPdfTemplate_${docType}`, e.target.result.split(',')[1]);
            const names = { 
                'main': '통합신청서', 
                'residence': '거주/숙소제공서', 
                'guarantee': '신원보증서' 
            };
            showMsg('양식 등록 완료', `[${names[docType]}] 양식이 기기에 저장되었습니다.`, 'success');
            updateTemplateStatusUI();
        } catch(err) { 
            showMsg('저장 오류', '브라우저 보안 설정이나 용량 제한으로 인해 저장이 차단되었습니다.', 'error'); 
        }
        inputEl.value = ''; 
    };
    reader.readAsDataURL(inputEl.files[0]);
}

export function updateTemplateStatusUI() {
    const types = [ {id: 'main'}, {id: 'residence'}, {id: 'guarantee'} ];
    types.forEach(t => {
        const statusEl = document.getElementById(`status-${t.id}`);
        if (statusEl) {
            try {
                if (localStorage.getItem(`visaPdfTemplate_${t.id}`)) { 
                    statusEl.innerHTML = '<i class="fa-solid fa-check mr-1"></i> 등록 완료'; 
                    statusEl.className = 'text-[11px] text-emerald-600 font-bold mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100'; 
                } else { 
                    statusEl.innerHTML = '<i class="fa-solid fa-xmark mr-1"></i> 미등록'; 
                    statusEl.className = 'text-[11px] text-rose-500 font-bold mt-1 bg-white inline-block px-2 py-0.5 rounded border border-rose-100'; 
                }
            } catch(e) { 
                statusEl.innerHTML = '보안 차단됨'; 
            }
        }
    });
}

export function renderChecklist() {
    const visa = document.querySelector('input[name="visaType"]:checked').value;
    const reqType = document.querySelector('input[name="reqType"]:checked').value;
    const docList = docMatrix[visa]?.[reqType] || docMatrix[visa]?.['default'];
    
    const container = document.getElementById('checklist-container');
    let html = '<div class="space-y-3">';
    
    const badgeBaseClass = "text-[11px] md:text-xs px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap shadow-sm inline-block";

    docList.forEach((doc, idx) => {
        let badge = '';
        if (doc.type === 'auto') {
            badge = `<span class="badge-auto bg-blue-100 text-blue-700 border border-blue-200 ${badgeBaseClass}">${i18nDict[window.currentLang]['badge_auto']}</span>`;
        } else if (doc.type === 'company') {
            badge = `<span class="badge-company bg-emerald-100 text-emerald-700 border border-emerald-200 ${badgeBaseClass}">${i18nDict[window.currentLang]['badge_company']}</span>`;
        } else {
            badge = `<span class="badge-personal bg-amber-100 text-amber-700 border border-amber-200 ${badgeBaseClass}">${i18nDict[window.currentLang]['badge_personal']}</span>`;
        }
        
        const docName = doc.name[window.currentLang] || doc.name.kr;
        
        html += `
        <label class="flex items-start sm:items-center p-4 border border-slate-200 bg-white rounded-xl cursor-pointer hover:bg-slate-50 transition has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-400 has-[:checked]:ring-1 has-[:checked]:ring-emerald-400 shadow-sm">
            <div class="flex items-center h-full pt-0.5 sm:pt-0 mr-3.5">
                <input type="checkbox" class="w-6 h-6 custom-radio !accent-emerald-600 final-checklist-item" onchange="window.checkFinalSuccess()"> 
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3">
                <span class="doc-name-label font-bold text-slate-800 text-sm md:text-base leading-snug break-keep pr-2" data-kr="${doc.name.kr}" data-en="${doc.name.en}" data-vn="${doc.name.vn}">${docName}</span>
                <div class="shrink-0 text-left sm:text-right">${badge}</div>
            </div>
        </label>`;
    });
    html += '</div>';
    
    container.innerHTML = html;
    checkFinalSuccess(); 
}

export function checkFinalSuccess() {
    const checkboxes = document.querySelectorAll('.final-checklist-item');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const msgBox = document.getElementById('final-success-msg');
    
    if (checkboxes.length > 0 && allChecked) {
        msgBox.classList.remove('hidden');
    } else {
        msgBox.classList.add('hidden');
    }
}
