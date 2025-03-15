import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminStore() {
  const [storeData, setStoreData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "store_create_at",
    direction: "desc",
  });

  const [searchParams, setSearchParams] = useState({
    storeName: "",
    contact: "",
    status: "所有狀態",
  });

  // 新增 Modal 相關狀態
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // 處理開啟 Modal
  const handleShowModal = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  // 處理關閉 Modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getStoreData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/storesData`);
        setStoreData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getStoreData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = storeData.filter((store) => {
      const nameMatch =
        searchParams.storeName === "" ||
        store.store_name
          .toLowerCase()
          .includes(searchParams.storeName.toLowerCase());

      const contactMatch =
        searchParams.contact === "" ||
        store.store_contact
          .toLowerCase()
          .includes(searchParams.contact.toLowerCase());

      const statusMatch =
        searchParams.status === "所有狀態" ||
        store.store_isAuth === searchParams.status;

      return nameMatch && contactMatch && statusMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      storeName: "",
      contact: "",
      status: "所有狀態",
    });
    setFilteredData(storeData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "store_create_at") {
        // 將日期字符串轉換為日期對象進行比較
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);

        if (direction === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else {
        // 一般字符串比較
        if (direction === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      }
    });

    setFilteredData(sortedData);
  };

  // 獲取排序圖標
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <div></div>;
    }

    return sortConfig.direction === "asc" ? (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "18px", position: "absolute", padding: "3px 0" }}
      >
        arrow_upward
      </span>
    ) : (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "18px", position: "absolute", padding: "3px 0" }}
      >
        arrow_downward
      </span>
    );
  };

  return (
    <>
      <div className="admin-bg">
        <div className="adminUser container pt-11 pb-6">
          <nav
            style={{ "--bs-breadcrumb-divider": "'>'" }}
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <span className="fs-Body-2 fw-bold text-nature-50">
                  會員管理
                </span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <span className="fs-Body-2 fw-bold text-nature-70">店家</span>
              </li>
            </ol>
          </nav>
          <div className="searchBar mt-5 mb-6 row">
            <div className="col-2">
              <label
                htmlFor="storeName"
                className="form-label fs-Caption text-black"
              >
                工作室名稱
              </label>
              <input
                type="text"
                className="form-control bg-transparent border-black"
                id="storeName"
                placeholder="請輸入內容"
                value={searchParams.storeName}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-2">
              <label
                htmlFor="contact"
                className="form-label fs-Caption text-black"
              >
                聯絡人
              </label>
              <input
                type="text"
                className="form-control bg-transparent border-black"
                id="contact"
                placeholder="請輸入內容"
                value={searchParams.contact}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-2">
              <label
                htmlFor="status"
                className="form-label fs-Caption text-black"
              >
                審核狀態
              </label>
              <select
                className="form-select border-black"
                style={{
                  color:
                    searchParams.status === "所有狀態" ? "#C6C6CA" : "inherit",
                }}
                id="status"
                value={searchParams.status}
                onChange={handleSearchChange}
              >
                <option value="所有狀態">所有狀態</option>
                <option value="processing">處理中</option>
                <option value="pass">通過</option>
                <option value="rejected">已退回</option>
              </select>
            </div>
            <div className="col-1">
              <label className="form-label">&nbsp;</label>
              <button
                className="btn btn-search btn-primary-50 text-white form-control"
                onClick={handleSearch}
              >
                搜尋
              </button>
            </div>
            <div className="col-1">
              <label className="form-label">&nbsp;</label>
              <button
                className="btn btn-reset btn-outline-secondary form-control"
                onClick={handleReset}
              >
                重置
              </button>
            </div>
          </div>
          <div className="table-container bg-white border rounded-2 border-nature-90 p-6">
            <div className="table-scroll-container overflow-scroll">
              <table className="storeTable w-100">
                <thead>
                  <tr>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_id")}
                    >
                      ID {getSortIcon("store_id")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_name")}
                    >
                      店家名稱 {getSortIcon("store_name")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_contact")}
                    >
                      聯絡人 {getSortIcon("store_contact")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_self_tel")}
                    >
                      聯絡電話 {getSortIcon("store_self_tel")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_isAuth")}
                    >
                      審核狀態 {getSortIcon("store_isAuth")}
                    </th>
                    <th
                      className="px-4 py-3"
                      onClick={() => handleSort("store_create_at")}
                    >
                      建立時間 {getSortIcon("store_create_at")}
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.store_id}>
                        <td className="py-2 px-4">{row.store_id}</td>
                        <td className="py-2 px-4">{row.store_name}</td>
                        <td className="py-2 px-4">{row.store_contact}</td>
                        <td className="py-2 px-4">{row.store_self_tel}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded-2 text-black ${getStatusBadgeStyle(
                              row.store_isAuth
                            )}`}
                          >
                            {row.store_isAuth === "processing" ? "處理中" : ""}
                            {row.store_isAuth === "pass" ? "通過" : ""}
                            {row.store_isAuth === "rejected" ? "已退回" : ""}
                          </span>
                        </td>
                        <td className="py-2 px-4">{row.store_create_at}</td>
                        <td className="py-2 px-4 text-end">
                          <button
                            className="edit-btn"
                            onClick={() => handleShowModal(row)}
                          >
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        沒有符合的資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminStore;

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "processing":
      return "bg-secondary-95";
    case "pass":
      return "bg-pass";
    case "rejected":
      return "bg-tertiary-90";
  }
};
