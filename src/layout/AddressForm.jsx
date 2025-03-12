import axios from "axios";
import { useState, useEffect } from "react";

const cities = {
    "台北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
    "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區", "汐止區", "林口區", "蘆洲區", "五股區", "泰山區", "八里區"],
    "桃園市": ["桃園區", "中壢區", "平鎮區", "八德區", "楊梅區", "蘆竹區", "大溪區", "龍潭區", "龜山區"]
};

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
                <label className="form-label">縣市</label>
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
                <label className="form-label">區域</label>
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
                <label className="form-label">詳細地址</label>
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
