import { useContext } from "react";
import { registerInfo } from "../page/Register";
import { useForm } from "react-hook-form";
import AddressForm from "./AddressForm";
import PropTypes from 'prop-types';


function RegisterThree({ userFormRef, storeFormRef, onSubmitUserSuccess, onSubmitStoreSuccess }) {
    const { userRegister, handleUserChange, handleStoreChange } = useContext(registerInfo);
    const role = userRegister.user_role;
    const { register: user, handleSubmit: handleSubmitUser, formState: { errors: userErrors } } = useForm();  // 處理user
    const { register: store, handleSubmit: handleSubmitStore, formState: { errors: storeErrors }, setValue, watch } = useForm();

    // 監聽 store_method 的值
    const watchMethod = watch("store_method");

    const onSubmitUser = handleSubmitUser((data) => {
        Object.entries(data).forEach(([key, value]) => {
            handleUserChange({ target: { name: String(key), value: String(value) } })
        });

        onSubmitUserSuccess();
    });

    const onSubmitStore = handleSubmitStore((data) => {
        Object.entries(data).forEach(([key, value]) => {
            handleStoreChange({ target: { name: String(key), value: String(value) } })
        });
        onSubmitStoreSuccess();
    });

    return (
        <>
            <div className="my-md-10 my-sm-3 my-5">
                <div className="container-lg">
                    <div className="role row d-flex flex-column flex-md-row g-5 justify-content-center align-items-center">
                        <p className="h2 text-center">
                            請填寫基本資訊 - 您選擇的身分是{role}
                        </p>
                        {role === '會員' ? (
                            <div className="col-lg-8 col-12">
                                <form className="text-start" onSubmit={onSubmitUser} id="userForm" ref={userFormRef}>
                                    {/* 姓名 */}
                                    <div className="row mb-3">
                                        <label htmlFor="user_name" className="col-sm-3 col-form-label formrequired">姓名</label>
                                        <div className="col-sm-9">
                                            <input
                                                {...user('user_name', {
                                                    required: "姓名欄位必填",
                                                })}
                                                type="text"
                                                className={`form-control ${userErrors.user_name && 'is-invalid'}`}
                                                id="user_name"
                                                name="user_name"
                                                placeholder="請輸入姓名或暱稱" />
                                            <div className="error-message text-danger mt-1">
                                                {userErrors.user_name ? userErrors.user_name.message : "　"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* 信箱 */}
                                    <div className="row mb-3">
                                        <label htmlFor="user_email" className="col-sm-3 col-form-label formrequired">信箱</label>
                                        <div className="col-sm-9">
                                            <input
                                                {...user('user_email', {
                                                    required: "",
                                                })}
                                                type="text"
                                                className="form-control"
                                                id="user_email"
                                                name="user_email"
                                                value={userRegister.user_email}
                                                disabled />
                                            <div className="error-message text-danger mt-1">
                                                {userErrors.user_email ? userErrors.user_email.message : "　"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* 密碼 */}
                                    <div className="row mb-3">
                                        <label htmlFor="user_password" className="col-sm-3 col-form-label formrequired">密碼</label>
                                        <div className="col-sm-9">
                                            <input
                                                {...user('user_password', {
                                                    required: "密碼欄位必填",
                                                    minLength: { value: 4, message: '密碼至少需要 4 個字元' }
                                                })}
                                                type="password"
                                                className={`form-control ${userErrors.user_password && 'is-invalid'}`}
                                                id="user_password"
                                                name="user_password"
                                                placeholder="請輸入密碼，最少4字元" />
                                            <div className="error-message text-danger mt-1">
                                                {userErrors.user_password ? userErrors.user_password.message : "　"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* 密碼*2 */}
                                    <div className="row mb-3">
                                        <label htmlFor="confirmPassword" className="col-sm-3 col-form-label formrequired">再次輸入密碼</label>
                                        <div className="col-sm-9">
                                            <input
                                                {...user('confirmPassword', {
                                                    required: '請確認密碼',
                                                    validate: (value) =>
                                                        value === document.getElementById('user_password').value || '兩次密碼不相符'
                                                })}
                                                type="password"
                                                className={`form-control ${userErrors.confirmPassword && 'is-invalid'}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="請輸入相同密碼" />
                                            <div className="error-message text-danger mt-1">
                                                {userErrors.confirmPassword ? userErrors.confirmPassword.message : "　"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* 性別 */}
                                    <div className="row mb-3">
                                        <label htmlFor="user_sex" className="col-sm-3 col-form-label formrequired">性別</label>
                                        <div className="col-sm-9">
                                            <select
                                                className={`form-select ${userErrors.user_sex && 'is-invalid'}`}
                                                aria-label="Default select example"
                                                {...user('user_sex', {
                                                    required: "性別欄位必填",
                                                    validate: (value) =>
                                                        value !== '請選擇性別' || "請選擇性別",
                                                })}>
                                                <option defaultValue value="請選擇性別">請選擇性別</option>
                                                <option value="男">男</option>
                                                <option value="女">女</option>
                                                <option value="不提供">不提供</option>
                                            </select>
                                            <div className="error-message text-danger mt-1">
                                                {userErrors.user_sex ? userErrors.user_sex.message : "　"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* 電話 */}
                                    <div className="row mb-3">
                                        <label htmlFor="user_tel" className="col-sm-3 col-form-label">電話</label>
                                        <div className="col-sm-9">
                                            <input
                                                {...user('user_tel', {
                                                    pattern: {
                                                        value: /^(0[2-8]-\d{7,8}|09\d{8})$/,
                                                        message: "市話格式為02-12345678手機格式為0912456789"
                                                    }
                                                })}
                                                type="tel"
                                                className={`form-control ${userErrors.user_tel && 'is-invalid'}`}
                                                id="user_tel"
                                                name="user_tel"
                                                placeholder="請輸入電話，選填" />
                                            <div className="error-message text-danger mt-1">
                                                {userErrors.user_tel ? userErrors.user_tel.message : "　"}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" id="userSumbit" style={{ display: "none" }}>隱藏送出</button>
                                </form>
                            </div>
                        )
                            : (
                                <div className="col-lg-8 col-12">
                                    <form className="text-start" onSubmit={onSubmitUser} id="userForm" ref={userFormRef}>
                                        {/* 店家名稱 */}
                                        <div className="row mb-3">
                                            <label htmlFor="user_name" className="col-sm-2 col-form-label formrequired">店家名稱</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...user('user_name', {
                                                        required: "店家名稱欄位必填",
                                                    })}
                                                    type="text"
                                                    className={`form-control ${userErrors.user_name && 'is-invalid'}`}
                                                    id="user_name"
                                                    name="user_name"
                                                    placeholder="請輸入與營登相符的名稱" />
                                                <div className="error-message text-danger mt-1">
                                                    {userErrors.user_name ? userErrors.user_name.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 信箱 */}
                                        <div className="row mb-3">
                                            <label htmlFor="user_email" className="col-sm-2 col-form-label formrequired">信箱</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...user('user_email', {
                                                        required: "",
                                                    })}
                                                    type="text"
                                                    className="form-control"
                                                    id="user_email"
                                                    name="user_email"
                                                    value={userRegister.user_email}
                                                    disabled />
                                                <div className="error-message text-danger mt-1">
                                                    {userErrors.user_email ? userErrors.user_email.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 密碼 */}
                                        <div className="row mb-3">
                                            <label htmlFor="user_password" className="col-sm-2 col-form-label formrequired">密碼</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...user('user_password', {
                                                        required: "密碼欄位必填",
                                                        minLength: { value: 4, message: '密碼至少需要 4 個字元' }
                                                    })}
                                                    type="password"
                                                    className={`form-control ${userErrors.user_password && 'is-invalid'}`}
                                                    id="user_password"
                                                    name="user_password"
                                                    placeholder="請輸入密碼，最少4字元" />
                                                <div className="error-message text-danger mt-1">
                                                    {userErrors.user_password ? userErrors.user_password.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 密碼*2 */}
                                        <div className="row mb-3">
                                            <label htmlFor="confirmPassword" className="col-sm-2 col-form-label formrequired">再次輸入密碼</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...user('confirmPassword', {
                                                        required: '請確認密碼',
                                                        validate: (value) =>
                                                            value === document.getElementById('user_password').value || '兩次密碼不相符'
                                                    })}
                                                    type="password"
                                                    className={`form-control ${userErrors.confirmPassword && 'is-invalid'}`}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    placeholder="請輸入相同密碼" />
                                                <div className="error-message text-danger mt-1">
                                                    {userErrors.confirmPassword ? userErrors.confirmPassword.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 電話 */}
                                        <div className="row mb-3">
                                            <label htmlFor="user_tel" className="col-sm-2 col-form-label formrequired">電話</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...user('user_tel', {
                                                        required: "電話欄位必填",
                                                        pattern: {
                                                            value: /^(0[2-8]-\d{7,8}|09\d{8})$/,
                                                            message: "市話格式為02-12345678手機格式為0912456789"
                                                        }
                                                    })}
                                                    type="text"
                                                    className={`form-control ${userErrors.user_tel && 'is-invalid'}`}
                                                    id="user_tel"
                                                    name="user_tel"
                                                    placeholder="請輸入聯絡人市話或手機電話" />
                                                <div className="error-message text-danger mt-1">
                                                    {userErrors.user_tel ? userErrors.user_tel.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" id="storeUserSumbit" style={{ display: "none" }}>隱藏送出</button>
                                    </form>
                                    <form className="text-start" onSubmit={onSubmitStore} id="storeForm" ref={storeFormRef}>
                                        <div className="row mb-3">
                                            <label htmlFor="store_self_address" className="col-sm-2 col-form-label formrequired">店家地址</label>
                                            <div className="col-sm-10">
                                                < AddressForm onChange={(fullAddress) => setValue("store_self_address", fullAddress)} />
                                                <input
                                                    {...store("store_self_address", {
                                                        required: "請填寫完整地址"
                                                    })}
                                                    type="text"
                                                    className={`form-control mt-2 ${storeErrors.store_self_address ? 'is-invalid' : ''}`}
                                                    id="store_self_address"
                                                    name="store_self_address"
                                                    placeholder="完整地址將自動填入"
                                                    readOnly // 這樣使用者無法手動修改
                                                />
                                                <div className="error-message text-danger mt-1">
                                                    {storeErrors.store_self_address ? storeErrors.store_self_address.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 聯絡人 */}
                                        <div className="row mb-3">
                                            <label htmlFor="store_contact" className="col-sm-2 col-form-label formrequired">聯絡人</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...store('store_contact', {
                                                        required: "聯絡人欄位必填",
                                                    })}
                                                    type="text"
                                                    className={`form-control ${storeErrors.store_contact && 'is-invalid'}`}
                                                    id="store_contact"
                                                    name="store_contact"
                                                    placeholder="請填入聯絡人，已便驗證所需使用" />
                                                <div className="error-message text-danger mt-1">
                                                    {storeErrors.store_contact ? storeErrors.store_contact.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 驗證方式 */}
                                        <div className="row mb-3">
                                            <label htmlFor="store_method" className="col-sm-2 col-form-label formrequired">驗證方式</label>
                                            <div className="col-sm-5">
                                                <select
                                                    className={`form-select ${storeErrors.store_method && 'is-invalid'}`}
                                                    aria-label="Default select example"
                                                    {...store('store_method', {
                                                        required: "驗證方式必選",
                                                        validate: (value) =>
                                                            value !== '請選擇驗證方式' || "請選擇驗證方式",
                                                    })}>
                                                    <option defaultValue value="請選擇驗證方式">請選擇驗證方式</option>
                                                    <option value="統一編號">有統一編號，請輸入統一編號</option>
                                                    <option value="其他">無統編，請提供其餘可證明資料</option>
                                                </select>
                                                <div className="error-message text-danger mt-1">
                                                    {storeErrors.store_method ? storeErrors.store_method.message : "　"}
                                                </div>
                                            </div>
                                            <div className="col-sm-5">
                                                {
                                                    (watchMethod === '請選擇驗證方式' || watchMethod === '' || watchMethod === undefined) && (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            disabled />
                                                    )
                                                }
                                                {watchMethod === '統一編號' && (
                                                    <input
                                                        {...store('store_tax_id', {
                                                            required: "統一編號欄位必填",
                                                            minLength: { value: 8, message: '統一編號格式錯誤' }
                                                        })}
                                                        type="text"
                                                        className={`form-control ${storeErrors.store_tax_id && 'is-invalid'}`}
                                                        id="store_tax_id"
                                                        name="store_tax_id"
                                                        placeholder="請填入公司統一編號" />
                                                )}
                                                {watchMethod === '其他' && (<input
                                                    {...store('store_documentation', {
                                                        required: "其餘證明文件欄位必填",
                                                    })}
                                                    type="url"
                                                    className={`form-control ${storeErrors.store_documentation && 'is-invalid'}`}
                                                    id="store_documentation"
                                                    name="store_documentation"
                                                    placeholder="請將其他證明文件上傳到雲端硬碟，並放上共用連結" />
                                                )}
                                                <div className="error-message text-danger mt-1">
                                                    {storeErrors.store_tax_id ? storeErrors.store_tax_id.message : "　"}
                                                    {storeErrors.store_documentation ? storeErrors.store_documentation.message : "　"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 官方網頁 */}
                                        <div className="row mb-3">
                                            <label htmlFor="store_website" className="col-sm-2 col-form-label formrequired">官方網頁</label>
                                            <div className="col-sm-10">
                                                <input
                                                    {...store('store_website', {
                                                        required: "官方網頁欄位必填",
                                                    })}
                                                    type="url"
                                                    className={`form-control ${storeErrors.store_website && 'is-invalid'}`}
                                                    id="store_website"
                                                    name="store_website"
                                                    placeholder="請填入官方聯絡網頁" />
                                                <div className="error-message text-danger mt-1">
                                                    {storeErrors.store_website ? storeErrors.store_website.message : "　"}
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" id="storeStoreSumbit" style={{ display: "none" }}>隱藏送出</button>
                                    </form>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    )
};

export default RegisterThree;

// PropTypes 驗證
RegisterThree.propTypes = {
    userFormRef: PropTypes.object.isRequired, // 驗證為物件
    storeFormRef: PropTypes.object.isRequired, // 驗證為物件
    onSubmitUserSuccess: PropTypes.func.isRequired, // 驗證為函數
    onSubmitStoreSuccess: PropTypes.func.isRequired, // 驗證為函數
};
