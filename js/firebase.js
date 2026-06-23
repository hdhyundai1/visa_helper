import { initializeApp } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js)";
import { getAuth, signInAnonymously, onAuthStateChanged } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js)";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js)";
import { CONFIG } from './config.js';
import { encryptData, decryptData } from './utils.js';
import { showConfirm, showMsg, closeDBModal } from './ui.js';

let app, auth, db;
export let currentUser = null;

try {
    app = initializeApp(CONFIG.firebase);
    auth = getAuth(app);
    db = getFirestore(app);

    signInAnonymously(auth).catch(e => console.error("Firebase Auth Error", e));

    onAuthStateChanged(auth, (u) => {
        currentUser = u;
        if (u) {
            console.log("🔒 클라우드 연결 및 보안 인증 완료");
        }
    });
} catch(e) {
    console.error("Firebase init failed", e);
}

export async function saveToEmployeeDB() {
    if (!currentUser) return;
    const arc = document.getElementById('i_arc')?.value; 
    const surname = document.getElementById('i_surname')?.value;
    if (!arc || !surname) return; 
    
    const data = {};
    document.querySelectorAll('.input-field').forEach(el => { 
        if(el.id) data[el.id] = el.value; 
    });
    document.querySelectorAll('.custom-radio').forEach(el => { 
        if(el.checked) { 
            if(el.name) data[el.name] = el.value; 
        }
    });
    data.lastUpdated = new Date().toISOString().split('T')[0];

    if (data.i_arc) data.i_arc = await encryptData(data.i_arc);
    if (data.i_passport) data.i_passport = await encryptData(data.i_passport);
    if (data.i_cellphone) data.i_cellphone = await encryptData(data.i_cellphone);
    
    try {
        const docRef = doc(db, 'artifacts', CONFIG.appId, 'users', currentUser.uid, 'employees', arc.replace(/[^a-zA-Z0-9]/g, ''));
        await setDoc(docRef, data);
    } catch(e) { console.warn("Firestore 저장 실패", e); }
}

export async function renderDBList() {
    const list = document.getElementById('db-list');
    const search = document.getElementById('db-search').value.toLowerCase();
    list.innerHTML = '<li class="p-4 text-center text-sm text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i> 클라우드에서 불러오는 중...</li>'; 
    
    let employeeList = [];
    try {
        const colRef = collection(db, 'artifacts', CONFIG.appId, 'users', currentUser.uid, 'employees');
        const snapshot = await getDocs(colRef);
        snapshot.forEach(docSnap => {
            employeeList.push(docSnap.data());
        });

        list.innerHTML = '';
        if (employeeList.length === 0) { 
            list.innerHTML = '<li class="p-4 text-center text-sm text-slate-400">저장된 직원이 없습니다.</li>'; 
            return; 
        }

        for (let i = 0; i < employeeList.length; i++) {
            const emp = employeeList[i];
            if (emp.i_arc) emp._decryptedArc = await decryptData(emp.i_arc);
            if (emp.i_passport) emp._decryptedPassport = await decryptData(emp.i_passport);
        }
        
        const filtered = employeeList.filter(e => {
            const name = `${e.i_surname} ${e.i_givenname}`.toLowerCase();
            return name.includes(search) || (e._decryptedArc && e._decryptedArc.includes(search));
        });
        
        filtered.forEach(emp => {
            const li = document.createElement('li');
            li.className = 'p-3 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer';
            const displayArc = emp._decryptedArc || '번호없음';
            const dbId = emp.i_arc; 
            
            li.innerHTML = `
                <div onclick="window.loadEmployeeData('${dbId}')" class="flex-1">
                    <div class="font-bold text-slate-800 text-sm uppercase">${emp.i_surname} ${emp.i_givenname}</div>
                    <div class="text-xs text-slate-500 mt-1"><i class="fa-regular fa-id-card mr-1"></i>${displayArc} <span class="mx-2">|</span> <i class="fa-solid fa-clock-rotate-left mr-1"></i>${emp.lastUpdated}</div>
                </div>
                <button onclick="window.deleteEmployee('${dbId}')" class="p-2 text-slate-300 hover:text-rose-500 transition"><i class="fa-solid fa-trash-can"></i></button>
            `;
            list.appendChild(li);
        });
    } catch(e) {
        list.innerHTML = '<li class="p-4 text-center text-sm text-rose-400">명부를 불러오는데 실패했습니다.</li>'; 
    }
}

export async function loadEmployeeData(dbId) {
    try {
        let emp = null;
        const colRef = collection(db, 'artifacts', CONFIG.appId, 'users', currentUser.uid, 'employees');
        const snapshot = await getDocs(colRef);
        snapshot.forEach(docSnap => {
            if (docSnap.data().i_arc === dbId) emp = docSnap.data();
        });
        
        if (!emp) return;
        
        if (emp.i_arc) emp.i_arc = await decryptData(emp.i_arc);
        if (emp.i_passport) emp.i_passport = await decryptData(emp.i_passport);
        if (emp.i_cellphone) emp.i_cellphone = await decryptData(emp.i_cellphone);
        
        Object.keys(emp).forEach(key => {
            const el = document.getElementById(key);
            if (el) { 
                el.value = emp[key]; 
            } else {
                const radios = document.getElementsByName(key);
                if (radios) { 
                    radios.forEach(r => { 
                        if(r.value === emp[key]) r.checked = true; 
                    }); 
                }
            }
        });
        
        closeDBModal(); 
        if(window.handleModeChange) window.handleModeChange(); 
        if(window.saveFormData) window.saveFormData(); 
        if(window.clearHighlights) window.clearHighlights();
        showMsg('불러오기 완료', `${emp.i_surname} 직원의 정보를 클라우드에서 성공적으로 불러왔습니다.`, 'success');
    } catch (e) {
        showMsg('오류', `정보를 불러올 수 없습니다.`, 'error');
    }
}

export async function deleteEmployee(dbId) {
    showConfirm('직원 삭제', '이 직원의 기록을 클라우드 명부에서 영구 삭제하시겠습니까?', async () => {
        try {
            const colRef = collection(db, 'artifacts', CONFIG.appId, 'users', currentUser.uid, 'employees');
            const snapshot = await getDocs(colRef);
            let docIdToDelete = null;
            snapshot.forEach(docSnap => {
                if (docSnap.data().i_arc === dbId) docIdToDelete = docSnap.id;
            });
            if (docIdToDelete) {
                await deleteDoc(doc(db, 'artifacts', CONFIG.appId, 'users', currentUser.uid, 'employees', docIdToDelete));
            }
            renderDBList();
        } catch(e) {
            showMsg('오류', `삭제에 실패했습니다.`, 'error');
        }
    });
}
