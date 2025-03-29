import PropTypes from "prop-types";

const SearchForm = ({
    search,
    handleInputChange,
    handleSearch,
    handleReset,
    area,
    difficultys,
    propertys,
    maxPeople,
}) => {
    return (
        <div className="col-md-3 pe-lg-6 pe-md-3">
            <form className="p-4 bg-white" onSubmit={(e) => handleSearch(e)}>
                <div className="order">
                    <p className="h5 pb-3 fw-bold">排序條件</p>
                    <div className="mb-6">
                        <div className="form-check form-check-inline">
                            <input
                                onChange={handleInputChange}
                                className="form-check-input"
                                defaultChecked={true}
                                type="radio"
                                name="order"
                                id="order_price"
                                value="order_price"
                            />
                            <label className="form-check-label" htmlFor="order_price">
                                價格(由高到低)
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                onChange={handleInputChange}
                                className="form-check-input"
                                type="radio"
                                name="order"
                                id="order_popularity"
                                value="order_popularity"
                            />
                            <label className="form-check-label" htmlFor="order_popularity">
                                人氣
                            </label>
                        </div>
                    </div>
                </div>
                <div className="search">
                    <p className="h5 pb-3 fw-bold">遊戲名稱</p>
                    <div className="search-all-group mb-6">
                        <label htmlFor="game_name" className="pb-1">
                            搜尋
                        </label>
                        <div className="input-group search-group border rounded-1 border-primary-black">
                            <input
                                onChange={handleInputChange}
                                type="text"
                                className="form-control border-0 search-input"
                                placeholder="搜尋關鍵字"
                                aria-label="Search"
                                name="game_name"
                                id="game_name"
                                value={search.game_name}
                            />
                            <span className="input-group-text search-input border-0">
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                {/* 地區、人數 */}
                <div className="d-flex w-100">
                    <div className="row w-100 row1 flex-md-column">
                        <div className="col-6 col-md-12 col1">
                            <div className="area">
                                <p className="h5 pb-4 fw-bold">遊戲地區</p>
                                {/* 手機板下拉式選單 */}
                                <select
                                    onChange={handleInputChange}
                                    className="form-select d-md-none mb-md-6 mb-3 border rounded-1 border-primary-black"
                                    aria-label="選擇遊玩地區"
                                    name="area"
                                    value={search.area.length > 0 ? search.area[0] : ""}
                                >
                                    <option value="">請選擇遊玩地區</option>
                                    {area.map((item, index) => (
                                        <option key={index} value={item.area_name}>
                                            {item.area_name}
                                        </option>
                                    ))}
                                </select>
                                {/* 電腦版checkbox */}
                                <div className="row m-0 mb-6 d-none d-md-flex">
                                    <div className="col-md-6 mx-0 p-0 w-auto">
                                        {area.slice(0, area.length / 2).map((item, index) => (
                                            <div key={index} className="form-check mb-4 me-6">
                                                <input
                                                    onChange={handleInputChange}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.area_name}
                                                    id={item.area_value}
                                                    name="area"
                                                    checked={search.area.includes(item.area_name)}
                                                />
                                                <label
                                                    className="form-check-label text-nowrap"
                                                    htmlFor={item.area_value}
                                                >
                                                    {item.area_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-6 m-0 p-0">
                                        {area.slice(area.length / 2).map((item, index) => (
                                            <div className="form-check mb-4" key={index}>
                                                <input
                                                    onChange={handleInputChange}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.area_name}
                                                    id={item.area_value}
                                                    name="area"
                                                    checked={search.area.includes(item.area_name)}
                                                />
                                                <label
                                                    className="form-check-label text-nowrap"
                                                    htmlFor={item.area_value}
                                                >
                                                    {item.area_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-12 col1">
                            <div className="people">
                                <p className="h5 pb-4 fw-bold">遊玩人數</p>
                                <select
                                    onChange={handleInputChange}
                                    className="form-select mb-md-6 mb-3 border rounded-1 border-primary-black"
                                    aria-label="選擇遊玩人數"
                                    name="game_people"
                                    value={search.game_people}
                                >
                                    <option value="">請選擇遊玩人數</option>
                                    {Array.from({ length: Number(maxPeople) }).map((_, index) => (
                                        <option key={index} value={index + 1}>
                                            {index + 1}人
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 難度、主題 */}
                <div className="d-flex w-100">
                    <div className="row w-100 row1 flex-md-column">
                        <div className="col-6 col-md-12 col1">
                            <div className="difficulty">
                                <p className="h5 pb-4 fw-bold">難度</p>
                                {/* 手機板下拉式選單 */}
                                <select
                                    onChange={handleInputChange}
                                    className="form-select d-md-none mb-md-6 mb-3 border rounded-1 border-primary-black"
                                    aria-label="選擇難度"
                                    name="difficulty"
                                    value={
                                        search.difficulty.length > 0 ? search.difficulty[0] : ""
                                    }
                                >
                                    <option value="">請選擇難度</option>
                                    {difficultys.map((difficulty) => (
                                        <option
                                            key={difficulty.difficulty_id}
                                            value={difficulty.difficulty_id}
                                        >
                                            {difficulty.difficulty_name}
                                        </option>
                                    ))}
                                </select>

                                {/* 電腦版核取方塊 */}
                                <div className="row m-0 mb-6 d-none d-md-flex">
                                    <div className="col-md-6 mx-0 p-0 w-auto">
                                        {difficultys
                                            .slice(0, Math.round(difficultys.length / 2))
                                            .map((difficulty) => (
                                                <div
                                                    className="form-check mb-4 me-6"
                                                    key={difficulty.difficulty_id}
                                                >
                                                    <input
                                                        onChange={handleInputChange}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={difficulty.difficulty_id}
                                                        id={difficulty.difficulty_id}
                                                        name="difficulty"
                                                        checked={search.difficulty.includes(
                                                            String(difficulty.difficulty_id)
                                                        )}
                                                    />
                                                    <label
                                                        className="form-check-label text-nowrap"
                                                        htmlFor={difficulty.difficulty_id}
                                                    >
                                                        {difficulty.difficulty_name}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="col-md-6 m-0 p-0">
                                        {difficultys
                                            .slice(Math.round(difficultys.length / 2))
                                            .map((difficulty) => (
                                                <div
                                                    className="form-check mb-4"
                                                    key={difficulty.difficulty_id}
                                                >
                                                    <input
                                                        onChange={handleInputChange}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={difficulty.difficulty_id}
                                                        id={difficulty.difficulty_id}
                                                        name="difficulty"
                                                        checked={search.difficulty.includes(
                                                            String(difficulty.difficulty_id)
                                                        )}
                                                    />
                                                    <label
                                                        className="form-check-label text-nowrap"
                                                        htmlFor={difficulty.difficulty_id}
                                                    >
                                                        {difficulty.difficulty_name}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-12 col1">
                            <div className="topic">
                                <p className="h5 pb-4 fw-bold">主題</p>
                                {/* 手機板下拉式選單 */}
                                <select
                                    onChange={handleInputChange}
                                    className="form-select d-md-none mb-md-6 mb-3 border rounded-1 border-primary-black"
                                    aria-label="選擇主題類別"
                                    name="property"
                                    value={search.property.length > 0 ? search.property[0] : ""}
                                >
                                    <option value="">請選擇主題類別</option>
                                    {propertys.map((property) => (
                                        <option
                                            key={property.property_id}
                                            value={property.property_id}
                                        >
                                            {property.property_name}
                                        </option>
                                    ))}
                                </select>

                                {/* 電腦版核取方塊 */}
                                <div className="row m-0 mb-6 d-none d-md-flex">
                                    <div className="col-md-6 mx-0 p-0 w-auto">
                                        {propertys
                                            .slice(0, propertys.length / 2)
                                            .map((property) => (
                                                <div
                                                    className="form-check mb-4 me-6"
                                                    key={property.property_id}
                                                >
                                                    <input
                                                        onChange={handleInputChange}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={property.property_id}
                                                        id={property.property_name}
                                                        name="property"
                                                        checked={search.property.includes(
                                                            String(property.property_id)
                                                        )}
                                                    />
                                                    <label
                                                        className="form-check-label text-nowrap"
                                                        htmlFor={property.property_name}
                                                    >
                                                        {property.property_name}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="col-md-6 m-0 p-0">
                                        {propertys.slice(propertys.length / 2).map((property) => (
                                            <div
                                                className="form-check mb-4"
                                                key={property.property_id}
                                            >
                                                <input
                                                    onChange={handleInputChange}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={property.property_id}
                                                    id={property.property_name}
                                                    name="property"
                                                    checked={search.property.includes(
                                                        String(property.property_id)
                                                    )}
                                                />
                                                <label
                                                    className="form-check-label text-nowrap"
                                                    htmlFor={property.property_name}
                                                >
                                                    {property.property_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <button className="btn btn-secondary-60 link-white rounded-2 w-100">
                        搜尋
                    </button>
                </div>
            </form>
            <div className="px-4">
                <button
                    onClick={handleReset}
                    className="btn w-100 reset_button border-0 text-primary-black fw-bold text-sm-center text-end"
                >
                    重置
                </button>
            </div>
        </div>
    );
};

SearchForm.propTypes = {
    search: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    area: PropTypes.array.isRequired,
    difficultys: PropTypes.array.isRequired,
    propertys: PropTypes.array.isRequired,
    maxPeople: PropTypes.number.isRequired,
};

export default SearchForm;
