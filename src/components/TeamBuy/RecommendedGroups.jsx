import PropTypes from "prop-types";
import GroupCard from "../../layout/GroupCard";

const RecommendedGroups = ({
    group,
    isAllRecommendDisplay,
    handleSeeRecommendMore,
}) => {
    return (
        <div className="recommend my-5 my-md-10">
            <div className="title-container w-100 d-flex justify-content-center align-items-center">
                <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                    揪團專區
                </h3>
            </div>
            <div className="row m-0">
                {isAllRecommendDisplay
                    ? group
                        .map(({ game, group, user }) => (
                            <GroupCard
                                game={game}
                                group={group}
                                user={user}
                                key={group.group_id}
                            />
                        ))
                    : group
                        .slice(0, 8)
                        .map(({ game, group, user }) => (
                            <GroupCard
                                game={game}
                                group={group}
                                user={user}
                                key={group.group_id}
                            />
                        ))}
                <button
                    className={`btn btn-secondary-60 text-white  ${isAllRecommendDisplay ? "d-none" : ""}`}
                    onClick={() => handleSeeRecommendMore()}
                >
                    查看更多揪團
                </button>
                <button
                    className={`btn btn-secondary-60 text-white  ${isAllRecommendDisplay ? "" : "d-none"}`}
                    onClick={() => handleSeeRecommendMore()}
                >
                    顯示較少揪團
                </button>
            </div>
        </div>
    );
};

RecommendedGroups.propTypes = {
    group: PropTypes.array.isRequired,
    isAllRecommendDisplay: PropTypes.bool.isRequired,
    handleSeeRecommendMore: PropTypes.func.isRequired,
};

export default RecommendedGroups;
