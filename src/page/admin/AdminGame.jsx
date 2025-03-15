import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminGame() {
  const [gameData, setGameData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // 新增排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: "game_id",
    direction: "asc",
  });

  const [searchParams, setSearchParams] = useState({
    gameName: "",
    tag: "",
    status: "全部狀態",
  });

  useEffect(() => {
    const getGameData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/gamesData`);
        setGameData(res.data);
        setFilteredData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getGameData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = gameData.filter((game) => {
      // 檢查密室名稱
      const nameMatch =
        searchParams.gameName === "" ||
        game.game_name
          .toLowerCase()
          .includes(searchParams.gameName.toLowerCase());

      // 檢查標籤 - 這裡可能需要根據實際的標籤結構調整
      const tagMatch =
        searchParams.tag === "" ||
        game.game_dif_tagname
          .toLowerCase()
          .includes(searchParams.tag.toLowerCase()) ||
        game.game_main_tag1name
          .toLowerCase()
          .includes(searchParams.tag.toLowerCase()) ||
        game.game_main_tag2name
          .toLowerCase()
          .includes(searchParams.tag.toLowerCase());

      // 這裡假設有 game_status 欄位，實際上可能需要調整
      const statusMatch = searchParams.status === "全部狀態" || true; // 暫時略過

      return nameMatch && tagMatch && statusMatch;
    });

    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchParams({
      gameName: "",
      tag: "",
      status: "全部狀態",
    });
    setFilteredData(gameData);
  };

  // 排序
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "game_score" || key === "game_score_num") {
        // 數字比較
        const numA = parseFloat(a[key]);
        const numB = parseFloat(b[key]);

        if (direction === "asc") {
          return numA - numB;
        } else {
          return numB - numA;
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
              <span className="fs-Body-2 fw-bold text-nature-50">密室管理</span>
            </li>
          </ol>
        </nav>
        <div className="searchBar mt-5 mb-6 row">
          <div className="col-2">
            <label
              htmlFor="gameName"
              className="form-label fs-Caption text-black"
            >
              密室名稱
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="gameName"
              placeholder="請輸入內容"
              value={searchParams.gameName}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-2">
            <label htmlFor="tag" className="form-label fs-Caption text-black">
              標籤
            </label>
            <input
              type="text"
              className="form-control bg-transparent border-black"
              id="tag"
              placeholder="請輸入內容"
              value={searchParams.tag}
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
                  searchParams.status === "全部狀態" ? "#C6C6CA" : "inherit",
              }}
              id="status"
              value={searchParams.status}
              onChange={handleSearchChange}
            >
              <option value="全部狀態">全部狀態</option>
              <option value="processing">處理中</option>
              <option value="pass">通過</option>
              <option value="rejected">已退回</option>
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
                    onClick={() => handleSort("game_id")}
                  >
                    ID {getSortIcon("game_id")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("game_name")}
                  >
                    密室名稱 {getSortIcon("game_name")}
                  </th>
                  <th
                    className="px-4 py-3 text-center"
                    onClick={() => handleSort("game_score")}
                  >
                    評分 {getSortIcon("game_score")}
                  </th>
                  <th
                    className="px-4 py-3 text-center"
                    onClick={() => handleSort("game_score_num")}
                  >
                    評論人數 {getSortIcon("game_score_num")}
                  </th>
                  <th
                    className="px-4 py-3"
                    onClick={() => handleSort("game_dif_tagname")}
                  >
                    標籤 {getSortIcon("game_dif_tagname")}
                  </th>
                  <th className="px-4 py-3 text-center">狀態</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.game_id}>
                    <td className="py-2 px-4">{row.game_id}</td>
                    <td className="py-2 px-4">{row.game_name}</td>
                    <td className="py-2 px-4 text-center">{row.game_score}</td>
                    <td className="py-2 px-4 text-center">
                      {row.game_score_num}
                    </td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-1 rounded-2 text-black bg-nature-95">
                        {row.game_dif_tagname}
                      </span>
                      <span className="px-2 py-1 mx-2 rounded-2 text-black bg-nature-95">
                        {row.game_main_tag1name}
                      </span>
                      <span className="px-2 py-1 rounded-2 text-black bg-nature-95">
                        {row.game_main_tag2name}
                      </span>
                    </td>
                    {/* TODO 加上 上/下架 真實資料 */}
                    <td className="py-2 px-4 text-center">
                      <span className="px-2 py-1 rounded-2 text-black bg-pass">
                        上架
                      </span>
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

export default AdminGame;
