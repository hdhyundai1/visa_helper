import { showMsg, closeExcelModal } from './ui.js';
import { createSingleDoc } from './pdf.js';

export async function downloadExcelTemplate() {
    try {
        const workbook = new window.ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("비자명단");
        
        worksheet.columns = [
            { header: '성(Surname)', key: 'surname', width: 20 },
            { header: '명(Given Name)', key: 'givenname', width: 25 },
            { header: '생년월일(8자리숫자)', key: 'dob', width: 20 },
            { header: '성별', key: 'gender', width: 10 },
            { header: '국적', key: 'nation', width: 15 },
            { header: '외국인등록번호(13자리)', key: 'arc', width: 22 },
            { header: '여권번호', key: 'passport', width: 15 },
            { header: '여권발급일(8자리숫자)', key: 'pass_issue', width: 22 },
            { header: '여권만료일(8자리숫자)', key: 'pass_exp', width: 22 },
            { header: '대한민국주소', key: 'addr_kr', width: 35 },
            { header: '휴대전화', key: 'cellphone', width: 15 },
            { header: '일반전화', key: 'phone', width: 15 },
            { header: '본국주소', key: 'addr_home', width: 25 },
            { header: '본국전화번호', key: 'home_phone', width: 20 },
            { header: '이메일', key: 'email', width: 25 },
            { header: '제출자', key: 'submitter', width: 15 },
            { header: '대리인영문성명', key: 'proxy_name', width: 20 },
            { header: '원근무처_명칭', key: 'cname', width: 25 },
            { header: '원근무처_사업자번호(10자리)', key: 'cregno', width: 25 },
            { header: '원근무처_대표자명', key: 'rep_name', width: 15 },
            { header: '원근무처_대표자주민번호', key: 'rep_id', width: 25 },
            { header: '원근무처_대표자성별', key: 'rep_gender', width: 20 },
            { header: '원근무처_주소', key: 'caddr', width: 35 },
            { header: '원근무처_전화번호', key: 'cphone', width: 20 },
            { header: '예정근무처_명칭', key: 'new_cname', width: 20 },
            { header: '예정근무처_사업자번호', key: 'new_cregno', width: 20 },
            { header: '예정근무처_전화번호', key: 'new_cphone', width: 20 },
            { header: '숙소_소유형태', key: 'dorm_own', width: 15 },
            { header: '숙소_주거형태', key: 'dorm_type', width: 15 },
            { header: '숙소_제공시작일(8자리숫자)', key: 'dorm_start', width: 25 },
            { header: '직업', key: 'job', width: 15 },
            { header: '연소득(만원)', key: 'income', width: 15 },
            { header: '재입국신청기간', key: 'reentry', width: 15 },
            { header: '환급은행', key: 'refund_bank', width: 15 },
            { header: '환급계좌번호', key: 'refund_acc', width: 25 },
            { header: '신원보증_시작일', key: 'guar_start', width: 20 },
            { header: '신원보증_종료일', key: 'guar_end', width: 20 }
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
            cell.font = { bold: true, color: { argb: 'FF1F4E78' } };
            cell.border = { bottom: { style: 'thin' } };
        });

        worksheet.addRow({
            surname: 'BUI', givenname: 'QUOC TINH', dob: '19800812', gender: 'M', nation: 'VIETNAM', 
            arc: '8008125000000', passport: 'E03861791', pass_issue: '20200101', pass_exp: '20300101', addr_kr: '전라남도 영암군 삼호읍 신항로...', cellphone: '01012345678', 
            phone: '', addr_home: 'SON HA, THAI THUY', home_phone: '+84 00-000-0000', email: 'example@email.com', submitter: '본인', proxy_name: '', 
            cname: '에이치디현대삼호 주식회사', cregno: '4118119799', rep_name: '김재을', rep_id: '', rep_gender: 'M', caddr: '전라남도 영암군 삼호읍 대불로 93', 
            cphone: '0614602114', new_cname: '', new_cregno: '', new_cphone: '', dorm_own: '자가', dorm_type: '기숙사', dorm_start: '20240518', 
            job: '조선용접공', income: '3000', reentry: '', refund_bank: '', refund_acc: '', guar_start: '20240518', guar_end: '20260517'
        });

        worksheet.getColumn('dob').numFmt = '0000"-"00"-"00';
        worksheet.getColumn('pass_issue').numFmt = '0000"-"00"-"00';
        worksheet.getColumn('pass_exp').numFmt = '0000"-"00"-"00';
        worksheet.getColumn('dorm_start').numFmt = '0000"-"00"-"00';
        worksheet.getColumn('guar_start').numFmt = '0000"-"00"-"00';
        worksheet.getColumn('guar_end').numFmt = '0000"-"00"-"00';
        worksheet.getColumn('arc').numFmt = '000000"-"0000000';
        worksheet.getColumn('rep_id').numFmt = '000000"-"0000000';
        worksheet.getColumn('cregno').numFmt = '000"-"00"-"00000';
        worksheet.getColumn('new_cregno').numFmt = '000"-"00"-"00000';
        
        worksheet.getColumn('cellphone').numFmt = '@'; 
        worksheet.getColumn('phone').numFmt = '@';
        worksheet.getColumn('cphone').numFmt = '@';
        worksheet.getColumn('new_cphone').numFmt = '@';

        for (let i = 2; i <= 100; i++) {
            worksheet.getCell('D' + i).dataValidation = { type: 'list', allowBlank: true, formulae: ['"M,F"'] };
            worksheet.getCell('P' + i).dataValidation = { type: 'list', allowBlank: true, formulae: ['"본인,배우자,부모"'] };
            worksheet.getCell('V' + i).dataValidation = { type: 'list', allowBlank: true, formulae: ['"M,F"'] };
            worksheet.getCell('AB' + i).dataValidation = { type: 'list', allowBlank: true, formulae: ['"자가,임대,기타"'] };
            worksheet.getCell('AC' + i).dataValidation = { type: 'list', allowBlank: true, formulae: ['"기숙사,개인주택,숙박시설"'] };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        window.saveAs(new Blob([buffer]), "HD현대삼호_비자일괄처리_템플릿.xlsx");
        
    } catch (err) {
        showMsg('템플릿 오류', '템플릿을 생성하는 중 문제가 발생했습니다.', 'error');
    }
}

export async function processExcelBatch(inputEl) {
    if (inputEl.files.length === 0) return;
    
    if (!localStorage.getItem('visaPdfTemplate_main') || !localStorage.getItem('visaPdfTemplate_residence') || !localStorage.getItem('visaPdfTemplate_guarantee')) {
        showMsg('오류', '엑셀 일괄 생성을 위해서는 우측 상단 [설정]에서 3개의 PDF 양식 원본을 모두 등록해야 합니다.', 'error');
        inputEl.value = ''; 
        return;
    }

    const prog = document.getElementById('step-excel-progress');
    if (prog) prog.classList.remove('hidden');
    
    try {
        const file = inputEl.files[0];
        const arrayBuffer = await file.arrayBuffer();
        
        const workbook = new window.ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        
        if (!worksheet) throw new Error("엑셀 파일에 시트가 없습니다.");

        const headers = worksheet.getRow(1).values;
        const rows = [];
        
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; 
            
            const rowData = {};
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const header = headers[colNumber];
                if (!header) return;
                
                let val = cell.value;
                if (val instanceof Date) {
                    const y = val.getFullYear();
                    const m = String(val.getMonth() + 1).padStart(2, '0');
                    const d = String(val.getDate()).padStart(2, '0');
                    val = `${y}-${m}-${d}`;
                } else if (val && typeof val === 'object') {
                    val = val.text || val.result || '';
                }
                
                let strVal = val ? String(val).trim() : '';
                
                if (strVal && !strVal.includes('-')) {
                    let onlyNum = strVal.replace(/[^0-9]/g, '');
                    
                    if (header.includes('생년월일') || header.includes('발급일') || header.includes('만료일') || header.includes('시작일') || header.includes('종료일')) {
                        if (onlyNum.length === 8) {
                            strVal = onlyNum.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                        }
                    } else if (header.includes('등록번호') || header.includes('주민번호')) {
                        if (onlyNum.length === 13) {
                            strVal = onlyNum.replace(/(\d{6})(\d{7})/, '$1-$2');
                        }
                    } else if (header.includes('사업자번호')) {
                        if (onlyNum.length === 10) {
                            strVal = onlyNum.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
                        }
                    } else if ((header.includes('전화') || header.includes('휴대')) && !header.includes('본국')) {
                        if (!onlyNum.startsWith('0') && onlyNum.length >= 8 && onlyNum.length <= 10) {
                            if (!(onlyNum.length === 8 && ['15','16','18','19'].includes(onlyNum.substring(0,2)))) {
                                onlyNum = '0' + onlyNum;
                            }
                        }
                        
                        if (onlyNum.startsWith('02')) {
                            if (onlyNum.length === 9) strVal = onlyNum.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                            else if (onlyNum.length === 10) strVal = onlyNum.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                            else strVal = onlyNum;
                        } else if (onlyNum.length === 8 && !onlyNum.startsWith('0')) {
                            strVal = onlyNum.replace(/(\d{4})(\d{4})/, '$1-$2');
                        } else {
                            if (onlyNum.length === 10) strVal = onlyNum.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                            else if (onlyNum.length === 11) strVal = onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                            else strVal = onlyNum;
                        }
                    }
                }
                
                rowData[header] = strVal;
            });
            
            if (rowData['성(Surname)'] || rowData['명(Given Name)'] || rowData['외국인등록번호(13자리)']) {
                rows.push(rowData);
            }
        });
        
        if (rows.length === 0) throw new Error("엑셀 파일에 유효한 데이터가 없습니다.");

        const fontUrl = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumgothic/NanumGothic-Regular.ttf';
        const fontRes = await fetch(fontUrl);
        if (!fontRes.ok) throw new Error("폰트 다운로드 실패");
        const fontBuffer = await fontRes.arrayBuffer();
        
        const zip = new window.JSZip();
        const { PDFDocument, rgb } = window.PDFLib;

        const uiReq = document.querySelector('input[name="reqType"]:checked')?.value;
        const uiVisa = document.querySelector('input[name="visaType"]:checked')?.value;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            const mockGetVal = (id) => {
                const submitterMap = { "본인": "self", "배우자": "spouse", "부모": "parents" };
                const ownMap = { "자가": "own_self", "임대": "own_rent", "기타": "own_other" };
                const typeMap = { "기숙사": "type_dorm", "개인주택": "type_private", "숙박시설": "type_hotel" };

                const map = {
                    'visaType': uiVisa,
                    'reqType': uiReq,
                    'submitter': row['제출자'] ? submitterMap[row['제출자']] : undefined,
                    'r_own': row['숙소_소유형태'] ? ownMap[row['숙소_소유형태']] : undefined,
                    'r_type': row['숙소_주거형태'] ? typeMap[row['숙소_주거형태']] : undefined,
                    
                    'i_spouse': row['제출자'] === '배우자' ? row['대리인영문성명'] : undefined,
                    'i_parents': row['제출자'] === '부모' ? row['대리인영문성명'] : undefined,

                    'i_surname': row['성(Surname)'], 
                    'i_givenname': row['명(Given Name)'], 
                    'i_dob': row['생년월일(8자리숫자)'],
                    'i_gender': row['성별'], 
                    'i_nation': row['국적'], 
                    'i_arc': row['외국인등록번호(13자리)'], 
                    'i_passport': row['여권번호'],
                    'i_pass_issue': row['여권발급일(8자리숫자)'], 
                    'i_pass_exp': row['여권만료일(8자리숫자)'],
                    'i_address_kr': row['대한민국주소'], 
                    'i_cellphone': row['휴대전화'], 
                    'i_phone': row['일반전화'],
                    'i_address_home': row['본국주소'], 
                    'i_home_phone': row['본국전화번호'], 
                    'i_email': row['이메일'],
                    'i_cname': row['원근무처_명칭'], 
                    'i_cregno': row['원근무처_사업자번호(10자리)'], 
                    'i_rep_name': row['원근무처_대표자명'],
                    'i_rep_id': row['원근무처_대표자주민번호'], 
                    'i_rep_gender': row['원근무처_대표자성별'],
                    'i_caddr': row['원근무처_주소'], 
                    'i_cphone': row['원근무처_전화번호'],
                    'i_new_cname': row['예정근무처_명칭'], 
                    'i_new_cregno': row['예정근무처_사업자번호'], 
                    'i_new_cphone': row['예정근무처_전화번호'],
                    'i_dorm_start': row['숙소_제공시작일(8자리숫자)'], 
                    'i_job': row['직업'], 
                    'i_income': row['연소득(만원)'],
                    'i_reentry_period': row['재입국신청기간'], 
                    'i_refund_bank': row['환급은행'], 
                    'i_refund_acc': row['환급계좌번호'],
                    'i_guar_start': row['신원보증_시작일'],
                    'i_guar_end': row['신원보증_종료일']
                };
                
                if (map[id] !== undefined && map[id] !== null && map[id] !== '') return String(map[id]);
                return document.getElementById(id) ? document.getElementById(id).value : ''; 
            };

            const sName = mockGetVal('i_surname') || 'UNKNOWN';
            const gName = mockGetVal('i_givenname') || '';
            const name = `${sName}_${gName}`.toUpperCase().trim();
            
            const rowReq = mockGetVal('reqType');
            const rowVisa = mockGetVal('visaType');

            let needsMain = true;
            let needsRes = ['chk_extension', 'chk_change_work', 'chk_alien_reg'].includes(rowReq);
            let needsGuar = (rowVisa === 'E-7' && ['chk_extension', 'chk_change_status'].includes(rowReq));

            if (needsMain) {
                const blobMain = await createSingleDoc('main', fontBuffer, mockGetVal, PDFDocument, rgb);
                zip.file(`${name}_통합신청서.pdf`, blobMain);
            }
            if (needsRes) {
                const blobRes = await createSingleDoc('residence', fontBuffer, mockGetVal, PDFDocument, rgb);
                zip.file(`${name}_거주숙소제공서.pdf`, blobRes);
            }
            if (needsGuar) {
                const blobGuar = await createSingleDoc('guarantee', fontBuffer, mockGetVal, PDFDocument, rgb);
                zip.file(`${name}_신원보증서.pdf`, blobGuar);
            }
        }

        const zipBlob = await zip.generateAsync({type:"blob"});
        window.saveAs(zipBlob, `HD현대삼호_비자서류_총${rows.length}명.zip`);
        showMsg('일괄 생성 완료', `총 ${rows.length}명의 서류 생성이 완료되어 ZIP 파일로 다운로드되었습니다.`, 'success');

    } catch(e) {
        console.error(e); 
        showMsg('엑셀 처리 오류', e.message || '파일을 해독하는 중 문제가 발생했습니다.', 'error');
    } finally {
        if (prog) prog.classList.add('hidden');
        inputEl.value = '';
        closeExcelModal();
    }
}
