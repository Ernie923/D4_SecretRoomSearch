import axios from "axios";
import dayjs from "dayjs";
import { createContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pushMessage } from "../redux/slices/toastSlice";
import RegisterOne from "../layout/RegisterOne";
import RegisterTwo from "../layout/RegisterTwo";
import RegisterThree from "../layout/RegisterThree";
import Toast from "../layout/Toast";
export const registerInfo = createContext({});

const steps = [
    {
        step_id: 1,
        step_name: "選擇註冊身分"
    },
    {
        step_id: 2,
        step_name: "驗證信箱"
    },
    {
        step_id: 3,
        step_name: "填寫基本資料"
    }
];

const userRegisterinit = {
    user_id: 0,
    user_role: "",
    user_reg_method: "信箱",
    user_name: "",
    user_email: "",
    user_img: "",
    user_tel: "",
    user_sex: "",
    user_password: "",
    user_create_at: "",
    user_update_at: ""
};

const storeRegisterinit = {
    user_id: 0,
    store_contact: "",
    store_method: "",
    store_tax_id: "",
    store_isAuth: "processing",
    store_documentation: "",
    store_self_address: "",
    store_website: "",
    store_name: "",
    store_address: "",
    store_email: "",
    store_tel: "",
    store_open_time: "",
};


function Register() {
    const [currentStep, setCurrentStep] = useState(1); //目前第幾步
    const [userRegister, setUserRegister] = useState(userRegisterinit); //存user資料表
    const [storeRegister, setStoreRegister] = useState(storeRegisterinit); //存store資料表
    const [verification_code, setVerification_code] = useState(""); // 保留驗證碼使用
    const [isEmailAuth, setIsEmailAuth] = useState(false);  //確認信箱是否驗證過
    const [isSend, setIsSend] = useState(false); //是否已寄信
    const [isUserResgitor, setIsUserResgitor] = useState(false); //註冊會員表單是否成功
    const [isStoreResgitor, setIsStoreResgitor] = useState(false); //註冊店家表單是否成功
    const userFormRef = useRef(); // 取得第三步會員表單
    const storeFormRef = useRef(); // 取得第三步店家表單
    const navigate = useNavigate(); // 換頁
    const dispatch = useDispatch();

    // 監聽user相關的欄位變動
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserRegister((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // 監聽store相關的欄位變動
    const handleStoreChange = (e) => {
        const { name, value } = e.target;
        setStoreRegister((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // 下一步
    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    // 上一步
    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // 更新進度條寬度
    const progressWidth = ((currentStep - 1) / 2) * 100;

    // 最後註冊，有兩層post，先註冊register到user，再依據身分註冊post到store
    const registeFinal = async () => {
        let finalUser = userRegister;
        let finalStore = storeRegister;
        let user_id = 0;
        let user_role = "";
        try {
            const res = await axios.get(`https://new-json.onrender.com/usersData`);
            const users = res.data;
            let maxUserId = users.reduce((max, user) => user.user_id > max ? user.user_id : max, 0);
            maxUserId++;
            finalUser["user_id"] = maxUserId;
            finalUser["user_create_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
            const { confirmPassword, ...finalUserData } = finalUser;
            void confirmPassword; // 忽略此變數
            try {
                const res = await axios.post(`https://new-json.onrender.com/register`, finalUserData);
                user_role = res.data.user.user_role;
                user_id = res.data.user.user_id;
                if (user_role === '會員') {
                    const message = "註冊成功，\n\n歡迎加入密室搜搜，開啟你的冒險旅程！\n 探索各式各樣的主題，挑戰你的腦力極限。\n\n請重新登入，頁面自動跳轉中，請稍後"
                    dispatch(pushMessage({
                        text: message,
                        status: 'success'
                    }));
                    setTimeout(() => {
                        navigate(`/Login`);
                    }, 3000);
                }
            } catch (error) {
                const message = error.response.data;
                dispatch(pushMessage({
                    text: message,
                    status: 'failed'
                }));
            }
        } catch (error) {
            const message = error.response.data;
            dispatch(pushMessage({
                text: message,
                status: 'failed'
            }));
        }

        if (user_role === '店家') {
            finalStore["user_id"] = user_id;
            const { confirmPassword, ...finalStoreData } = finalStore;
            void confirmPassword; // 忽略此變數
            try {
                await axios.post(`https://new-json.onrender.com/storesData`, finalStoreData);
                const message = '註冊成功，歡迎成為密室搜搜的合作夥伴！\n盡情提供獨特的密室，吸引更多玩家，增加您的收益吧！\n\n請重新登入，頁面自動跳轉中，請稍後';
                dispatch(pushMessage({
                    text: message,
                    status: 'success'
                }));
                setTimeout(() => {
                    navigate(`/Login`);
                }, 5000);
            } catch (error) {
                const message = error.response.data;
                dispatch(pushMessage({
                    text: message,
                    status: 'failed'
                }));
            }
        };
    };

    // 當收到子元件成功送出的訊號時，設定旗標
    const handleSubmitUserSuccess = () => {
        setIsUserResgitor(true);
    };

    // 當收到子元件成功送出的訊號時，設定旗標
    const handleSubmitStoreSuccess = () => {
        setIsStoreResgitor(true);
    };

    // 當 isResgitor 變為 true 時，代表表單成功送出並更新了資料
    // 要確保兩個一起，再去呼叫registeFinal()不可以在handleSubmitSuccess就呼叫registeFinal()他還是會為舊的資料
    useEffect(() => {
        if (userRegister.user_role === '會員') {
            if (isUserResgitor) {
                registeFinal();
            }
        }
        else if (userRegister.user_role === '店家') {
            if (isUserResgitor && isStoreResgitor) {
                registeFinal();
            }
        }
        // 送出完成後可考慮重置 isResgitor 為 false
        setIsUserResgitor(false);
        setIsStoreResgitor(false)
    }, [isUserResgitor, userRegister, isStoreResgitor, storeRegister]);

    // 送出按鈕點擊時只負責觸發子元件的 submit，不直接設置旗標
    const handleFinalClick = () => {
        if (userRegister.user_role === '會員') {
            setTimeout(() => {
                if (userFormRef.current) {
                    const hiddenSubmitBtn = userFormRef.current.querySelector('#userSumbit');
                    if (hiddenSubmitBtn) {
                        hiddenSubmitBtn.click();  // 觸發子元件 form 的 onSubmit
                    }
                }
            }, 0);
        }
        else if (userRegister.user_role === '店家') {
            setTimeout(() => {
                if (storeFormRef.current && userFormRef.current) {
                    const hiddenSubmitUserBtn = userFormRef.current.querySelector('#storeUserSumbit');
                    const hiddenSubmiStoretBtn = storeFormRef.current.querySelector('#storeStoreSumbit');
                    if (hiddenSubmitUserBtn) {
                        hiddenSubmitUserBtn.click();  // 觸發子元件 form 的 onSubmit
                    }
                    if (hiddenSubmiStoretBtn) {
                        hiddenSubmiStoretBtn.click();  // 觸發子元件 form 的 onSubmit
                    }
                }
            }, 0);
        }
    };

    return (
        <div className="container text-center pt-10">
            <div className="progress-container ">
                {/* 進度條 */}
                <div className="progress-bar" style={{ width: `${progressWidth}%` }}></div>

                {/* 圓圈 */}
                {steps.map((step) => (
                    // <div className='d-flex flex-column justify-content-center align-items-center'>
                    <div
                        key={step.step_id}
                        className={`circle ${step.step_id <= currentStep ? 'active' : ''}`}
                    >
                        <p className='step_name'>{step.step_name}</p>
                        <span className="circle-number">{step.step_id}</span>
                    </div>
                    // </div>
                ))}
            </div>
            <registerInfo.Provider value={{ handleUserChange, handleStoreChange, userRegister, isEmailAuth, setIsEmailAuth, isSend, setIsSend, verification_code, setVerification_code }}>
                {currentStep === 1 && <RegisterOne />}
                {currentStep === 2 && <RegisterTwo />}
                {currentStep === 3 &&
                    <RegisterThree
                        userFormRef={userFormRef}
                        storeFormRef={storeFormRef}
                        onSubmitUserSuccess={handleSubmitUserSuccess}
                        onSubmitStoreSuccess={handleSubmitStoreSuccess}
                    />
                }
            </registerInfo.Provider>

            <div className="step my-3">
                {currentStep !== 1 ? (
                    <button
                        className="btn btn-outline-primary mx-2"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                    >
                        上一步
                    </button>
                ) : ""}
                {/* 按鈕 */}

                {currentStep === 3 ? (
                    <button
                        className="btn btn-primary mx-2"
                        onClick={handleFinalClick}
                    >
                        送出註冊
                    </button>
                ) : (
                    <button
                        className="btn btn-primary mx-2"
                        onClick={nextStep}
                        disabled={currentStep === 3 || (currentStep === 1 && userRegister.user_role === '') || (currentStep === 2 && !isEmailAuth)}
                    >
                        下一步
                    </button>
                )}
            </div>
            <Toast />

        </div>
    );
};

export default Register;