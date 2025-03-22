import { Link } from "react-router-dom";

function CommendedGamesCard({ game }) {
  return (
    <div className="col2">
      <Link to={`/Game_content/${game.game_id}`}>
        <div className="card card-recommend p-3 rounded-6 ">
          <div className="row g-0 align-items-start h-100">
            <div className=" col-auto col-sm-12 ratio ratio-16x9">
              <picture
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <source media="(min-width: 576px)" srcSet={game.game_img[0]} />
                <img
                  src={game.game_img[0]}
                  alt={game.game_name}
                  className="card-photo rounded-3 w-100 img-fluid"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </picture>
            </div>

            {/* <!-- 手機板文字內容在右邊 --> */}
            <div className="col ms-3 ms-md-0">
              <div className="card-body p-0">
                <h6 className="card-title mb-1 mb-md-2 text-primary-black fw-bold lh-base">
                  {game.game_name}
                </h6>
                <p className="card-text text-nature-40 mb-3 fw-bold fs-Body-2">
                  {game.game_address.slice(0, 3)}
                </p>
                <p className="d-flex align-items-center mb-2">
                  <span className="rating dotted pe-3 fs-Body-2">
                    <img src="./icon/star.png" alt="star" className="pe-1" />
                    {game.game_score}
                  </span>
                  <span className="ps-2 fs-Body-2">
                    {game.game_score_num}人評論
                  </span>
                </p>
                <p className="d-flex align-items-start flex-md-row flex-column ">
                  <span className="dotted pe-md-3 fs-Body-2 pb-2 pb-md-0">
                    <img
                      src="./icon/person.png"
                      alt="star"
                      className="pe-1 fs-Body-2"
                    />
                    {game.game_minNum_Players}-{game.game_maxNum_Players} 人
                  </span>
                  <span className="ps-md-2  fs-Body-2">
                    <img src="./icon/price.png" alt="star" className="pe-1" />
                    每人 {game.game_min_price}元起
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* <!-- 手機版標籤在底部 --> */}
          <div className="tags d-flex flex-wrap fs-Body-2 gap-2 mt-3 ">
            <span className=" bg-nature-95 px-2 py-1 rounded-3  text-nowrap">
              {game.game_dif_tagname}
            </span>
            <span className=" bg-nature-95 px-2 py-1 rounded-3 text-nowrap">
              {game.game_main_tag1name}
            </span>
            <span className=" bg-nature-95 px-2 py-1 rounded-3  text-nowrap">
              {game.game_main_tag2name}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CommendedGamesCard;
