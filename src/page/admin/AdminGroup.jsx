import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminGroup() {
  const [groupData, setGroupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState({});
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "group_active_date",
    direction: "desc",
  });

  const [searchParams, setSearchParams] = useState({
    roomName: "",
    leader: "",
    status: "全部狀態",
  });

  useEffect(() => {
    const getGroupData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/groupsData`);
        setGroupData(res.data);
        setFilteredData(res.data);

        // 提取所有不重複的 user_id
        const userIds = [...new Set(res.data.map((item) => item.user_id))];
        console.log(userIds);

        try {
          // 平行發出所有請求
          const userPromises = userIds.map((id) =>
            axios.get(`${BASE_URL}/usersData/${id}`)
          );
          const userResponses = await Promise.all(userPromises);

          // 建立 id 到用戶資料的映射
          const userMap = {};
          userResponses.forEach((response) => {
            const userData = response.data;
            userMap[userData.id] = userData;
          });

          setUserData(userMap);
        } catch (error) {
          console.error("獲取用戶資料時出錯:", error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getGroupData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = groupData.filter((group) => {
      // 檢查密室名稱
      const nameMatch =
        searchParams.roomName === "" ||
        group.game_name
          .toLowerCase()
          .includes(searchParams.roomName.toLowerCase());

      // 檢查主糾人，需要通過 userData 來比較
      let leaderMatch = searchParams.leader === "";
      if (!leaderMatch && userData[group.user_id]) {
        leaderMatch = userData[group.user_id].user_name
          .toLowerCase()
          .includes(searchParams.leader.toLowerCase());
      }

      // 檢查狀態
      const statusValue = getGroupStatus(group); // 使用原有的函數獲取狀態文字
      const statusMatch =
        searchParams.status === "全部狀態" ||
        statusValue === searchParams.status;

      return nameMatch && leaderMatch && statusMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      roomName: "",
      leader: "",
      status: "全部狀態",
    });
    setFilteredData(groupData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "group_end_at" || key === "group_active_date") {
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
    <div className="admin-bg">
      <div className="adminUser container pt-11 pb-6">
        <nav
          style={{ "--bs-breadcrumb-divider": "'>'" }}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <span className="fs-Body-2 fw-bold text-nature-50">揪團資料</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-2">
            <label
              htmlFor="roomName"
              className="form-label fs-Caption text-black"
            >
              密室名稱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="roomName"
              placeholder="請輸入內容"
              value={searchParams.roomName}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-2">
            <label
              htmlFor="leader"
              className="form-label fs-Caption text-black"
            >
              主糾人
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="leader"
              placeholder="請輸入內容"
              value={searchParams.leader}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-2">
            <label
              htmlFor="status"
              className="form-label fs-Caption text-black"
            >
              狀態
            </label>
            <select
              className="form-select border-black"
              style={{
                color:
                  searchParams.status === "全部狀態" ? "#C6C6CA" : "inherit",
              }}
              id="status"
              value={searchParams.status}
              onChange={handleSearchChange}
            >
              <option value="全部狀態">全部狀態</option>
              <option value="揪團中">揪團中</option>
              <option value="揪團成功">揪團成功</option>
              <option value="已取消">已取消</option>
              <option value="已結束">已結束</option>
            </select>
          </div>
          <div className="col-1">
            <label className="form-label">&nbsp;</label>
            <button
              className="btn btn-primary-50 text-white form-control"
              onClick={handleSearch}
            >
              搜尋
            </button>
          </div>
          <div className="col-1">
            <label className="form-label">&nbsp;</label>
            <button
              className="btn btn-outline-secondary form-control"
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
                    onClick={() => handleSort("group_id")}
                  >
                    ID {getSortIcon("group_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("game_name")}
                  >
                    密室名稱 {getSortIcon("game_name")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("user_id")}
                  >
                    主糾人 {getSortIcon("user_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("group_member")}
                  >
                    總人數 {getSortIcon("group_member")}
                  </th>
                  <th className="px-4 py-3">
                    狀態 {getSortIcon("group_isSuccessful")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("group_end_at")}
                  >
                    揪團截止日期 {getSortIcon("group_end_at")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("group_active_date")}
                  >
                    活動日期 {getSortIcon("group_active_date")}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.group_id}>
                    <td className="py-2 px-4">{row.group_id}</td>
                    <td className="py-2 px-4">{row.game_name}</td>
                    <td className="py-2 px-4">
                      {userData[row.user_id]?.user_name || "未知用戶"}
                    </td>
                    <td className="py-2 px-4">{row.group_member}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-2 text-black ${getGroupStatusStyle(
                          row
                        )}`}
                      >
                        {getGroupStatus(row)}
                      </span>
                    </td>
                    <td className="py-2 px-4">{row.group_end_at}</td>
                    <td className="py-2 px-4">{row.group_active_date}</td>
                    <td className="py-2 px-4 text-end">
                      <button className="edit-btn">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const getGroupStatusStyle = (row) => {
  if (row.group_isEnd) return "bg-nature-90";

  if (row.group_cancel) return "bg-tertiary-90";

  if (row.group_isSuccessful) {
    return "bg-pass";
  } else {
    return "bg-secondary-90";
  }
};

const getGroupStatus = (row) => {
  if (row.group_isEnd) return "已結束";

  if (row.group_cancel) return "已取消";

  if (row.group_isSuccessful) {
    return "揪團成功";
  } else {
    return "揪團中";
  }
};

export default AdminGroup;
