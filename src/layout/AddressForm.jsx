import axios from "axios";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const baseApi = import.meta.env.VITE_BASE_URL;

function AddressForm({ onChange, initialAddress = "" }) {
    // 🔹 解析初始地址（格式："台北市 信義區 信義路五段7號"）
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [address, setAddress] = useState("");
    const [cities, SetCities] = useState([]);

    const getCitys = async () => {
        try {
            const res = await axios.get(`${baseApi}/cities`);
            SetCities(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // 更新父元件的地址
    const handleChange = (newCity, newArea, newAddress) => {
        const fullAddress = `${newCity} ${newArea} ${newAddress}`.trim();
        onChange(fullAddress);
    };

    useEffect(() => {
        // 是否有傳入值
        if (initialAddress) {
            const [city, area, ...rest] = initialAddress.split(" ");
            setSelectedCity(city || "");
            setSelectedArea(area || "");
            setAddress(rest.join(" ") || "");
        }
    }, [initialAddress]);

    useEffect(() => {
        getCitys();
    }, []);

    return (
        <div className="row">
            {/* 縣市選擇 */}
            <div className="col-md-4">
                <label className="form-label fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">縣市</label>
                <select
                    className="form-select"
                    value={selectedCity}
                    onChange={(e) => {
                        const newCity = e.target.value;
                        setSelectedCity(newCity);
                        setSelectedArea(""); // 清空區域選擇
                        handleChange(newCity, "", address);
                    }}
                >
                    <option value="">請選擇縣市</option>
                    {cities.slice(1).map((city) => (
                        <option key={city.city_id} value={city.CityName}>{city.CityName}</option>
                    ))}
                </select>
            </div>

            {/* 區域選擇 */}
            <div className="col-md-4">
                <label className="form-label fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">區域</label>
                <select
                    className="form-select"
                    value={selectedArea}
                    onChange={(e) => {
                        const newArea = e.target.value;
                        setSelectedArea(newArea);
                        handleChange(selectedCity, newArea, address);
                    }}
                    disabled={!selectedCity} // 縣市未選擇時禁用
                >
                    <option value="">請選擇區域</option>
                    {selectedCity &&
                        cities.find((city) => city.CityName === selectedCity) // 注意：CityName 大寫
                            ?.AreaList.map((area) => ( // 改成 AreaList
                                <option key={area.ZipCode} value={area.AreaName}>
                                    {area.AreaName}
                                </option>
                            ))
                    }
                </select>
            </div>

            {/* 詳細地址輸入 */}
            <div className="col-md-4">
                <label className="form-label fs-Body-2 fs-sm-Body-1 mb-2 mb-sm-0">詳細地址</label>
                <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => {
                        const newAddress = e.target.value;
                        setAddress(newAddress);
                        handleChange(selectedCity, selectedArea, newAddress);
                    }}
                    placeholder="請輸入街道、門牌號碼"
                />
            </div>
        </div>
    );
}

export default AddressForm;

// PropTypes 驗證
AddressForm.propTypes = {
    onChange: PropTypes.func.isRequired, // 表示必填，且必須為函數
    initialAddress: PropTypes.string.isRequired, // 表示必填，且必須為字串
};
