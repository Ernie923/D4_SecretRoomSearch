import { useContext, useEffect, useRef, useState } from "react";
import { userStoreContext } from "../page/StoreProfile";
import { useForm } from "react-hook-form";
import { FaCheckDouble } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { IoInformationCircle } from "react-icons/io5";
import AddressForm from "../layout/AddressForm";
import dayjs from "dayjs";
import axios from "axios";
import { Modal } from "bootstrap";
import { useDispatch } from "react-redux";
import { getUserInfoAsyncThunk, updateUser } from "../redux/slices/userInfoSlice";
import { pushMessage } from "../redux/slices/toastSlice";
import Toast from "../layout/Toast";
const baseApi = import.meta.env.VITE_BASE_URL;

const BasicInfo = () => {
    const dispatch = useDispatch();
    const { user, store } = useContext(userStoreContext);
    const { register: storeData, handleSubmit: handleStoreData, formState: { errors: storeErrors }, setValue: setStoreValue } = useForm();
    const { register: storeUserData, handleSubmit: handleStoreUserData, formState: { errors: storeUserErrors }, setValue: setStoreUserValue, watch } = useForm();
    const watchMethod = watch("store_method");

    // modal ref
    const updatePawwordModalRef = useRef(null); //驗證密碼
    const updateInputPawwordModalRef = useRef(null); //修改密碼
    const authpasswordRef = useRef(null); //
    const inputpasswordRef = useRef(null); //
    const [passwordError, setPasswordError] = useState("尚未驗證");

    useEffect(() => {
        setStoreUserValue("store_method", storeUserFormData.store_method);
    }, [watchMethod])

    const [storeFormData, setStoreFormData] = useState({
        store_name: store.store_name,
        store_address: store.store_address,
        // store_open_time: store.store_open_time,
        store_email: store.store_email,
        store_tel: store.store_tel
    });

    const [storeUserFormData, setStoreUserFormData] = useState({
        user_name: user.user_name,
        user_email: user.user_email,
        user_tel: user.user_tel,
        store_self_address: store.store_self_address,
        store_contact: store.store_contact,
        store_method: store.store_method,
        store_tax_id: store.store_tax_id,
        store_documentation: store.store_documentation,
        store_website: store.store_website
    });

    const [isStoreFormChanged, setIsStoreFormChanged] = useState(false);
    const [isStoreUserFormChanged, setIsStoreUserFormChanged] = useState(false);

    // 基本資料的submit
    const onSubmitStoreUser = handleStoreUserData((data) => {
        const store_id = store.store_id;
        const user_id = user.user_id;

        const { userData, storeData } = Object.entries(data).reduce((acc, [key, value]) => {
            if (key.startsWith("user_")) {
                acc.userData[key] = value;
            } else if (key.startsWith("store_")) {
                acc.storeData[key] = value;
            }
            return acc;
        }, { userData: {}, storeData: {} });

        const updateStore = async (data) => {
            data["store_update_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
            try {
                await axios.patch(`${baseApi}/storesData/${store_id}`, data);
            } catch (error) {
                const message = error.response.data;
                dispatch(pushMessage({
                    text: message,
                    status: 'failed'
                }));
            }
        };

        const updateUser2 = async (data) => {
            data["user_update_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
            try {
                await axios.patch(`${baseApi}/usersData/${user_id}`, data);
                try {
                    const res = await axios.get(`${baseApi}/usersData/${user_id}`);
                    dispatch(updateUser(res.data));
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
        };

        if (isStoreUserFormChanged) {
            updateStore(storeData);
            updateUser2(userData);
            setStoreUserFormData(data);
            setIsStoreUserFormChanged(false);
        }

    });

    // 基本資料的input
    const handleInputStoreUser = (e) => {
        const { name, value } = e.target;
        if (name === 'store_method') {
            setStoreUserValue("store_method", value);
        }
        setStoreUserFormData((prevData) => {
            const updateStoreUser = {
                ...prevData,
                [name]: value
            }
            setIsStoreUserFormChanged(
                JSON.stringify(updateStoreUser) !== JSON.stringify(storeUserFormData)
            );
            return updateStoreUser;
        });
    };

    // 場館資料的submit
    const onSubmitStore = handleStoreData((data) => {
        const store_id = store.store_id;
        const updateStore = async (data) => {
            data["store_update_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
            try {
                await axios.patch(`${baseApi}/storesData/${store_id}`, data);
                setStoreFormData(data);
                setIsStoreFormChanged(false);
            } catch (error) {
                const message = error.response.data;
                dispatch(pushMessage({
                    text: message,
                    status: 'failed'
                }));
            }
        };
        if (isStoreFormChanged) {
            updateStore(data);
        }

    });

    // 場館資料的submit
    const handleInputStore = (e) => {
        const { name, value } = e.target;
        setStoreFormData((prevData) => {
            const updateStore = {
                ...prevData,
                [name]: value
            }
            setIsStoreFormChanged(
                JSON.stringify(updateStore) !== JSON.stringify(storeFormData)
            );
            return updateStore;
        });
    };

    // 驗證輸入的密碼前的密碼是否有正確
    const handleAuthPassword = async () => {
        const user_email = user.user_email;
        const user_password = authpasswordRef.current.value;
        const data = {
            user_email,
            user_password
        }
        const res = await dispatch(getUserInfoAsyncThunk(data));

        if (res.meta.requestStatus === 'fulfilled') {
            openupdateInputPawword();
            handleHideUpdatePasswordtModal();
            setPasswordError("請輸入新密碼");
            authpasswordRef.current.value = '';
        }
        else {
            setPasswordError(res.payload === '信箱及密碼需要輸入' || res.payload === '密碼請超過4碼' ? '請輸入密碼驗證或密碼未超過4碼' : res.payload);
        }

    };

    // 驗證輸入的密碼是否有錯誤
    const handleNewInputPassword = async () => {
        const user_password = inputpasswordRef.current.value;
        const data = {
            user_password
        }
        const user_id = user.user_id;
        data["user_update_at"] = dayjs().format("YYYY-MM-DD HH:mm:ss");
        try {
            await axios.patch(`${baseApi}/usersData/${user_id}`, data);
            dispatch(pushMessage({
                text: '修改密碼成功\n請下次登入使用新密碼',
                status: 'success'
            }));

            setPasswordError("尚未驗證");
            inputpasswordRef.current.value = '';

            // 延遲關閉 Modal，確保訊息顯示
            setTimeout(() => {
                handleHideupdateInputPawwordtModal();
            }, 1000);  // 0.5 秒後關閉
        } catch (error) {
            dispatch(pushMessage({
                text: error,
                status: 'error'
            }));
        }

    };

    // 顯示Modal - 刪除
    const openUpdatePassword = () => {
        const modalInstance = Modal.getInstance(updatePawwordModalRef.current);
        modalInstance.show();
    };

    // 隱藏Modal - 刪除
    const handleHideUpdatePasswordtModal = () => {
        const modalInstance = Modal.getInstance(updatePawwordModalRef.current);
        modalInstance.hide();
    };

    // 顯示Modal - 刪除
    const openupdateInputPawword = () => {
        const modalInstance = Modal.getInstance(updateInputPawwordModalRef.current);
        modalInstance.show();
    };

    // 隱藏Modal - 刪除
    const handleHideupdateInputPawwordtModal = () => {
        const modalInstance = Modal.getInstance(updateInputPawwordModalRef.current);
        modalInstance.hide();
    };

    useEffect(() => {
        new Modal(updatePawwordModalRef.current, {
            backdrop: false
        }); //從boostrap裡面來的

        new Modal(updateInputPawwordModalRef.current, {
            backdrop: false
        }); //從boostrap裡面來的
    }, []);

    return (
        <>
            {/* 基本資料 */}
            <div className="col-12 col-lg-8 m-0 py-sm-10 px-0 ">
                <div className="border-nature-90 border rounded-2">
                    <div className="BasicStoreInfoTitle fs-h6 lh-sm bg-secondary-95 fw-bold px-5 py-5 text-secondary-50" >
                        基本資料
                    </div>
                    <div className="user-info bg-white ">
                        <div className="user_name d-flex px-6 py-sm-5 py-4 align-items-center border-nature-90 border-1 border-top border-bottom" >
                            <img
                                src={store.store_isAuth === 'processing' ? './icon/processingStore.png' : store.store_isAuth === 'pass' ? './icon/passStore.png' : './icon/rejectedStore.png'}
                                alt={user.user_name}
                                className="rounded-circle"
                                style={{
                                    width: "10%",
                                    objectFit: "cover",
                                    aspectRatio: "1/1",
                                }}
                            />
                            <p className="ps-5 fw-bold fs-h6">
                                {user.user_name}
                                <span className="fs-Body-2 fs-lg-h6">
                                    {store.store_isAuth === 'processing' ?
                                        (<span className="text-secondary-40"><IoInformationCircle className="ms-3 me-1" /> 發布遊戲資格審核中</span>) :
                                        store.store_isAuth === 'pass' ?
                                            (<span className="text-success"><FaCheckDouble className="ms-3 me-1" /> 審核成功，可新增遊戲</span>) :
                                            (<span className="text-danger"><VscError className="ms-3 me-1" /> 資格審核失敗，請再次確認相關資訊，才可發布遊戲</span>)
                                    }
                                </span>
                            </p>
                        </div>
                        {/* 表單 */}
                        <div className="user_information p-6 ">
                            <form className="text-start" onSubmit={onSubmitStoreUser} id="storeUserData">
                                {/* 店家名稱 */}
                                <div className="row mb-1">
                                    <label htmlFor="user_name" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">店家名稱</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeUserData('user_name', { required: "店家名稱欄位必填" })}
                                            type="text"
                                            className={`form-control ${storeUserErrors.user_name && 'is-invalid'}`}
                                            id="user_name"
                                            name="user_name"
                                            placeholder="請輸入店家名稱"
                                            value={storeUserFormData.user_name}
                                            onChange={handleInputStoreUser}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeUserErrors.user_name ? storeUserErrors.user_name.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 聯絡信箱  */}
                                <div className="row mb-1">
                                    <label htmlFor="user_email" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">登入信箱</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeUserData('user_email', {
                                                required: "信箱欄位必填",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: "請輸入有效的 Email 格式，如 example@mail.com"
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${storeUserErrors.user_email && 'is-invalid'}`}
                                            id="user_email"
                                            name="user_email"
                                            placeholder="請輸入聯絡信箱"
                                            value={storeUserFormData.user_email}
                                            onChange={handleInputStoreUser}
                                        />
                                        <button className="text-secondary-50 bg-transparent border-0 border-bottom pt-1 " onClick={openUpdatePassword}>修改密碼</button>
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeUserErrors.user_email ? storeUserErrors.user_email.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 電話 */}
                                <div className="row mb-1">
                                    <label htmlFor="user_tel" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">聯絡人電話</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeUserData('user_tel', {
                                                required: "電話欄位必填",
                                                pattern: {
                                                    value: /^(0[2-8]-\d{7,8}|09\d{8})$/,
                                                    message: "市話格式為02-12345678手機格式為0912456789"
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${storeUserErrors.user_tel && 'is-invalid'}`}
                                            id="user_tel"
                                            name="user_tel"
                                            placeholder="請輸入電話"
                                            value={storeUserFormData.user_tel}
                                            onChange={handleInputStoreUser}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeUserErrors.user_tel ? storeUserErrors.user_tel.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 聯絡人  */}
                                <div className="row mb-1">
                                    <label htmlFor="store_contact" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">聯絡人</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeUserData('store_contact', {
                                                required: "聯絡人欄位必填"
                                            })}
                                            type="text"
                                            className={`form-control ${storeUserErrors.store_contact && 'is-invalid'}`}
                                            id="store_contact"
                                            name="store_contact"
                                            placeholder="請輸入聯絡信箱"
                                            value={storeUserFormData.store_contact}
                                            onChange={handleInputStoreUser}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeUserErrors.store_contact ? storeUserErrors.store_contact.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 店家地址 */}
                                <div className="row mb-1">
                                    <label htmlFor="store_self_address" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">公司地址</label>
                                    <div className="col-sm-10">
                                        < AddressForm onChange={(fullAddress) => {
                                            setStoreUserValue("store_self_address", fullAddress);
                                            handleInputStoreUser({ target: { name: "store_self_address", value: fullAddress } });
                                        }}
                                            initialAddress={store.store_self_address} />
                                        <label className="mt-1 mb-0">以下為完整地址自動帶入，無法修改</label>
                                        <input
                                            {...storeUserData("store_self_address", {
                                                required: "請填寫完整地址"
                                            })}
                                            type="text"
                                            className={`form-control mt-2 ${storeUserErrors.store_self_address ? 'is-invalid' : ''}`}
                                            id="store_self_address"
                                            name="store_self_address"
                                            placeholder="完整地址將自動填入"
                                            value={storeUserFormData.store_self_address}
                                            readOnly
                                        />
                                        <div className="error-message text-danger mt-1">
                                            {storeUserErrors.store_self_address ? storeUserErrors.store_self_address.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 驗證方式 */}
                                <div className="row mb-3">
                                    <label htmlFor="store_method" className="col-sm-2 col-form-label fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">驗證方式</label>
                                    <div className="col-sm-5">
                                        <select
                                            className={`form-select ${storeUserErrors.store_method && 'is-invalid'}`}
                                            aria-label="Default select example"
                                            {...storeUserData('store_method', {
                                                required: "驗證方式必選",
                                                validate: (value) =>
                                                    value !== '請選擇驗證方式' || "請選擇驗證方式",
                                            })}
                                            value={storeUserFormData.store_method}
                                            onChange={handleInputStoreUser} >
                                            <option defaultValue value="請選擇驗證方式">請選擇驗證方式</option>
                                            <option value="統一編號">有統一編號，請輸入統一編號</option>
                                            <option value="其他">無統編，請提供其餘可證明資料</option>
                                        </select>
                                        <div className="error-message text-danger mt-1">
                                            {storeUserErrors.store_method ? storeUserErrors.store_method.message : "　"}
                                        </div>
                                    </div>
                                    <div className="col-sm-5">
                                        {watchMethod &&
                                            (watchMethod === '請選擇驗證方式' || watchMethod === '' || watchMethod === undefined) && (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    disabled />
                                            )
                                        }
                                        {watchMethod && watchMethod === '統一編號' && (
                                            <input
                                                {...storeUserData('store_tax_id', {
                                                    required: "統一編號欄位必填",
                                                    minLength: { value: 8, message: '統一編號格式錯誤' }
                                                })}
                                                type="text"
                                                className={`form-control ${storeUserErrors.store_tax_id && 'is-invalid'}`}
                                                id="store_tax_id"
                                                name="store_tax_id"
                                                placeholder="請填入公司統一編號"
                                                value={storeUserFormData.store_tax_id}
                                                onChange={handleInputStoreUser} />
                                        )}
                                        {watchMethod && watchMethod === '其他' && (<input
                                            {...storeUserData('store_documentation', {
                                                required: "其餘證明文件欄位必填",
                                            })}
                                            type="url"
                                            className={`form-control ${storeUserErrors.store_documentation && 'is-invalid'}`}
                                            id="store_documentation"
                                            name="store_documentation"
                                            placeholder="請將其他證明文件上傳到雲端硬碟，並放上共用連結"
                                            value={storeUserFormData.store_documentation}
                                            onChange={(handleInputStoreUser)} />
                                        )}
                                        <div className="error-message text-danger mt-1">
                                            {storeUserErrors.store_tax_id ? storeUserErrors.store_tax_id.message : "　"}
                                            {storeUserErrors.store_documentation ? storeUserErrors.store_documentation.message : "　"}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* 按鈕區 */}
                        <div className="ps-6 py-4 border-nature-90 border-1 border-top">
                            <div className="btn_2 d-flex  text-center ">
                                <button
                                    type="reset"
                                    className="btn bg-nature-60 text-white me-6"
                                    disabled={!isStoreUserFormChanged}
                                    form="storeUserData">
                                    取消更改
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-secondary-60 text-white"
                                    form="storeUserData"
                                    disabled={!isStoreUserFormChanged}  // 根據表單是否更動來決定按鈕是否可點擊
                                >
                                    儲存變更
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Toast />
            </div>
            {/* 場館資料 */}
            <div className="col-12  col-lg-8  m-0 px-0 mt-5 mb-10 mt-sm-0">
                <div className="border-nature-90 border rounded-2">
                    <div className="BasicStoreInfoTitle fs-h6 lh-sm bg-secondary-95 fw-bold px-5 py-5 text-secondary-50" >
                        場館資料(以下為提供給訪客的資訊)
                        <p className="fs-Body-1 mt-1 text-black fw-normal"><span className="text-danger">*</span> 代表可在不同密室上進行更改</p>
                    </div>
                    <div className="user-info bg-white ">
                        {/* 表單 */}
                        <div className="user_information p-6 ">
                            <form className="text-start" onSubmit={onSubmitStore} id="storeData">
                                {/* 店家名稱 */}
                                <div className="row mb-1">
                                    <label htmlFor="store_name" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">店家名稱</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeData('store_name', { required: "店家名稱欄位必填" })}
                                            type="text"
                                            className={`form-control ${storeErrors.store_name && 'is-invalid'}`}
                                            id="store_name"
                                            name="store_name"
                                            placeholder="請輸入店家名稱"
                                            value={storeFormData.store_name}
                                            onChange={handleInputStore}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeErrors.store_name ? storeErrors.store_name.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 店家地址 */}
                                <div className="row mb-1">
                                    <label htmlFor="store_address" className="col-sm-2 formrequired fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">店家地址</label>
                                    <div className="col-sm-10">
                                        < AddressForm onChange={(fullAddress) => {
                                            setStoreValue("store_address", fullAddress);
                                            handleInputStore({ target: { name: "store_address", value: fullAddress } });
                                        }}
                                            initialAddress={store.store_address} />
                                        <label className="mt-1 mb-0">以下為完整地址自動帶入，無法修改</label>
                                        <input
                                            {...storeData("store_address", {
                                                required: "請填寫完整地址"
                                            })}
                                            type="text"
                                            className={`form-control mt-2 ${storeErrors.store_address ? 'is-invalid' : ''}`}
                                            id="store_address"
                                            name="store_address"
                                            placeholder="完整地址將自動填入"
                                            value={storeFormData.store_address}
                                            readOnly

                                        />
                                        <div className="error-message text-danger mt-1">
                                            {storeErrors.store_address ? storeErrors.store_address.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 聯絡信箱  */}
                                <div className="row mb-1">
                                    <label htmlFor="store_email" className="col-sm-2 fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">聯絡信箱</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeData('store_email', {
                                                required: "聯絡信箱欄位必填",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: "請輸入有效的 Email 格式，如 example@mail.com"
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${storeErrors.store_email && 'is-invalid'}`}
                                            id="store_email"
                                            name="store_email"
                                            placeholder="請輸入聯絡信箱"
                                            value={storeFormData.store_email}
                                            onChange={handleInputStore}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeErrors.store_email ? storeErrors.store_email.message : "　"}
                                        </div>
                                    </div>
                                </div>
                                {/* 電話 */}
                                <div className="row mb-1">
                                    <label htmlFor="store_tel" className="col-sm-2">電話</label>
                                    <div className="col-sm-10">
                                        <input
                                            {...storeData('store_tel', {
                                                required: "電話欄位必填",
                                                pattern: {
                                                    value: /^(0[2-8]-\d{7,8}|09\d{8})$/,
                                                    message: "市話格式為02-12345678手機格式為0912456789"
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${storeErrors.store_tel && 'is-invalid'}`}
                                            id="store_tel"
                                            name="store_tel"
                                            placeholder="請輸入電話"
                                            value={storeFormData.store_tel}
                                            onChange={handleInputStore}
                                        />
                                        <div className="error-message text-danger mt-1 fs-caption lh-1">
                                            {storeErrors.store_tel ? storeErrors.store_tel.message : "　"}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* 按鈕區 */}
                        <div className="ps-6 py-4 border-nature-90 border-1 border-top">
                            <div className="btn_2 d-flex  text-center ">
                                <button
                                    type="reset"
                                    className="btn bg-nature-60 text-white me-6"
                                    disabled={!isStoreFormChanged}
                                    form="storeData">
                                    取消更改
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-secondary-60 text-white"
                                    form="storeData"
                                    disabled={!isStoreFormChanged}  // 根據表單是否更動來決定按鈕是否可點擊
                                >
                                    儲存變更
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 驗證密碼MODAL */}
            <div
                ref={updatePawwordModalRef}
                className="modal fade m-0"
                id="updatePawwordModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-secondary-95 flex-column align-items-start">
                            <h4 className="modal-title fw-bold mb-2">修改密碼</h4>
                            <p>請先輸入目前密碼進行驗證</p>
                        </div>
                        <div className="modal-body px-5 py-10">
                            <input type="password" className="w-100 border border-1 border-black rounded-1 " ref={authpasswordRef} />
                            <div className={`error-message ${passwordError === '尚未驗證' ? 'text-secondary-40' : 'text-danger'}  mt-1 fs-caption lh-1`}>
                                {passwordError}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="btn_2 d-flex  text-center ">
                                <button type="button" className="btn bg-nature-60 text-white me-6" onClick={handleHideUpdatePasswordtModal}>
                                    取消更改
                                </button>
                                <button type="button" className="btn bg-secondary-60 text-white" onClick={handleAuthPassword}>
                                    下一步
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {/* 修改密碼MODAL */}
            < div
                ref={updateInputPawwordModalRef}
                className="modal fade m-0"
                id="updatePawwordModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }
                }
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-secondary-95">
                            <h4 className="modal-title fw-bold ">修改密碼</h4>
                        </div>
                        <div className="modal-body px-6 py-10">
                            <input type="password" className="w-100 border border-1 border-black rounded-1 " ref={inputpasswordRef} />
                            <div className={`error-message ${passwordError === '尚未驗證' ? 'text-secondary-40' : 'text-danger'}  mt-1 fs-caption lh-1`}>
                                {passwordError}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="btn_2 d-flex  text-center ">
                                <button type="button" className="btn bg-nature-60 text-white me-6" onClick={handleHideupdateInputPawwordtModal}>
                                    取消更改
                                </button>
                                <button type="button" className="btn bg-secondary-60 text-white" onClick={handleNewInputPassword}                                >
                                    儲存變更
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
};

export default BasicInfo;