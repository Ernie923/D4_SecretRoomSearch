import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function GroupCard({ game, group, user }) {
    return (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-6">
            <Link to={`/TeamBuyComment/${group.group_id}`}>
                <div className="card p-3 rounded-6 ">
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
                                <div className="row">
                                    <div className="col-6">
                                        <img
                                            src={user.user_sex === '男' ? './icon/man.png' : user.user_sex === '女' ? './icon/woman.png' : './icon/user.png'}
                                            alt={user.user_name}
                                            className="rounded-circle"
                                            style={{
                                                width: "40%",
                                                objectFit: "cover",
                                                aspectRatio: "1/1",
                                            }}
                                        />
                                    </div>
                                    <h6 className="card-title col-6 mb-1 mb-md-2 text-primary-black fw-bold lh-base">
                                        {user.user_name}
                                    </h6>
                                </div>
                                <h6 className="card-title mb-1 mb-md-2 text-primary-black fw-bold lh-base">
                                    {game.game_name}
                                </h6>
                                <p className="card-text text-nature-40 mb-3 fw-bold fs-Body-2">
                                    {game.game_address.slice(0, 3)}
                                </p>
                                <p className="card-text text-nature-40 mb-3 fw-bold fs-Body-2">
                                    {group.group_active_date}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- 手機版標籤在底部 --> */}
                    <div className="tags d-flex flex-wrap fs-Body-2 gap-2 mt-3 ">
                        <span className=" bg-nature-95 px-1 py-1 rounded-3  text-nowrap">
                            {game.game_dif_tagname}
                        </span>
                        <span className=" bg-nature-95 px-1 py-1 rounded-3 text-nowrap">
                            {game.game_main_tag1name}
                        </span>
                        <span className=" bg-nature-95 px-1 py-1 rounded-3  text-nowrap">
                            {game.game_main_tag2name}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
export default GroupCard;

// 添加 PropTypes 驗證
GroupCard.propTypes = {
    game: PropTypes.shape({
        game_img: PropTypes.string.isRequired,
        game_name: PropTypes.string.isRequired,
        game_address: PropTypes.string.isRequired,
        game_dif_tagname: PropTypes.string.isRequired,
        game_main_tag1name: PropTypes.string.isRequired,
        game_main_tag2name: PropTypes.string.isRequired,
    }).isRequired,
    group: PropTypes.shape({
        group_id: PropTypes.string.isRequired,
        group_active_date: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
        user_name: PropTypes.string.isRequired,
        user_sex: PropTypes.string.isRequired,
    }).isRequired,
};
