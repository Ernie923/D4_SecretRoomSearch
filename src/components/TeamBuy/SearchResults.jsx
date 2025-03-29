import PropTypes from "prop-types";
import GroupCard from "../../layout/GroupCard";

const SearchResults = ({ searchGames, isHaveResultGames, group }) => {
    return (
        <div className="search my-5 my-md-10">
            <div className="title-container w-100 d-flex justify-content-center align-items-center">
                <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                    依據您的搜尋/排序結果如下
                </h3>
            </div>
            <div className="row m-0">
                <div className="row m-0">
                    {isHaveResultGames ? (
                        searchGames
                            .filter(
                                ({ group }) => new Date(group.group_active_date) >= new Date()
                            )
                            .map(({ game, group, user }) => (
                                <GroupCard
                                    game={game}
                                    group={group}
                                    user={user}
                                    key={group.game_id}
                                />
                            ))
                    ) : (
                        <div className="text-center">
                            <p className="h4">
                                您輸入的條件未查詢到相符合結果
                                <br />
                                請放寬條件重新查詢
                            </p>
                        </div>
                    )}
                </div>
                <div className="row m-0 mt-3">
                    <div className="title-container w-100 d-flex justify-content-center align-items-center">
                        <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                            相關推薦
                        </h3>
                    </div>
                    {/* 若 searchGames 中找不到相同 game_id 的項目，就保留該推薦 */}
                    {group
                        .slice(0, 4)
                        .filter(
                            ({ group }) => new Date(group.group_active_date) >= new Date()
                        )
                        .filter(({ game }) => {
                            return !searchGames.some(
                                (searchItem) => searchItem.game.game_id === game.game_id
                            );
                        })
                        .map(({ game, group, user }) => (
                            <GroupCard
                                game={game}
                                group={group}
                                user={user}
                                key={group.game_id}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

SearchResults.propTypes = {
    searchGames: PropTypes.array.isRequired,
    isHaveResultGames: PropTypes.bool.isRequired,
    group: PropTypes.array.isRequired,
};

export default SearchResults;
